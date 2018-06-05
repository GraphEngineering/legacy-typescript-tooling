import merge from "deepmerge";

import * as Config from "./Config";

export const extendDefaultJestConfig = (config: any) =>
  merge(Config.jest, config);
