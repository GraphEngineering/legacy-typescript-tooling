import { default as Chalk } from "chalk";

import * as Log from "./Log";

export const print = (logger: Logger, packages: string[]) =>
  logger.info(
    `${Log.notification(Log.icons.info)} These ${Chalk.italic(
      "npm scripts"
    )} can be added to your ${Log.file("package.json")}...\n\n${Log.code(
      JSON.stringify(all(packages), null, 2)
    )}`
  );

export const all = (packages: string[]) =>
  packages.reduce(
    (acc, packageName) => ({
      ...acc,
      [`${packageName}:test`]: `npm run tst test ${packageName}`,
      [`${packageName}:dev`]: `npm run tst dev ${packageName}`,
      [`${packageName}:build`]: `npm run tst build ${packageName}`
    }),
    {
      tst: "tst"
    }
  );
