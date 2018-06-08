import * as fs from "fs";
import merge from "deepmerge";

import * as Config from "./Config";

export const mergeDevDependencies = (packageJSON: any): any => ({
  ...packageJSON,
  devDependencies: merge(Config.devDependencies, packageJSON.devDependencies)
});

export const extendDefaultJestConfig = (config: any): any =>
  merge(Config.jest, config);
