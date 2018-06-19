export { extendWithDefaultJestConfig } from "./configureProject";

import * as cli from "caporal";
import { default as chalk } from "chalk";

import {
  ACTION,
  copyDevDependenciesToPackageJSON,
  createOrExtendTSConfigFileJSON,
  createDefaultJestConfigJS
} from "./configureProject";

const enum TASKS {
  DEV_DEPENDENCIES = "devDependencies",
  TS_CONFIG = "tsconfig",
  TS_LINT = "tslint",
  JEST = "jest"
}

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
        TASKS.DEV_DEPENDENCIES,
        TASKS.TS_CONFIG,
        TASKS.TS_LINT,
        TASKS.JEST
      ].filter(
        taskName =>
          options[taskName] === true ||
          (options.all && options[taskName] !== false)
      );

      if (!configurationTasks.length) {
        logger.info(chalk.dim("Nothing to do..."));
        return;
      }

      logger.info(chalk.dim("Setting up your TypeScript environment..."));

      if (configurationTasks.includes(TASKS.DEV_DEPENDENCIES)) {
        const action = copyDevDependenciesToPackageJSON();

        if (action === ACTION.EXTENDED) {
          logger.info(
            `${log.checkMark} Extended ${log.fileName(
              "package.json"
            )} with default \`devDependencies\``
          );
        }
      }

      if (configurationTasks.includes(TASKS.TS_CONFIG)) {
        const fileName = "tsconfig.json";
        const action = createOrExtendTSConfigFileJSON(
          fileName,
          `./node_modules/typescript-tooling/dist/DefaultConfigs/${fileName}`
        );

        if (action !== ACTION.NONE) {
          logger.info(`${log.checkMark} ${action} ${log.fileName(fileName)}`);
        }
      }

      if (configurationTasks.includes(TASKS.TS_LINT)) {
        const fileName = "tslint.json";
        const action = createOrExtendTSConfigFileJSON(
          fileName,
          "typescript-tooling/tslint"
        );

        if (action !== ACTION.NONE) {
          logger.info(`${log.checkMark} ${action} ${log.fileName(fileName)}`);
        }
      }

      if (configurationTasks.includes(TASKS.JEST)) {
        const action = createDefaultJestConfigJS();

        if (action === ACTION.CREATED) {
          logger.info(
            `${log.checkMark} Created ${log.fileName("jest.config.js")}`
          );
        }
      }

      logger.info(chalk.bold.green("All set!"));
    })
    .parse(argv);

const log = {
  checkMark: chalk.green("✓"),
  fileName: (name: string) => chalk.blue(name),
  code: (name: string) => `\n${chalk.dim(name)}`
};
