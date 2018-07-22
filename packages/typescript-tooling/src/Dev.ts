import * as FS from "fs";

import * as ShellCommand from "./ShellCommand";

export const action = ({ packageName }: any, _options: any, logger: Logger) => {
  const packagePath = `packages/${packageName}`;

  const project = FS.existsSync(`${packagePath}/tsconfig.json`)
    ? ` --project ${packagePath}/tsconfig.json `
    : " ";

  const nodemonExec = `ts-node${project}--require tsconfig-paths/register ${packagePath}/src/index.ts`;
  const command = `nodemon --watch ${packagePath}/src --ext ts,tsx --exec "${nodemonExec}"`;

  ShellCommand.exec(logger, command);
};
