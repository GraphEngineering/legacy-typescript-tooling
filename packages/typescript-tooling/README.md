# Typescript Tooling

# Motivation

It's a bit of a chore to set up a new TypeScript project... Usually it involves
copying over a `tsconfig.json`, `tslint.json`, and various other files from an
existing project. Not only is this tedious and error-prone, it also makes it
hard to maintain and enforce consistent tooling/settings between projects.

The purpose of this project is set up a ready-to-use TypeScript enviroment with
a single command based on an opinionated set of defaults which work for both
client and server code. Additionally, upgrading to new versions of Typescript
Tooling will keep your project in sync with the latest default configurations.

# Usage

```
⟩ npm install --save-dev typescript-tooling
⟩ npx tst --all && npm install
```

Hop into `src/index.ts` and you're ready-to-go, happy TypeScripting!

# Default Configurations

- all the defaults, it's possible to exclude items
- `npx tst --help`

## Project Structure

## NPM Scripts

## TSConfig

## TSLint

## Jest

## Nodemon

## Dependencies
