import * as FS from "fs";
import * as Path from "path";

import { default as Chalk } from "chalk";
import * as Rimraf from "rimraf";

import * as Log from "./Log";

const CONFIG_DIRECTORY_PATH = ".tst";

export const action = (packageJSON: any) => (
  _args: {},
  _options: {},
  logger: Logger
) => {
  const peerDependencies = Object.entries(packageJSON.peerDependencies).map(
    ([packageName, version]) => `${packageName}@${version}`
  );

  logger.info(
    `\n${Log.notification(Log.icons.info)} ${Chalk.dim(
      "You can install"
    )} ${Chalk.dim.italic("peerDependencies")} ${Chalk.dim(
      "with this command..."
    )}\n\n${Log.code(`npm install --save-dev ${peerDependencies.join(" ")}`)}`
  );

  addScriptsToUserPackageJSON(logger);
  deleteOldConfigDirectory(logger);
  createConfigDirectory(logger);

  ["tsconfig.json", "tslint.json", "jest.config.js"].forEach(fileName =>
    createConfigFiles(logger, fileName)
  );

  logger.info(`\n${Log.success("All set!")}`);
};

const addScriptsToUserPackageJSON = (logger: Logger) => {
  const userPackageJSONContents =
    FS.existsSync("package.json") && FS.readFileSync("package.json");

  if (!userPackageJSONContents) {
    return;
  }

  const userPackageJSON = JSON.parse(userPackageJSONContents.toString());
  const scripts = { tst: "tst", ...userPackageJSON.scripts };

  FS.writeFileSync(
    "package.json",
    JSON.stringify({ scripts, ...userPackageJSON }, null, 2)
  );

  logger.info(
    `\n${Log.notification(Log.icons.info)} ${Chalk.dim("Added")} ${Log.code(
      "tst"
    )} ${Chalk.dim("script to")} ${Chalk.blue("package.json")}\n`
  );
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
    JSON.stringify({ ...config, extends: configFilePath }, null, 2)
  );

  logger.info(
    Log.fileAction(
      Log.icons.checkMark,
      fileContents ? "Extended" : "Created",
      fileName
    )
  );
};
