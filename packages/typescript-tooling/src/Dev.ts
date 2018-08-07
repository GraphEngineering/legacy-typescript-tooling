import * as FS from "fs";

import * as Log from "./Log";
import * as Shell from "./Shell";
import * as Utils from "./Utils";

export const help = `Run a package with ${Log.tool("nodemon")}`;

export const action = async (
  { packageName }: any,
  _options: any,
  logger: Logger
) => {
  const packagePath = Utils.packagePath(packageName);
  const TSConfigPath = FS.existsSync(`${packagePath}/tsconfig.json`)
    ? `${packagePath}/tsconfig.json`
    : `tsconfig.json`;

  const nodemonExec = `ts-node --project ${TSConfigPath} --require tsconfig-paths/register ${packagePath}/src/index.ts`;
  const command = `nodemon --watch ${packagePath}/src --ext ts,tsx --exec "${nodemonExec}"`;
  const status = Shell.run(logger, command);

  logger.info("");
  process.exit(status);
};
