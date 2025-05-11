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

| Command                                 | Default | Description                                                                                                                                                                                                                                             |
| --------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--release`                             | false   | Will fetch the latest release notes                                                                                                                                                                                                                     |
| `--migrate <from-version> <to-version>` | -       | Will give instructions on upgrading version on a node package. Note: This is AI powered which is optional. You can use an OPENAI_API_KEY of your own to power this CLI tool. Visit [here](https://platform.openai.com/) for more about OpenAI API keys. |

# Contributing

Still a TODO as this is a fresh new projects. Ideas are welcome

# License

Desckribe is MIT licensed.
