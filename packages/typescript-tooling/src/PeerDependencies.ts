import { default as Chalk } from "chalk";

import * as Log from "./Log";

export const print = (logger: Logger, packageJSON: any) =>
  logger.info(
    `${Log.notification(Log.icons.info)} Install ${Chalk.italic(
      "peerDependencies"
    )} with this command...\n\n${Log.code(
      `npm install --save-dev ${all(packageJSON).join(" ")}`
    )}`
  );

export const all = (packageJSON: any): string[] =>
  Object.entries(packageJSON.peerDependencies).map(
    ([packageName, version]) => `${packageName}@${version}`
  );
