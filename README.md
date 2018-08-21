# Typescript Tooling // `tst`

A tool for creating and managing TypeScript projects with minimal configuration.

## Features

- 🛠️ Reasonable defaults for [TypeScript](https://github.com/Microsoft/TypeScript), [TSLint](https://github.com/palantir/tslint), and [Jest](https://github.com/facebook/jest)
- 🐉 Opinionated monorepo project structure using [Lerna](https://github.com/lerna/lerna)
- 📦 Installs and saves required `devDependencies`
- 📝 Generates `npm scripts` for your packages (`test`, `test:watch`, `dev`, `build`)

## Getting Started

1. Install `tst`

```
npm install --save-dev typescript-tooling
```

2. Run the `init` command

```
npx tst init
```

3. **That's it!** Test the example package with...

```
npm run example:test
```

## Usage

```
⟩ npx tst help

   tst 3.0.3 - TypeScript Tooling

   USAGE

     tst <command> [options]

   COMMANDS

     init                      Configure Typescript Tooling in the current directory
     deps                      Install and save required peerDependencies
     scripts                   Automatically manage npm scripts for packages
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
