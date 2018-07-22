import * as FS from "fs";
import * as Path from "path";

import { default as Chalk } from "chalk";
import * as Rimraf from "rimraf";

import * as Log from "./Log";
import * as Scripts from "./Scripts";
import * as PeerDependencies from "./PeerDependencies";

const CONFIG_DIRECTORY_PATH = ".tst";

export const action = (packageJSON: any, packages: string[]) => (
  _args: {},
  _options: {},
  logger: Logger
) => {
  logger.info("");
  deleteOldConfigDirectory(logger);
  createConfigDirectory(logger);

  ["tsconfig.json", "tslint.json", "jest.config.js"].forEach(fileName =>
    createConfigFiles(logger, fileName)
  );

  logger.info("");
  Scripts.print(logger, packages);

  logger.info("");
  PeerDependencies.print(logger, packageJSON);

  logger.info("");
  logger.info(`${Log.success("All set!")}`);
};

const createConfigDirectory = (logger: Logger) => {
  FS.mkdirSync(CONFIG_DIRECTORY_PATH);

  logger.info(
    `${Log.fileAction(
      Log.icons.checkMark,
      "Created",
      CONFIG_DIRECTORY_PATH
    )} ${Chalk.dim.grey("(note: add to `.gitignore`)")}`
  );
};

const deleteOldConfigDirectory = (logger: Logger) => {
  if (!FS.existsSync(CONFIG_DIRECTORY_PATH)) {
    return;
  }

  Rimraf.sync(CONFIG_DIRECTORY_PATH);
  logger.warn(Log.fileAction(Log.icons.info, "Deleted", CONFIG_DIRECTORY_PATH));
};

const createConfigFiles = (logger: Logger, fileName: string) => {
  const configFilePath = `./${CONFIG_DIRECTORY_PATH}/${fileName}`;

  FS.writeFileSync(
    configFilePath,
    FS.readFileSync(Path.join(__dirname, `../${fileName}`)).toString()
  );

  logger.info(
    Log.fileAction(
      Log.icons.checkMark,
      "Created",
      configFilePath.replace("./", "")
    )
  );

  const contents =
    FS.existsSync(fileName) && FS.readFileSync(fileName).toString();

  if (fileName === "jest.config.js") {
    createJestConfigFile(logger, fileName, contents, configFilePath);
  } else {
    extendOrCreateUserConfigFile(logger, fileName, contents, configFilePath);
  }
};

const createJestConfigFile = (
  logger: Logger,
  fileName: string,
  fileContents: string | false,
  configFilePath: string
) => {
  if (fileContents) {
    return;
  }

  FS.writeFileSync(
    fileName,
    `module.exports = require("${configFilePath}");\n`
  );

  logger.info(Log.fileAction(Log.icons.checkMark, "Created", fileName));
};

const extendOrCreateUserConfigFile = (
  logger: Logger,
  fileName: string,
  fileContents: string | false,
  configFilePath: string
) => {
  const config = fileContents ? JSON.parse(fileContents) : {};

  if (config.extends) {
    return;
  }

  FS.writeFileSync(
    fileName,
    `${JSON.stringify({ ...config, extends: configFilePath }, null, 2)}`
  );

  logger.info(
    Log.fileAction(
      Log.icons.checkMark,
      fileContents ? "Extended" : "Created",
      fileName
    )
  );
};
