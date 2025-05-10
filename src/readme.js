import axios from 'axios';
import { marked } from 'marked';

export async function fetchReadmeFromGitHub(pkg, octokit) {
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
    const readme = Buffer.from(data.content, 'base64').toString();
    console.log(marked(readme));
  } catch (err) {
    console.error('Failed to fetch README:', err.message);
  }
}