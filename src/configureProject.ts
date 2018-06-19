import * as fs from "fs";
import merge from "deepmerge";

import * as DefaultConfigs from "./DefaultConfigs";

export const enum ACTION {
  NONE,
  EXTENDED = "Extended",
  CREATED = "Created"
}

export const copyDevDependenciesToPackageJSON = (): ACTION => {
  const packageJSONContents = JSON.parse(
    fs.readFileSync("package.json").toString()
  );

  const devDependenciesAreCorrect = Object.entries(
    DefaultConfigs.devDependencies
  ).reduce(
    (noMismatches, [packageName, version]) =>
      noMismatches &&
      packageJSONContents.devDependencies[packageName] === version,
    true
  );

  if (devDependenciesAreCorrect) {
    return ACTION.NONE;
  }

  const packageJSONContentsWithDevDependencies = {
    ...packageJSONContents,
    devDependencies: merge(
      DefaultConfigs.devDependencies,
      packageJSONContents.devDependencies || {}
    )
  };

  fs.writeFileSync(
    "package.json",
    JSON.stringify(packageJSONContentsWithDevDependencies, null, 2)
  );

  return ACTION.EXTENDED;
};

export const createOrExtendTSConfigFileJSON = (
  fileName: string,
  extendsValue: string
): ACTION => {
  const action = fs.existsSync(fileName) ? ACTION.EXTENDED : ACTION.CREATED;

  const TSConfigFileContents =
    action === ACTION.EXTENDED
      ? JSON.parse(fs.readFileSync(fileName).toString())
      : {};

  if (TSConfigFileContents.extends) {
    return ACTION.NONE;
  }

  const TSConfigFileContentsWithExtends = {
    extends: extendsValue,
    ...TSConfigFileContents
  };

  fs.writeFileSync(
    fileName,
    JSON.stringify(TSConfigFileContentsWithExtends, null, 2)
  );

  return action;
};

export const createDefaultJestConfigJS = (): ACTION => {
  if (fs.existsSync("jest.config.js")) {
    return ACTION.NONE;
  }

  fs.writeFileSync(
    "jest.config.js",
    `module.exports = require("typescript-tooling").extendWithDefaultJestConfig({});\n`
  );

  return ACTION.CREATED;
};

export const extendWithDefaultJestConfig = (existingJestConfig: any): any =>
  merge(DefaultConfigs.jestConfig, existingJestConfig);
