import { default as Chalk } from "chalk";

import * as Log from "./Log";
import * as Shell from "./Shell";

export const print = (logger: Logger, packageJSON: any) =>
  logger.info(
    `${Log.notification(Log.icons.info)} Install ${Chalk.italic(
      "peerDependencies"
    )} with this command...\n\n${Log.code(command(packageJSON))}`
  );

export const install = async (
  logger: Logger,
  packageJSON: any
): Promise<number> => Shell.exec(logger, command(packageJSON));

const command = (packageJSON: any) =>
  `npm install --save-dev ${all(packageJSON).join(" ")}`;

export const all = (packageJSON: any): string[] =>
  Object.entries(packageJSON.peerDependencies).map(
    ([packageName, version]) => `${packageName}@${version}`
  );
