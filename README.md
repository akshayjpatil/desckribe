# Desckribe

Lightweight CLI tool to instantly preview README or migration guide for any npm package

## Getting started

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

| Command                                 | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--release`                             | false   | Will fetch the latest release notes                                                                                                                                                                                                                                                                                                                                                                                                   |
| `--migrate <from-version> <to-version>` | -       | Will give instructions on upgrading version on a node package. Note: This is AI powered which is optional. You can use an OPENAI_API_KEY of your own to power this CLI tool. Visit [here](https://platform.openai.com/) for more about OpenAI API keys. Either you can manually add one to the `~/.desckriberc` or just run this command and it will prompt you to enter an API key and it will automatically save it for you locally |
| `--clear-key`                           | false   | Delete the saved OpenAI API key from local config                                                                                                                                                                                                                                                                                                                                                                                     |
| `--help` `-h`                           | false   | Will print all commands and instructions notes                                                                                                                                                                                                                                                                                                                                                                                        |
| `--version` `-v`                        | false   | Will print the installed version                                                                                                                                                                                                                                                                                                                                                                                                      |

# Contributing

Still a TODO as this is a fresh new projects. Ideas are welcome

# License

Desckribe is MIT licensed.
