import axios from 'axios';
import chalk from 'chalk';
import { marked } from 'marked';


export async function fetchLatestRelease(pkg, octokit) {
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
      console.log(chalk.bold.blueBright('\nRelease Notes:\n'));
      console.log(marked(data.body));
    }
  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}`));
  }
}