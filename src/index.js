#!/usr/bin/env node

import { Octokit } from 'octokit';
import { setOptions } from 'marked';
import TerminalRenderer from 'marked-terminal';
import { fetchReadmeFromGitHub } from './readme.js'
import { fetchLatestRelease } from './release.js'
import { generateMigrationGuide } from './migrate.js';
import chalk from 'chalk';
import { config } from 'dotenv'
import { clearApiKeyFromConfig, getHelperForDesckribe } from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

config();

setOptions({
  renderer: new TerminalRenderer(),
});

if (process.argv.includes('--clear-key')) {
  await clearApiKeyFromConfig();
  console.log(chalk.green('OpenAI API key cleared.'));
  process.exit(0);
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  await getHelperForDesckribe();
  process.exit(0);
}

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const pkgJson = JSON.parse(readFileSync(path.join(__dirname, '..', 'package.json')));
  console.log(chalk.bold(`v${pkgJson.version}`))
  process.exit(0);
}

const octokit = new Octokit();
const pkg = process.argv[2];

if (!pkg) {
  console.log("Usage: npx desckribe <package-name>");
  process.exit(1);
}

const showRelease = process.argv.includes('--release');
const migrateFlag = process.argv.includes('--migrate');

if (showRelease) {
  await fetchLatestRelease(pkg, octokit);
} else if (migrateFlag) {
  const fromIndex = process.argv.indexOf('--migrate');
  const fromVer = process.argv[fromIndex + 1];
  const toVer = process.argv[fromIndex + 2];
  if (fromVer && toVer) {
    await generateMigrationGuide(pkg, octokit, fromVer, toVer)
  }
  else {
    console.log(chalk.red("SYNTAX ERROR: Please provide valid props to run this command"),
      chalk.bold.white.bgRed("desckribe <npm-package-name> --migrate <from-version> <to-version>"));
  }
} else {
  await fetchReadmeFromGitHub(pkg, octokit);
}