# Typescript Tooling // `tst`

A tool for creating and managing TypeScript projects with minimal configuration.

## Features

TypeScript's developer experience is a major improvement over vanilla
JavaScript, however, it's still a hassle to configure and manage the tools
needed to be productive. That's why TypeScript Tooling (`tst`)...

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

Whenever `tst init` is executed, TST's default config files are written into the
`.tst` directory. Commands like `tst build <package-name>` simply run CLI
commands assuming those defaults are in place. For example,
`tst test <package-name>` runs the command `npx jest packages/<package-name>`.

Nothing special is happening here! Feel free to run these commands on your own
without using TST. Since no magic is involved, it's easy to stop using this
tool, just move the files in `.tst` to root of the project and add the commands
TST generates to the `scripts` section of your `package.json`.

## What's in the defaults?

If you're interested in seeing what TST uses as its defaults for TypeScript,
Lerna, Nodemon, and Jest, check out the
[`configs` folder](https://github.com/cruhl/typescript-tooling/tree/master/packages/typescript-tooling/configs).
These files are what's written into `.tst` during a `tst init`.

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
