import * as fs from "fs";
import * as path from "path";

import merge from "deepmerge";

import * as log from "./log";
import * as DefaultConfigs from "./DefaultConfigs";

const DEFAULT_CONFIGS_PATH =
  "./node_modules/typescript-tooling/dist/DefaultConfigs/";

const JEST_CONFIG_FILE_NAME = "jest.config.js";
const JEST_CONFIG_FILE_CONTENTS = `module.exports = require("typescript-tooling").extendWithDefaultJestConfig({});\n`;

export const copyDevDependenciesToPackageJSON = () => {
  const packageJSONPath = pathForConfigFile("package.json");
  const packageJSONContents = JSON.parse(
    fs.readFileSync(packageJSONPath).toString()
  );

  const packageJSONContentsWithDevDependencies = {
    ...packageJSONContents,
    devDependencies: merge(
      packageJSONContents.devDependencies || {},
      DefaultConfigs.devDependencies
    )
  };

  fs.writeFileSync(
    packageJSONPath,
    JSON.stringify(packageJSONContentsWithDevDependencies, null, 2)
  );

  console.info(
    `${log.checkMark} Copied default ${log.fileName(
      "devDependencies"
    )} to ${log.fileName("package.json")}${log.code(
      JSON.stringify(DefaultConfigs.devDependencies, null, 2)
    )}`
  );
};

export const createOrExtendTSConfigFileJSON = (fileName: string) => {
  const TSConfigFilePath = pathForConfigFile(fileName);

  const [consoleInfoVerb, TSConfigFileContents] = fs.existsSync(
    TSConfigFilePath
  )
    ? ["Extended", JSON.parse(fs.readFileSync(TSConfigFilePath).toString())]
    : ["Created", {}];

  const TSConfigFileContentsWithExtends = {
    extends: `${DEFAULT_CONFIGS_PATH}${fileName}`,
    ...TSConfigFileContents
  };

  const TSConfigFileSettingsWithExtendsJSON = JSON.stringify(
    TSConfigFileContentsWithExtends,
    null,
    2
  );

  fs.writeFileSync(TSConfigFilePath, TSConfigFileSettingsWithExtendsJSON);

  console.info(
    `${log.checkMark} ${consoleInfoVerb} ${log.fileName(fileName)}${log.code(
      TSConfigFileSettingsWithExtendsJSON
    )}`
  );
};

export const createDefaultJestConfigJS = () => {
  const jestConfigJSPath = pathForConfigFile(JEST_CONFIG_FILE_NAME);

  if (fs.existsSync(jestConfigJSPath)) {
    return;
  }

  fs.writeFileSync(jestConfigJSPath, JEST_CONFIG_FILE_CONTENTS);

  console.info(
    `${log.checkMark} created ${log.fileName("jest.config.js")}${log.code(
      JEST_CONFIG_FILE_CONTENTS
    )}`
  );
};

export const extendWithDefaultJestConfig = (existingJestConfig: any): any =>
  merge(DefaultConfigs.jestConfig, existingJestConfig);

const pathForConfigFile = (fileName: string): string =>
  path.join(path.dirname(fs.realpathSync(__filename)), `../../../${fileName}`);
