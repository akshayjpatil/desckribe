import { NO_REPO_FOUND } from './constants.js';

export class GitNotFoundError extends Error {
  constructor(pkg) {
    super(new Error(
      `No GitHub repo found for https://registry.npmjs.org/${pkg}`,
      {
        cause: NO_REPO_FOUND
      })
    );
  }
}

export class InvalidGitRepoError extends Error {
  constructor(repoUrl) {
    super(new Error(
      `404 NOT_FOUND: No GitHub repo found at: ${repoUrl}`,
      {
        cause: NO_REPO_FOUND
      })
    );
  }
}