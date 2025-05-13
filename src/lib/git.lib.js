import axios from 'axios';
import { GitNotFoundError, InvalidGitRepoError } from '../util/error.utils.js';

export async function getGitRepoOfNpmPkg(pkg) {
  let res;
  try {
    res = await axios.get(`https://registry.npmjs.org/${pkg}`);
    const repoUrl = res.data.repository?.url;

    if (!repoUrl || !repoUrl.includes('github.com'))
      throw new GitNotFoundError(pkg)
    const match = repoUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
    if (!match)
      throw new InvalidGitRepoError(repoUrl)
    const [, owner, repo] = match;

    return { owner, repo }
  } catch (e) {
    if (e instanceof InvalidGitRepoError)
      console.error(e.message);
    else if (e instanceof GitNotFoundError)
      return { readme: res.data.readme }
  }

}