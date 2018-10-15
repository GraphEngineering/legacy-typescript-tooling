# Typescript Tooling // `tst`

A tool for creating and managing TypeScript projects with minimal configuration.

## Features

TypeScript Tooling...

- 🛠️ Provides reasonable defaults for [TypeScript](https://github.com/Microsoft/TypeScript), [TSLint](https://github.com/palantir/tslint), [Jest](https://github.com/facebook/jest), and [Nodemon](https://github.com/remy/nodemon)
- 🐉 Uses a monorepo project structure with help from [Lerna](https://github.com/lerna/lerna)
- 📦 Bundles packages into ready-to-use JavaScript with [Parcel](https://parceljs.org/)
- 🏗️ Installs and saves the `devDependencies` you need to get up and running
- 📝 Generates useful NPM scripts for your packages (`test`, `test:watch`, `dev`, and `build`)

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

Running `tst init` copies config files for various tools into a new `.tst`
directory in the root of your project. Under the hood, TST's CLI executes normal
commands which use those defaults. For example, `tst test <package-name>` runs
the command `npx jest packages/<package-name>` (which is also echo'ed out for
reference). This works since TST creates a `jest.config.js` at the root of your
project which extends `.tst/jest.config.js`. Settings and commands for other
tools operate the same way.

_Nothing special is happening here!_ You can always directly execute generated
commands without using TST. Since no magic is involved, it's easy to stop using
this tool, just move config files from `.tst` into the project root and add the
commands TST generates to the `scripts` section of your `package.json`. For
example...

```
// `package.json`

{
  "scripts": {
    "<package-name>:build": "tst build <package-name>"
  }
}
```

...would become...

```
// `package.json`

{
  "scripts": {
    "<package-name>:build": "parcel build packages/<package-name>/src/index.ts --out-dir packages/<package-name>/dist --target node"
  }
}
```

## What's in the defaults?

If you're interested in seeing what TST uses as its defaults for TypeScript,
Lerna, Nodemon, and Jest, check out the
[`configs` folder](https://github.com/cruhl/typescript-tooling/tree/master/packages/typescript-tooling/configs)
(most settings include comments). These files are copied into `.tst` during a
`tst init`.

### Overriding TypeScript and TSLint Settings

TypeScript and TSLint settings can be overwritten in the same way. TST creates
or modifies `<tsconfig|tslint>.json` in your project root to extend the defaults
in the `.tst` directory...

```
// `<tsconfig|tslint>.json`

{
  // TST adds this line if it isn't already set
  "extends": "./.tst/<tsconfig|tslint>.json"
}
```

If you want to add or modify any settings, `<tsconfig|tslint>.json` behaves just
as you'd expect, just modify the file...

```
// `tslint.json`

{
  "extends": "./.tst/tslint.json",
  "rules": {
    // Allow `console.log`s across all packages
    "no-console": false
  }
}
```

It's easy to change settings for individual packages. Imagine you want to enable
TypeScript's DOM library for a `ui` package, you would just need to create a
`tsconfig.json` in the `packages/ui` directory...

```
// `packages/ui/tsconfig.json`

{
  // Extend the base configuration in your project root
  "extends": "../../tsconfig.json",

  // Change the setting we're interested in...
  "compilerOptions": {
    "lib": ["es2018", "dom"]
  }
}
```

You can do the same thing for TSLint settings.

## Working with a Monorepo

## Creating a New Package

TypeScript Tooling is built to be used with
[Lerna](https://github.com/lerna/lerna), which means it's easy to separate
code into multiple packages within the same project. Want to have independently
versioned/deployed `types`, `api`, and `ui` packages? No problem!

Here's how to create a new package...

1. First, make a new folder at `packages/<package-name>`
2. Create `packages/<package-name>/package.json` and make sure its `name` field
   matches `<package-name>`. For packages only used within your project, make
   sure to set `"private": true`. _Private packages only require the `name` and
   `private` fields._

3. If this is a normal TypeScript package, don't forget TST looks for
   `packages/<package-name>/src/index.ts` as the entry point. You can generate
   TST's default npm scripts (`test`, `test:watch`, `dev`, and `build`) by
   running...

```
npm run tst:scripts
```

...or...

```
npx tst scripts
```

### Delegating NPM Scripts to Packages

It's useful to keep all the project's NPM scripts available from the root so you
aren't constantly bouncing around using `cd`. However, an overly complicated set
of NPM scripts in one gigantic `package.json` isn't so great.

Luckily, [Lerna](https://github.com/lerna/lerna) allows you to execute NPM
Scripts from any package without leaving the project root. Let's you want to use
[Parcel](https://parceljs.org/) to build deployable bundles for a `ui` package.
You can add the build script in `packages/ui/package.json`...

```json
// `packages/ui/package.json`

{
  "scripts": {
    "build": "parcel build public/index.html"
  }
}
```

To enable running `npm run ui:build` from the project root, we need to modify
the NPM script in `package.json`...

```
// `package.json`

{
  "scripts": {
    // Use Lerna to execute the NPM script defined in `packages/ui/package.json`
    "ui:build": "lerna run build --stream --scope ui"
  }
}
```

It's important to know `npx tst scripts` or `npm run tst:scripts` will not
override a script you've defined.

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
