import * as fs from "fs";
import * as path from "path";

import cli from "caporal";
import rimraf from "rimraf";
import { default as chalk } from "chalk";

import * as Log from "./Log";

const CONFIG_DIRECTORY_PATH = ".tst";

const packageJSON = JSON.parse(
  fs.readFileSync(path.join(__dirname, `../package.json`)).toString()
);

export = (argv: string[]) => cli.parse(argv);

cli.version(packageJSON.version);

cli
  .command("init", "Configure typescript-tooling in the current directory")
  .action((_args, _options, logger) => {
    logger.info("");

    if (fs.existsSync(CONFIG_DIRECTORY_PATH)) {
      rimraf.sync(CONFIG_DIRECTORY_PATH);
      logger.warn(Log.action(Log.info, "deleted", CONFIG_DIRECTORY_PATH));
    }

    fs.mkdirSync(CONFIG_DIRECTORY_PATH);

    logger.info(
      `${Log.action(
        Log.checkMark,
        "created",
        CONFIG_DIRECTORY_PATH
      )} ${chalk.dim.grey("(note: add to `.gitignore`)")}`
    );

    ["tsconfig.json", "tslint.json", "jest.config.js"].forEach(fileName => {
      const configFilePath = `./${CONFIG_DIRECTORY_PATH}/${fileName}`;

      fs.writeFileSync(
        configFilePath,
        fs.readFileSync(path.join(__dirname, `../${fileName}`)).toString()
      );

      logger.info(Log.action(Log.checkMark, "created", configFilePath));

      const contents = fs.existsSync(fileName) && fs.readFileSync(fileName);

      if (fileName === "jest.config.js") {
        if (contents) {
          return;
        }

        fs.writeFileSync(
          fileName,
          `module.exports = require("${configFilePath}");\n`
        );

        logger.info(Log.action(Log.checkMark, "created", fileName));

        return;
      }

      const config = contents ? JSON.parse(contents.toString()) : {};

      if (config.extends) {
        return;
      }

      fs.writeFileSync(
        fileName,
        JSON.stringify({ ...config, extends: configFilePath }, null, 2)
      );

      logger.info(
        Log.action(Log.checkMark, contents ? "extended" : "created", fileName)
      );
    });

    logger.info(
      `\n${chalk.dim("You can install")} ${chalk.dim.italic(
        "peerDependencies"
      )} ${chalk.dim("with this command...")}\n${installDependenciesCommand()}`
    );
  });

const installDependenciesCommand = () =>
  `npm install --save-dev ${Object.entries(packageJSON.peerDependencies)
    .map(([packageName, version]) => `${packageName}@${version}`)
    .join(" ")}`;
