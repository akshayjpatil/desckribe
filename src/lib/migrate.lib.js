import chalk from 'chalk';
import { marked } from 'marked';
import { fetchRelevantReleases, fetchLatestRelease } from './release.lib.js';
import ora from 'ora';

export async function generateMigrationGuideForLatestRelease(pkg, ocktokit, ai) {
  const fetchingRelease = ora(`Fetching the latest release for ${pkg}...`).start()
  const latestRelease = await fetchLatestRelease(pkg, ocktokit);
  fetchingRelease.stop();

  console.log(chalk.bold.green(`\nLatest Release: ${latestRelease.name} (${latestRelease.tag_name})`));
  console.log(chalk.gray(`Published on: ${new Date(latestRelease.published_at).toLocaleString()}`));
  console.log(chalk.cyan(`\nAuthor: ${latestRelease.author.login}`));

  if (ai === 'raw') {
    if (latestRelease.body) {
      console.log(chalk.bold.blueBright('\nRelease Notes:\n'));
      console.log(marked(latestRelease.body));
    }
  }
  const aiLoading = ora('Generating latest release notes using AI...').start();
  const combinedNotes =
    `## ${latestRelease.tag_name} (${latestRelease.name})\n${latestRelease.body || ''}`
  const result = await ai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant that generates migration guides from software release notes.`,
      },
      {
        role: 'user',
        content: `Given the following release notes for ${pkg}, generate a clear, actionable migration guide.\n\n${combinedNotes}`
      }
    ],
    temperature: 0.5,
  });

  aiLoading.stop()
  const output = result.choices[0].message.content;
  console.log(chalk.greenBright('\nMigration Guide:\n'));
  console.log(marked(output));
}

export async function generateMigrationGuide(pkg, octokit, ai, fromVer, toVer) {
  const fetchingRelease = ora(`Fetching the relevant releases for ${pkg} from ${fromVer} to ${toVer}...`).start()
  const relevantReleases = await fetchRelevantReleases(pkg, octokit, fromVer, toVer);
  fetchingRelease.stop();

  const combinedNotes = relevantReleases.map(r =>
    `## ${r.tag_name} (${r.name})\n${r.body || ''}`
  ).join('\n\n');

  if (ai === 'raw') {
    console.log(marked(combinedNotes));
    return;
  }

  const aiLoading = ora('Generating migration guide using AI...').start();
  const result = await ai.chat.completions.create({
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

  aiLoading.stop();
  const output = result.choices[0].message.content;
  console.log(chalk.greenBright('\nMigration Guide:\n'));
  console.log(marked(output));
}