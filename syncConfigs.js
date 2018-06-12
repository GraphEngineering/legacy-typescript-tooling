const fs = require("fs");

const DEFAULT_CONFIGS_PATH = "src/DefaultConfigs/";

const TSConfigJSON = fs
  .readFileSync(`${DEFAULT_CONFIGS_PATH}tsconfig.json`)
  .toString();

const TSConfigJSONWithFixedPaths = TSConfigJSON.replace(
  /..\/..\/..\/..\//g,
  ""
);

fs.writeFileSync("tsconfig.json", TSConfigJSONWithFixedPaths);
fs.copyFileSync(`${DEFAULT_CONFIGS_PATH}tslint.json`, "tslint.json");
