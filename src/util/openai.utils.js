import fs from 'fs-extra';
import os from 'os';
import path from 'path';

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