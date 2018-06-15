export { extendWithDefaultJestConfig } from "./configureProject";

// import {
//   copyDevDependenciesToPackageJSON,
//   createOrExtendTSConfigFileJSON,
//   createDefaultJestConfigJS
// } from "./configureProject";

import * as cli from "caporal";
// import { default as chalk } from "chalk";

export const main = (version: string, argv: string[]) =>
  cli
    .version(version)
    .option("--all", "Use all of the default options", cli.BOOL)
    .option(
      "--devDependencies",
      "Copy default `devDependencies` into `package.json`",
      cli.BOOL,
      null
    )
    .option("--tsconfig", "Create or extend `tsconfig.json`", cli.BOOL, null)
    .option("--tslint", "Create or extend `tslint.json`", cli.BOOL, null)
    .option("--jest", "Create default `jest.config.js`", cli.BOOL, null)
    .action((_args, options, logger) => {
      const configurationTasks = [
        "devDependencies",
        "tsconfig",
        "tslint",
        "jest"
      ].filter(
        taskName =>
          options[taskName] === true ||
          (options.all && options[taskName] !== false)
      );

      logger.info(`${configurationTasks}`);
    })
    .parse(argv);

// console.info(
// 	chalk.green("Making sure TypeScript, TSLint, and Jest are ready-to-go...")
// );

// copyDevDependenciesToPackageJSON();

// createOrExtendTSConfigFileJSON("tsconfig.json");
// createOrExtendTSConfigFileJSON("tslint.json");

// createDefaultJestConfigJS();

// console.info(chalk.bold.green("All set!"));
