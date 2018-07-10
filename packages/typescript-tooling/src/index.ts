import * as cli from "caporal";
import { default as chalk } from "chalk";

// import {
//   Action,
//   copyDevDependenciesToPackageJSON,
//   createOrExtendTSConfigFileJSON,
//   createDefaultJestConfigJS
// } from "~/config-tasks";

// const enum Tasks {
//   DEV_DEPENDENCIES = "devDependencies",
//   TS_CONFIG = "tsconfig",
//   TS_LINT = "tslint",
//   JEST = "jest"
// }

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
      // const configurationTasks = [
      //   Tasks.DEV_DEPENDENCIES,
      //   Tasks.TS_CONFIG,
      //   Tasks.TS_LINT,
      //   Tasks.JEST
      // ].filter(
      //   taskName =>
      //     options[taskName] === true ||
      //     (options.all && options[taskName] !== false)
      // );

      // if (!configurationTasks.length) {
      //   logger.info(chalk.dim("Nothing to do..."));
      //   return;
      // }

      // logger.info(chalk.dim("Setting up your TypeScript environment..."));

      // if (configurationTasks.includes(Tasks.DEV_DEPENDENCIES)) {
      //   const action = copyDevDependenciesToPackageJSON();

      //   if (action === Action.EXTENDED) {
      //     logger.info(
      //       `${log.checkMark} Extended ${log.fileName(
      //         "package.json"
      //       )} with default \`devDependencies\``
      //     );
      //   }
      // }

      // const runCreateOrExtendTSConfigFileJSON = (
      //   fileName: string,
      //   extendsValue: string
      // ) => {
      //   const action = createOrExtendTSConfigFileJSON(fileName, extendsValue);

      //   if (action !== Action.NONE) {
      //     logger.info(`${log.checkMark} ${action} ${log.fileName(fileName)}`);
      //   }
      // };

      // if (configurationTasks.includes(Tasks.TS_CONFIG)) {
      //   runCreateOrExtendTSConfigFileJSON(
      //     "tsconfig.json",
      //     `./node_modules/typescript-tooling/dist/DefaultConfigs/tsconfig.json`
      //   );
      // }

      // if (configurationTasks.includes(Tasks.TS_LINT)) {
      //   runCreateOrExtendTSConfigFileJSON(
      //     "tslint.json",
      //     "typescript-tooling/tslint"
      //   );
      // }

      // if (configurationTasks.includes(Tasks.JEST)) {
      //   const action = createDefaultJestConfigJS();

      //   if (action === Action.CREATED) {
      //     logger.info(
      //       `${log.checkMark} Created ${log.fileName("jest.config.js")}`
      //     );
      //   }
      // }

      logger.info(chalk.bold.green("All set!"));
    })
    .parse(argv);

// const log = {
//   checkMark: chalk.green("✓"),
//   fileName: (name: string) => chalk.blue(name),
//   code: (name: string) => `\n${chalk.dim(name)}`
// };
