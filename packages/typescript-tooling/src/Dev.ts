import * as FS from "fs";

import * as Log from "./Log";
import * as Shell from "./Shell";

export const help = `Run a package with ${Log.tool("nodemon")}`;

export const action = async (
  { packageName }: any,
  _options: any,
  logger: Logger
) => {
  const packagePath = `packages/${packageName}`;

  const project = FS.existsSync(`${packagePath}/tsconfig.json`)
    ? ` --project ${packagePath}/tsconfig.json `
    : " ";

  const nodemonExec = `ts-node${project}--require tsconfig-paths/register ${packagePath}/src/index.ts`;
  const command = `nodemon --watch ${packagePath}/src --ext ts,tsx --exec "${nodemonExec}"`;

  const code = await Shell.exec(logger, command);

  logger.info("");
  process.exit(code);
};
