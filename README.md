# Desckribe [![NPM version](https://img.shields.io/npm/v/desckribe.svg?style=flat)](https://npmjs.com/package/desckribe) [![NPM downloads](https://img.shields.io/npm/dm/desckribe.svg?style=flat)](https://npmjs.com/package/desckribe)

Lightweight AI driven CLI tool to help you in understanding and upgrading NPM packages.

## Getting started

This is AI powered which is optional. You can use an OPENAI_API_KEY of your own to power this CLI tool. Visit [here](https://platform.openai.com/) for more about OpenAI API keys. Either you can manually add one to the `~/.desckriberc` or just run this command and it will prompt you to enter an API key and it will automatically save it for you locally. While running it for the first time it will prompt you to choose if you want raw results or AI driven.

### Option 1: With npm

Install it globally:

```shell
npm install -g desckribe
```

Then you can run:

```shell
desckribe <package-name>
```

### Option 2: With npx

No need to install and can run as one time use:

```shell
npx desckribe <package-name>
```

# Features

| Command                                 | Default | Description                                                                                                                                                                                                                                 |
| --------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--migrate <from-version> <to-version>` | -       | If only `from-version` provided it will fetch release notes for that version, if `to-version` is also given then it will fetch the migration guide for the range. If nothing is provided it will fetch release notes for the latest version |
| `--set-ai-token`                        | false   | Delete the saved OpenAI API key from local config                                                                                                                                                                                           |
| `--clear-ai-token`                      | false   | Delete the saved OpenAI API key from local config                                                                                                                                                                                           |
| `--help` `-h`                           | false   | Will print all commands and instructions notes                                                                                                                                                                                              |
| `--version` `-v`                        | false   | Will print the installed version                                                                                                                                                                                                            |

# Contributing

Check issues section for help wanted on new features and bugs. PRs and other issue reporting are welcomed.

# License

Desckribe is MIT licensed.
