const fs = require("fs");

console.log("Updating `package.json` with `devDependencies` from `typescript-tooling`.");

const localPackageJSON = require(`${process.env.INIT_CWD}/package`);
const toolingPackageJSON = require("./package.json");

localPackageJSON.devDependencies = {
	...localPackageJSON.devDependencies,
	...toolingPackageJSON.devDependencies
};

fs.writeFileSync(
	`${process.env.INIT_CWD}/package.json`,
	JSON.stringify(localPackageJSON, null, 2)
);

console.log("Making sure there is a `tsconfig.json` which extends the one from this package.");

let tsconfigJSON;

try {
	tsconfigJSON = require(`${process.env.INIT_CWD}/tsconfig`);
} catch (e) {
	tsconfigJSON = {};
}

tsconfigJSON.extends = "./node_modules/typescript-tooling/tsconfig";

fs.writeFileSync(
	`${process.env.INIT_CWD}/tsconfig.json`,
	JSON.stringify(tsconfigJSON, null, 2)
);


console.log("Making sure there is a `tslint.json` which extends the one from this package.");

let tslintJSON;

try {
	tslintJSON = require(`${process.env.INIT_CWD}/tslint`)
} catch (e) {
	tslintJSON = {};
}

tslintJSON.extends = "./node_modules/typescript-tooling/tslint.json";

fs.writeFileSync(
	`${process.env.INIT_CWD}/tslint.json`,
	JSON.stringify(tslintJSON, null, 2)
);
