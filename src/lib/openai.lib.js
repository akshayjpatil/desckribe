import prompts from 'prompts';
import chalk from 'chalk';
import { saveApiKeyToConfig } from '../util/openai.utils.js';

export async function generateAiApiKeyPrompter() {
  let apiKey;
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
    process.exit(0);
  } else if (response.action === 'raw') {
    console.log(chalk.green.bold(`Saved Raw results as option`));
    apiKey = response.action;
    await saveApiKeyToConfig(response.action);
    return apiKey
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

  const saveConfirm = await prompts({
    type: 'confirm',
    name: 'save',
    message: 'Would you like to save this API key for future use?',
    initial: true
  })

  if (saveConfirm.save) {
    await saveApiKeyToConfig(apiKey);
    console.log(chalk.green.bold(`Saved OpenAI key to ~/.desckriberc`))
    return apiKey;
  } else
    return null;
}