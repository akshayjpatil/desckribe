#!/usr/bin/env node

import { Octokit } from 'octokit';
import { setOptions } from 'marked';
import TerminalRenderer from 'marked-terminal';
import { fetchReadmeFromGitHub } from './readme.js'
import { fetchLatestRelease } from './release.js'

setOptions({
  renderer: new TerminalRenderer(),
});
const octokit = new Octokit();

const pkg = process.argv[2];
const showRelease = process.argv.includes('--release')

if (!pkg) {
  console.log("Usage: npx desckribe <package-name>");
  process.exit(1);
}

if (showRelease) {
  await fetchLatestRelease(pkg, octokit);
} else {
  await fetchReadmeFromGitHub(pkg, octokit);
}