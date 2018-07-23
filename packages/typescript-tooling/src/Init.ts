import * as FS from "fs";
import * as Path from "path";

import { default as Chalk } from "chalk";
import * as Rimraf from "rimraf";

import * as Log from "./Log";
import * as Scripts from "./Scripts";
import * as Dependencies from "./Dependencies";

const CONFIG_DIRECTORY_PATH = ".tst";

export const help = `Configures ${Log.tool(
  "Typescript Tooling"
)} in the current directory`;

export const action = (packageJSON: any, packages: string[]) => async (
  _args: any,
  options: any,
  logger: Logger
) => {
  logger.info("");
  logger.info(
    `${Log.notification(Log.icons.info)} Copying ${Log.tool(
      "TypeScript Tooling"
    )} defaults into ${Log.file(".tst")}, creating or extending config files...`
  );
  logger.info("");

  deleteOldConfigDirectory(logger);
  createConfigDirectory(logger);

  ["tsconfig.json", "tslint.json", "jest.config.js"].forEach(fileName =>
    createConfigFiles(logger, fileName)
  );

  logger.info("");
  options.scripts
    ? Scripts.save(logger, packages)
    : Scripts.print(logger, packages);

  logger.info("");
  const code = options.install
    ? await Dependencies.install(logger, packageJSON)
    : Dependencies.print(logger, packageJSON);

  if (code === undefined) {
    logger.info("");
  }

  if (code === undefined || code === 0) {
    logger.info(`${Log.success("All set!")}`);
  }

  process.exit(code || 0);
};

const createConfigDirectory = (logger: Logger) => {
  FS.mkdirSync(CONFIG_DIRECTORY_PATH);

  logger.info(
    `${Log.fileAction(
      Log.icons.checkMark,
      "Created",
      CONFIG_DIRECTORY_PATH
    )} ${Chalk.dim(`(note: add to ${Log.file(".gitignore")})`)}`
  );
};

const deleteOldConfigDirectory = (logger: Logger) => {
  if (!FS.existsSync(CONFIG_DIRECTORY_PATH)) {
    return;
  }

  Rimraf.sync(CONFIG_DIRECTORY_PATH);
  logger.warn(
    Log.fileAction(Log.icons.checkMark, "Deleted", CONFIG_DIRECTORY_PATH)
  );
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
