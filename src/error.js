import { NO_REPO_FOUND } from './constants.js';

export class GitNotFoundError extends Error {
  constructor(message, readme) {
    super(new Error(message, { cause: NO_REPO_FOUND }));
    if (!readme) {
      console.error('No README found');
      process.exit(1);
    }
    this.readme = readme
  }
}