#!/usr/bin/env node

import { OpenAI } from 'openai';
import { Octokit } from 'octokit';
import { setOptions } from 'marked';
import TerminalRenderer from 'marked-terminal';
import chalk from 'chalk';
import { config } from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

import { generateUsageGuide } from './lib/describe.lib.js'
import { generateMigrationGuide, generateMigrationGuideForLatestRelease } from './lib/migrate.lib.js';
import { clearApiKeyFromConfig, getApiKeyFromConfig } from './util/openai.utils.js';
import { getHelperForDesckribe } from './util/cli.utils.js'
import { generateAiApiKeyPrompter } from './lib/openai.lib.js';

config();

setOptions({
  renderer: new TerminalRenderer(),
});

let apiKey = process.env.OPENAI_API_KEY || await getApiKeyFromConfig();

if (process.argv.includes('--set-ai-token')) {
  apiKey = await generateAiApiKeyPrompter();
  console.log(chalk.yellow('Warn: Desckribe will not generate any AI assisted notes'));
  console.log(chalk.blue('Info: It wil still print the raw notes/guides for you'));
  process.exit(0);
}

if (process.argv.includes('--clear-ai-token')) {
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
const migrateFlag = process.argv.includes('--migrate');


if (!apiKey) {
  apiKey = await generateAiApiKeyPrompter();
}
const ai = apiKey === 'raw' ? 'raw' : new OpenAI({ apiKey })

if (ai === 'raw') {
  console.log(chalk.yellow(`WARN: You're AI assistant is not configured`))
  console.log(chalk.yellow(`WARN: run '--set-ai-token' to setup your AI assistant \n`))
}

if (migrateFlag) {
  const fromIndex = process.argv.indexOf('--migrate');
  const fromVer = process.argv[fromIndex + 1];
  const toVer = process.argv[fromIndex + 2];
  if (fromVer && toVer) {
    await generateMigrationGuide(pkg, octokit, ai, fromVer, toVer)
  }
  else {
    await generateMigrationGuideForLatestRelease(pkg, octokit, ai);
  }
} else {
  await generateUsageGuide(pkg, octokit, ai);
}