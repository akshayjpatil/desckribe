import chalk from 'chalk';
import { marked } from 'marked';
import { getGitRepoOfNpmPkg } from './git.lib.js';
import ora from 'ora';
import { fetchLatestRelease } from './release.lib.js';

export async function fetchReadmeFromGitHub(pkg, octokit) {
  try {
    const repo = await getGitRepoOfNpmPkg(pkg);

    if (repo?.readme)
      return repo.readme

    const { data } = await octokit.rest.repos.getReadme({ owner: repo.owner, repo: repo.repo });
    const readme = Buffer.from(data.content, 'base64').toString();

    return readme;
  } catch (err) {
    console.error(chalk.red(`\nError: ${err.message}`));
    process.exit(1);
  }
}


export async function generateUsageGuide(pkg, ocktokit, ai) {
  const fetchingReadme = ora(`Fetching usage guide for ${pkg}...`).start()
  const readme = await fetchReadmeFromGitHub(pkg, ocktokit);
  fetchingReadme.stop();

  const fetchingRelease = ora(`Fetching the latest release for ${pkg}...`).start()
  const latestRelease = await fetchLatestRelease(pkg, ocktokit);
  fetchingRelease.stop();

  console.log(chalk.bold.green(`\nLatest Release: ${latestRelease.name} (${latestRelease.tag_name})`));
  console.log(chalk.gray(`Published on: ${new Date(latestRelease.published_at).toLocaleString()}`));
  console.log(chalk.cyan(`\nAuthor: ${latestRelease.author.login}`));

  if (ai === 'raw') {
    console.log(marked(readme));
    return;
  }

  const aiLoading = ora('Generating AI assisted usage guide...').start();
  const result = await ai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant that generates usage guide by scanning README.md file from git repositories`,
      },
      {
        role: 'user',
        content: `Given the following README.md for ${pkg}, generate a clear, step by step usage guide of the software.\n\n${readme}`
      }
    ],
    temperature: 0.5,
  });

  aiLoading.stop()
  const output = result.choices[0].message.content;
  console.log(chalk.greenBright('\nUsage Guide:\n'));
  console.log(marked(output));
}