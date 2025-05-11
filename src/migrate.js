import semver from 'semver';
import chalk from 'chalk';
import prompts from 'prompts';
import { marked } from 'marked';
import { OpenAI } from 'openai';
import { getApiKeyFromConfig, saveApiKeyToConfig } from './config.js';

let apiKey = process.env.OPENAI_API_KEY || await getApiKeyFromConfig();
let openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function generateMigrationGuide(pkg, octokit, fromVer, toVer) {
  const npmRes = await fetch(`https://registry.npmjs.org/${pkg}`);
  const npmJson = await npmRes.json();
  const repoUrl = npmJson.repository?.url;

  if (!repoUrl || !repoUrl.includes('github.com')) {
    console.log(chalk.red('GitHub repository not found.'));
    return;
  }
  const match = repoUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
  if (!match) return;

  const [, owner, repo] = match;
  const { data: releases } = await octokit.rest.repos.listReleases({ owner, repo });
  const relevantReleases = releases
    .filter(r => r.tag_name && semver.valid(semver.coerce(r.tag_name)))
    .filter(r =>
      semver.gte(semver.coerce(r.tag_name), fromVer) &&
      semver.lte(semver.coerce(r.tag_name), toVer)
    )
    .sort((a, b) => semver.compare(semver.coerce(a.tag_name), semver.coerce(b.tag_name)));

  if (relevantReleases.length === 0) {
    console.log(chalk.red('No releases found in this version range.'));
    return;
  }

  const combinedNotes = relevantReleases.map(r =>
    `## ${r.tag_name} (${r.name})\n${r.body || ''}`
  ).join('\n\n');

  // Prompt if no API key
  if (!apiKey) {
    const response = await prompts({
      type: 'select',
      name: 'action',
      message: 'No OpenAI API key found. What would you like to do?',
      choices: [
        { title: 'Show raw changelogs instead', value: 'raw' },
        { title: 'Enter my OpenAI API key now', value: 'enter' },
        { title: 'Cancel', value: 'cancel' }
      ]
    });
    if (response.action === 'cancel') {
      console.log(chalk.gray('Cancelled.'));
      return;
    } else if (response.action === 'raw') {
      console.log(chalk.yellowBright('\nRaw Changelog:\n'));
      console.log(marked(combinedNotes));
      return;
    }
    const keyResponse = await prompts({
      type: 'password',
      name: 'key',
      message: 'Enter your OpenAI API key:'
    });
    apiKey = keyResponse.key;
    if (!apiKey || apiKey.length < 1 || !apiKey.startsWith('sk')) {
      console.log(chalk.red(`ERROR: Please enter a valid Open Ai API key. Please visit [here](https://platform.openai.com/) to create one if you don't have one already.`))
      return;
    }
    openai = new OpenAI({ apiKey });

    const saveConfirm = await prompts({
      type: 'confirm',
      name: 'save',
      message: 'Would you like to save this API key for future use?',
      initial: true
    })

    if (saveConfirm.save) {
      await saveApiKeyToConfig(apiKey);
      console.log(chalk.green.bold(`Saved OpenAI key to ~/.desckriberc`))
    }
  }

  console.log(chalk.cyan('\nGenerating migration guide using OpenAI...\n'));
  const result = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant that generates migration guides from software release notes.`,
      },
      {
        role: 'user',
        content: `Given the following release notes for ${pkg} between versions ${fromVer} and ${toVer}, generate a clear, actionable migration guide.\n\n${combinedNotes}`
      }
    ],
    temperature: 0.5,
  });

  const output = result.choices[0].message.content;
  console.log(chalk.greenBright('\nMigration Guide:\n'));
  console.log(marked(output));
}