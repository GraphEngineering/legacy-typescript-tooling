# Typescript Tooling

This package helps keep all Typescript configuration and tooling synced up
between seperate CryptoGraph projects.

The `postinstall` script updates your `package.json` with all of the required
`devDependencies` and ensures you have a `tsconfig.json` and a `tslint.json`
which extend the ones from this package.

Here's what that looks like...

## `tsconfig.json`
```js
{
	"extends": "./node_modules/typescript-tooling/tsconfig",

	// you can add more options and overwrites...
	"compilerOptions": {
		"outDir": "build"
	}
}
```

## `tslint.json`
```js
{
	"extends": "node_modules/typescript-tooling/tslint.json",

	// you can add more options and overwrites...
	"rules": {
		"no-submodule-imports": [
			true,
			"graphql-voyager/middleware"
		]
	}
}
```