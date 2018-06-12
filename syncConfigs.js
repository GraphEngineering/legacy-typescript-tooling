const fs = require("fs");

const { copyDevDependenciesToPackageJSON } = require("./dist");

const DEFAULT_CONFIGS_PATH = "src/DefaultConfigs/";

/*
  NOTE: This file exists since it's not possible to install a package into
  itself. It just makes sure the settings for this project are in sync with the
  default configurations this package exports.
*/

// sync `devDependencies`

const packageJSONContents = JSON.parse(
  fs.readFileSync("package.json").toString()
);

const packageJSONContentsWithDevDependencies = {
  ...packageJSONContents,
  devDependencies: {
    ...packageJSONContents.devDependencies,
    ...JSON.parse(
      fs.readFileSync(`${DEFAULT_CONFIGS_PATH}devDependencies.json`)
    )
  }
};

fs.writeFileSync(
  "package.json",
  JSON.stringify(packageJSONContentsWithDevDependencies, null, 2)
);

// sync `tsconfig.json`

const TSConfigJSON = fs
  .readFileSync(`${DEFAULT_CONFIGS_PATH}tsconfig.json`)
  .toString();

const TSConfigJSONWithFixedPaths = TSConfigJSON.replace(
  /..\/..\/..\/..\//g,
  ""
);

fs.writeFileSync("tsconfig.json", TSConfigJSONWithFixedPaths);

// sync `tslint.json`

fs.copyFileSync(`${DEFAULT_CONFIGS_PATH}tslint.json`, "tslint.json");
