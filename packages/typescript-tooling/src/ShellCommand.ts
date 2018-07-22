import * as ChildProcess from "child_process";

import { default as Chalk } from "chalk";

import * as Log from "./Log";

export const exec = (logger: Logger, command: string) => {
  logger.info(
    `\n${Log.notification(Log.icons.info)} ${Chalk.dim(
      "Running command..."
    )}\n\n${Log.code(command)}\n`
  );

  const childProcess = ChildProcess.exec(command);

  process.stdin.on("data", data => childProcess.stdin.write(data));

  childProcess.stdout.on("data", data => logger.info(`${data}`));
  childProcess.stderr.on("data", data => logger.error(Chalk.red(`${data}`)));

  childProcess.on("close", code => {
    code === 0
      ? logger.info(Log.success("Command finished"))
      : logger.error(Log.error("Command failed!"));

    process.exit(code);
  });
};
