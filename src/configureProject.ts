import * as fs from "fs";
import * as path from "path";
import merge from "deepmerge";

import * as DefaultConfigs from "./DefaultConfigs";

export const copyDevDependenciesToPackageJSON = () => {
  const packageJSONPath = pathForConfigFile("package.json");
  const packageJSONConfig = JSON.parse(
    fs.readFileSync(packageJSONPath).toString()
  );

  const packageJSONConfigWithDevDependencies = {
    ...packageJSONConfig,
    devDependencies: merge(
      DefaultConfigs.devDependencies,
      packageJSONConfig.devDependencies
    )
  };

  fs.writeFileSync(
    packageJSONPath,
    JSON.stringify(packageJSONConfigWithDevDependencies, null, 2)
  );
};

export const createOrExtendTSConfigFileJSON = (fileName: string) => {
  const TSConfigFilePath = pathForConfigFile(fileName);

  const TSConfigFileSettings = fs.existsSync(TSConfigFilePath)
    ? JSON.parse(fs.readFileSync(TSConfigFilePath).toString())
    : {};

  const TSConfigFileSettingsWithExtends = {
    extends: `./node_modules/typescript-tooling/dist/DefaultConfigs/${fileName}`,
    ...TSConfigFileSettings
  };

  fs.writeFileSync(
    TSConfigFilePath,
    JSON.stringify(TSConfigFileSettingsWithExtends, null, 2)
  );
};

export const createDefaultJestConfigJS = () => {
  const jestConfigJSPath = pathForConfigFile("jest.config.js");

  if (fs.existsSync(jestConfigJSPath)) {
    return;
  }

  fs.writeFileSync(
    jestConfigJSPath,
    `module.exports = require("typescript-tooling").extendWithDefaultJestConfig({});\n`
  );
};

export const extendWithDefaultJestConfig = (existingJestConfig: any): any =>
  merge(DefaultConfigs.jestConfig, existingJestConfig);

const pathForConfigFile = (fileName: string): string =>
  path.join(path.dirname(fs.realpathSync(__filename)), `../../../${fileName}`);
