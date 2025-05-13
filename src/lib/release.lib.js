import chalk from 'chalk';
import semver from 'semver';
import { getGitRepoOfNpmPkg } from './git.lib.js';

export async function fetchLatestRelease(pkg, octokit) {
  try {
    const repo = await getGitRepoOfNpmPkg(pkg);

    if (repo.readme) {
      console.error(chalk.red(`\nError: No Release notes found`))
      process.exit(1);
    }


    const { data } = await octokit.rest.repos.getLatestRelease({ owner: repo.owner, repo: repo.repo });
    return data;
  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}`));
    process.exit(1);
  }
}

export async function fetchAllRelease(pkg, octokit) {
  try {
    const repo = await getGitRepoOfNpmPkg(pkg);

    if (repo?.readme)
      return repo.readme

    const { data: releases } = await octokit.rest.repos.listReleases({ owner, repo });
    return releases;
  } catch (err) {
    console.error(chalk.red(`\nError: ${error.message}`));
    process.exit(1);
  }
}

export async function fetchRelevantReleases(pkg, octokit, fromVer, toVer) {
  const releases = await fetchAllRelease(pkg, octokit);
  const relevantReleases = releases
    .filter(r => r.tag_name && semver.valid(semver.coerce(r.tag_name)))
    .filter(r =>
      semver.gte(semver.coerce(r.tag_name), fromVer) &&
      semver.lte(semver.coerce(r.tag_name), toVer)
    )
    .sort((a, b) => semver.compare(semver.coerce(a.tag_name), semver.coerce(b.tag_name)));

  if (relevantReleases.length === 0) {
    console.log(chalk.red('No releases found in this version range.'));
    process.exit(1);
  }

  return releases
}

