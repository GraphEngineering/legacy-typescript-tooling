const fs = require("fs");

console.log(
  "Updating `package.json` with `devDependencies` from `typescript-tooling`."
);

const localPackageJSON = require(`${process.env.INIT_CWD}/package`);
const devDependencies = require("./devDependencies.json");

localPackageJSON.devDependencies = {
  ...localPackageJSON.devDependencies,
  ...devDependencies
};

fs.writeFileSync(
  `${process.env.INIT_CWD}/package.json`,
  JSON.stringify(localPackageJSON, null, 2)
);

const extendJSONConfig = fileName => {
  console.log(
    `Making sure there is a \`${fileName}.json\` which extends the one from this package.`
  );

  let config;

  try {
    config = require(`${process.env.INIT_CWD}/${fileName}`);
  } catch (e) {
    config = {};
  }

  if (!config.extends)
    config.extends = `./node_modules/@cryptograph/typescript-tooling/${fileName}.json`;

  fs.writeFileSync(
    `${process.env.INIT_CWD}/${fileName}.json`,
    JSON.stringify(config, null, 2)
  );
};

extendJSONConfig("tsconfig");
extendJSONConfig("tslint");
