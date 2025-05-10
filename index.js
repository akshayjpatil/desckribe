#!/usr/bin/env node

import axios from 'axios';
import { Octokit } from 'octokit';
import marked from 'marked';
import TerminalRenderer from 'marked-terminal';

// Configure marked to use terminal renderer
marked.setOptions({
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

const pkg = process.argv[2];

if (!pkg) {
  console.log("Usage: npx npm-previewer <package-name>");
  process.exit(1);
}

console.log(`Fetching README for '${pkg}'...`);

const readme = await fetchReadmeFromGitHub(pkg);
if (readme) {
  console.log(marked(readme));
} else {
  console.log("README could not be retrieved.");
}
