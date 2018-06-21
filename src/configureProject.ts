import * as fs from "fs";
import merge from "deepmerge";

import * as DefaultConfigs from "./DefaultConfigs";

export const enum Action {
  NONE,
  EXTENDED = "Extended",
  CREATED = "Created"
}

export const copyDevDependenciesToPackageJSON = (): Action => {
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
    return Action.NONE;
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

  return Action.EXTENDED;
};

export const createOrExtendTSConfigFileJSON = (
  fileName: string,
  extendsValue: string
): Action => {
  const action = fs.existsSync(fileName) ? Action.EXTENDED : Action.CREATED;

  const TSConfigFileContents =
    action === Action.EXTENDED
      ? JSON.parse(fs.readFileSync(fileName).toString())
      : {};

  if (TSConfigFileContents.extends) {
    return Action.NONE;
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

export const createDefaultJestConfigJS = (): Action => {
  if (fs.existsSync("jest.config.js")) {
    return Action.NONE;
  }

  fs.writeFileSync(
    "jest.config.js",
    `module.exports = require("typescript-tooling").extendWithDefaultJestConfig({});\n`
  );

  return Action.CREATED;
};

export const extendWithDefaultJestConfig = (existingJestConfig: any): any =>
  merge(DefaultConfigs.jestConfig, existingJestConfig);
