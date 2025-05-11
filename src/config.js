import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import chalk from 'chalk';
import axios from 'axios';
import { GitNotFoundError } from './error.js';

const configPath = path.join(os.homedir(), '.desckriberc');

export async function saveApiKeyToConfig(apiKey) {
  await fs.writeJson(configPath, { OPENAI_API_KEY: apiKey }, { spaces: 2 })
}

export async function getApiKeyFromConfig() {
  if (await fs.pathExists(configPath)) {
    const config = await fs.readJson(configPath);
    return config.OPENAI_API_KEY
  }
  return null
}

export async function clearApiKeyFromConfig() {
  if (await fs.pathExists(configPath)) {
    await fs.remove(configPath)
  }
}

export async function getHelperForDesckribe() {
  console.log(`
${chalk.bold('desckribe')} - Instantly preview README or migration guide for any npm package
${chalk.bold('Usage:')}
  npx desckribe <package> [options]
${chalk.bold('Options:')}
  ${chalk.green('--release')}             Show the latest GitHub release notes for the package
  ${chalk.green('--migrate <from> <to>')} Generate an AI-powered migration guide between two versions
  ${chalk.green('--clear-key')}           Delete the saved OpenAI API key from local config
  ${chalk.green('--help, -h')}            Show this help menu
  ${chalk.green('--version, -v')}            Show the version installed
${chalk.bold('Examples:')}
  ${chalk.gray('# Preview README')}
  npx desckribe react
  ${chalk.gray('# Show latest release notes')}
  npx desckribe react --release
  ${chalk.gray('# Generate migration guide')}
  npx desckribe react --migrate 17.0.0 18.0.0
  ${chalk.gray('# Clear saved OpenAI key')}
  npx desckribe --clear-key
${chalk.bold('Notes:')}
  • If no OpenAI key is found, you'll be prompted to enter one (once).
  • It will be securely saved in ~/.desckriberc unless you opt out.
  • Works with most public npm packages backed by GitHub repos.
  `);
}

export async function getGitRepoOfNpmPkg(pkg) {
  const res = await axios.get(`https://registry.npmjs.org/${pkg}`);
  const repoUrl = res.data.repository?.url;

  if (!repoUrl || !repoUrl.includes('github.com'))
    throw new GitNotFoundError('No GitHub repo found, falling back to npm README.', res.data.readme)

  const match = repoUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
  if (!match)
    throw new GitNotFoundError('No GitHub repo found, falling back to npm README.', res.data.readme)
  const [, owner, repo] = match;

  return { owner, repo }
}