import * as fs from "fs";
import merge from "deepmerge";

import * as Config from "./Config";

const PACKAGE_JSON_PATH = "../package.json";

export const main = () => {
  const packageJSON = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH).toString());

  fs.writeFileSync(
    PACKAGE_JSON_PATH,
    JSON.stringify(mergeDevDependencies(packageJSON), null, 2)
  );
};

export const mergeDevDependencies = (packageJSON: any): any => ({
  ...packageJSON,
  devDependencies: merge(Config.devDependencies, packageJSON.devDependencies)
});

export const extendDefaultJestConfig = (config: any): any =>
  merge(Config.jest, config);
