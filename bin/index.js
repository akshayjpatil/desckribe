#!/usr/bin/env node

import axios from 'axios';
import { Octokit } from 'octokit';
import { marked, setOptions } from 'marked';
import TerminalRenderer from 'marked-terminal';
import chalk from 'chalk';

// Configure marked to use terminal renderer
setOptions({
  renderer: new TerminalRenderer(),
});

const octokit = new Octokit();

async function fetchReadmeFromGitHub(pkg) {
  try {
    const res = await axios.get(`https://registry.npmjs.org/${pkg}`);
    const repoUrl = res.data.repository?.url;

    if (!repoUrl || !repoUrl.includes('github.com')) {
      console.log('No GitHub repo found, falling back to npm README.');
      return res.data.readme || 'No README found.';
    }

    const match = repoUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
    if (!match) return res.data.readme || 'No README found.';

    const [, owner, repo] = match;

    const { data } = await octokit.rest.repos.getReadme({ owner, repo });
    return Buffer.from(data.content, 'base64').toString();
  } catch (err) {
    console.error('Failed to fetch README:', err.message);
    return null;
  }
}

async function fetchLatestRelease(pkg) {
  const res = await axios.get(`https://registry.npmjs.org/${pkg}`);
  const repoUrl = res.data.repository?.url;

  if (!repoUrl || !repoUrl.includes('github.com')) {
    console.log('No GitHub repo found, falling back to npm README.');
    return res.data.readme || 'No README found.';
  }

  const match = repoUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
  if (!match) return res.data.readme || 'No README found.';
  const [, owner, repo] = match;
  try {
    const { data } = await octokit.rest.repos.getLatestRelease({ owner, repo });
    console.log(chalk.bold.green(`\nLatest Release: ${data.name} (${data.tag_name})`));
    console.log(chalk.gray(`Published on: ${new Date(data.published_at).toLocaleString()}`));
    console.log(chalk.cyan(`\nAuthor: ${data.author.login}`));
    if (data.body) {
      console.log(chalk.white('\nRelease Notes:\n'));
      console.log(chalk.reset(data.body.trim().slice(0, 1000)) + (data.body.length > 1000 ? chalk.gray('\n...') : ''));
    }
    if (data.assets.length > 0) {
      console.log(chalk.yellow('\nAssets:'));
      data.assets.forEach(asset => {
        console.log(`- ${asset.name} (${(asset.size / 1024).toFixed(1)} KB)`);
      });
    }
    console.log();
  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}`));
  }
}

const pkg = process.argv[2];
const showRelease = process.argv.includes('--release')

if (!pkg) {
  console.log("Usage: npx desckribe <package-name>");
  process.exit(1);
}

if (showRelease) {
  await fetchLatestRelease(pkg);
} else {
  const readme = await fetchReadmeFromGitHub(pkg);
  if (readme) {
    console.log(marked(readme));
  } else {
    console.log("README could not be retrieved.");
  }
}