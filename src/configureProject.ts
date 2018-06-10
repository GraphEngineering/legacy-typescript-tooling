import * as fs from "fs";
import merge from "deepmerge";

import * as Config from "./DefaultConfigs";

const PACKAGE_JSON_PATH = "../../package.json";

export const copyDevDependenciesToPackageJSON = () => {
  const packageJSON = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH).toString());

  const packageJSONMerged = {
    ...packageJSON,
    devDependencies: merge(Config.devDependencies, packageJSON.devDependencies)
  };

  fs.writeFileSync(
    PACKAGE_JSON_PATH,
    JSON.stringify(packageJSONMerged, null, 2)
  );
};

export const createOrExtendTSConfigJSON = () => {
  const TSConfig = fs.existsSync("./blah/tsconfig.json")
    ? JSON.parse(fs.readFileSync("./blah/tsconfig.json").toString())
    : {};

  const TSConfigWithExtends = {
    extends: "./blah",
    ...TSConfig
  };

  fs.writeFileSync(
    "./blah/tsconfig.json",
    JSON.stringify(TSConfigWithExtends, null, 2)
  );
};

export const createOrExtendTSLintJSON = () => {
  const TSConfig = fs.existsSync("./blah/tsconfig.json")
    ? JSON.parse(fs.readFileSync("./blah/tsconfig.json").toString())
    : {};

  const TSConfigWithExtends = {
    extends: "./blah",
    ...TSConfig
  };

  fs.writeFileSync(
    "./blah/tsconfig.json",
    JSON.stringify(TSConfigWithExtends, null, 2)
  );
};

export const createJestConfigJS = () => {
  if (fs.existsSync("../jest.config.js")) {
    return;
  }

  fs.writeFileSync(
    "../jest.config.js",
    fs.readFileSync("./DefaultConfigs/jest.config.js")
  );
};

export const extendDefaultJestConfig = (config: any): any =>
  merge(Config.jest, config);
