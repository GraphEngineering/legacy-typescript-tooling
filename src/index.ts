import * as fs from "fs";
import merge from "deepmerge";

import * as Config from "./Config";

const PACKAGE_JSON_PATH = "../package.json";

export const configureDevDependencies = () => {
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

export const configureJest = () => {
  if (fs.existsSync("../jest.config.js")) {
    return;
  }

  fs.writeFileSync(
    "../jest.config.js",
    fs.readFileSync("./Config/jest.config.js")
  );
};

export const extendDefaultJestConfig = (config: any): any =>
  merge(Config.jest, config);
