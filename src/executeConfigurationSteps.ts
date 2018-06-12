import {
  copyDevDependenciesToPackageJSON,
  createOrExtendTSConfigFileJSON,
  createDefaultJestConfigJS
} from "./configureProject";

import { default as chalk } from "chalk";

console.info(chalk.bold.green("Making sure TypeScript is ready-to-go!"));

copyDevDependenciesToPackageJSON();

createOrExtendTSConfigFileJSON("tsconfig.json");
createOrExtendTSConfigFileJSON("tslint.json");

createDefaultJestConfigJS();

console.info(chalk.bold.green("All set!"));
