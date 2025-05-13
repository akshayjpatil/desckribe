import chalk from 'chalk';

export async function getHelperForDesckribe() {
  console.log(`
${chalk.bold('desckribe')} - Instantly preview README or migration guide for any npm package
${chalk.bold('Usage:')}
  npx desckribe <package> [options]
${chalk.bold('Options:')}
  ${chalk.green('--release')}             Show the latest GitHub release notes for the package
  ${chalk.green('--migrate <from> <to>')} Generate an AI-powered migration guide between two versions
  ${chalk.green('--clear-key')}           Delete the saved OpenAI API key from local config
  ${chalk.green('--help, -h')}            Show this help menu
  ${chalk.green('--version, -v')}            Show the version installed
${chalk.bold('Examples:')}
  ${chalk.gray('# Preview README')}
  npx desckribe react
  ${chalk.gray('# Show latest release notes')}
  npx desckribe react --release
  ${chalk.gray('# Generate migration guide')}
  npx desckribe react --migrate 17.0.0 18.0.0
  ${chalk.gray('# Clear saved OpenAI key')}
  npx desckribe --clear-key
${chalk.bold('Notes:')}
  • If no OpenAI key is found, you'll be prompted to enter one (once).
  • It will be securely saved in ~/.desckriberc unless you opt out.
  • Works with most public npm packages backed by GitHub repos.
  `);
}