# Typescript Tooling // `tst`

A tool for creating and managing TypeScript projects with minimal configuration.

## Features

TypeScript's developer experience is a major improvement over vanilla
JavaScript, however, configuring and managing everything needed to be productive
is still a major hassle. That's why TypeScript Tooling (`tst`)...

- 🛠️ Provides reasonable defaults for [TypeScript](https://github.com/Microsoft/TypeScript), [TSLint](https://github.com/palantir/tslint), [Jest](https://github.com/facebook/jest), and [Nodemon](https://github.com/remy/nodemon)
- 🐉 Uses a monorepo project structure with help from [Lerna](https://github.com/lerna/lerna)
- 📦 Installs and saves the `devDependencies` needed to get up and running
- 📝 Generates `npm scripts` for your packages (`test`, `test:watch`, `dev`, and `build`)

## Getting Started

1. Install `tst`

```
npm install --save-dev typescript-tooling
```

2. Run the `init` command

```
npx tst init
```

3. **That's it!**

Here's a few scripts to try...

```
npm run example:test
```

```
npm run example:dev
```

```
npm run example:build
```

## How does TST work?

TST writes its defaults to a folder (`.tst`) and then generates and runs CLI
commands assuming those defaults are in place. While running `npx tst init` in
an empty node project you should see something like this...

### Setting Up a Project

### Creating a New Package

## CLI Usage

```
npx tst help
```

```
tst 4.0.0 - TypeScript Tooling

USAGE

  tst <command> [options]

COMMANDS

  init                      Configure Typescript Tooling in the current directory
  deps                      Install and save required peerDependencies
  scripts                   Automatically generates npm scripts for packages
  test <package-name>       Run tests with Jest
  dev <package-name>        Run a package with nodemon
  build <package-name>      Build a package with Parcel
  help <command>            Display help for a specific command

GLOBAL OPTIONS

  -h, --help         Display help
  -V, --version      Display version
  --no-color         Disable colors
  --quiet            Quiet mode - only displays warn and error messages
  -v, --verbose      Verbose mode - will also output debug messages
```

## License

MIT
