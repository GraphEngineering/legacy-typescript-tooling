# Typescript Tooling // `tst`

A tool for creating and managing TypeScript projects with minimal configuration.

## Features

TypeScript's developer experience is a major improvement over vanilla
JavaScript, however, it's still a hassle to configure and manage the tools
needed to be productive. That's why TypeScript Tooling (`tst`)...

- 🛠️ Provides reasonable defaults for [TypeScript](https://github.com/Microsoft/TypeScript), [TSLint](https://github.com/palantir/tslint), [Jest](https://github.com/facebook/jest), and [Nodemon](https://github.com/remy/nodemon)
- 🐉 Uses a monorepo project structure with help from [Lerna](https://github.com/lerna/lerna)
- 📦 Bundles packages into ready-to-use JavaScript with [Parcel](https://parceljs.org/)
- 🏗️ Installs and saves the `devDependencies` needed to get up and running
- 📝 Generates NPM scripts for your packages (`test`, `test:watch`, `dev`, and `build`)

## Getting Started

1. Install `tst`... _ignore warnings for missing `peerDependencies`_

```
npm install --save-dev typescript-tooling
```

2. Run the `init` command...

```
npx tst init
```

3. _**That's it!**_ Here's a few scripts you can use with the example package...

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

Whenever `tst init` runs, config files for various tools are written to a new
`.tst` directory in your project. Under the hood TST's CLI executes normal
commands which use those defaults. For example, `tst test <package-name>` runs
the command `npx jest packages/<package-name>`. This works since TST creates
a `jest.config.js` at the root of your project which extends the defaults in
`.tst/jest.config.js`. Settings and commands for other tools operate the same
way.

_Nothing special is happening here!_ You can always directly execute generated
commands without using TST. Since no magic is involved, it's easy to stop using
this tool, just move the config files from `.tst` to the project root and add the
commands TST generates to the `scripts` section of your `package.json`. For
example... i.e.

```
{
  "scripts": {
    "<package-name>:build": "tst build <package-name>"
  }
}
```

...would become...

```
{
  "scripts": {
    "<package-name>:build": "parcel build packages/<package-name>/src/index.ts --out-dir packages/<package-name>/dist --target node"
  }
}
```

## What's in the defaults?

If you're interested in seeing what TST uses as its defaults for TypeScript,
Lerna, Nodemon, and Jest, check out the

<!-- [`configs` folder](https://github.com/cruhl/typescript-tooling/tree/master/packages/typescript-tooling/configs) -->

(most settings include comments). These files are what gets written into `.tst`
during a `tst init`.

## Working with a Monorepo

## Creating a New Package

TypeScript Tooling is built to be used with
[Lerna](https://github.com/lerna/lerna), which means it's easy to separate
code into multiple packages within the same project. Want to have independently
versioned/deployed `api` and `ui` packages? No problem!

1. First, make a new folder at `packages/<package-name>`
2. Create `packages/<package-name>/package.json` and make sure its `name` field
   matches `<package-name>`. For packages only used within your project, make
   sure to set `"private": true`. Private packages only require the `name` and
   `private` fields.

3. If this is a TypeScript package, remember TST looks for
   `packages/<package-name>/src/index.ts` as the entry point. You can generate
   TST's default npm scripts (`test`, `test:watch`, `dev`, and `build`) by
   running...

### Delegating NPM Scripts to Packages

It's useful to keep all the project's NPM scripts available from the root so you
aren't constantly bouncing around using `cd`. However, having an overly
complicated set of NPM scripts in one gigantic `package.json` isn't so great.

Luckily [Lerna](https://github.com/lerna/lerna) allows you to execute NPM
Scripts from any package without leaving the project root. Let's say you have a
package `ui` for your React front-end and want to use
[Parcel](https://parceljs.org/)

```
npm tst:scripts
```

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
