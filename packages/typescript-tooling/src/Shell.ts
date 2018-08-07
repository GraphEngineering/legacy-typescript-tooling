import * as ChildProcess from "child_process";

import * as Log from "./Log";

export const run = (logger: Logger, command: string) => {
  logger.info(
    `${Log.notification(Log.icons.info)} Running command...\n\n${Log.code(
      command
    )}`
  );

  logger.info("");

  const { status } = ChildProcess.spawnSync(command, [], {
    stdio: "inherit",
    shell: true
  });

  logger.info("");

  status === 0
    ? logger.info(`${Log.success("Command finished")}`)
    : logger.error(`${Log.error("Command failed!")}`);

  return status;
};
