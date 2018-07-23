import * as FS from "fs";

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

export const save = (logger: Logger, packages: string[]) => {
  const userPackageJSONContents = JSON.parse(
    FS.readFileSync("package.json").toString()
  );

  const scripts = all(packages);

  const updatedUserPackageJSONContents = {
    ...userPackageJSONContents,
    scripts: {
      ...scripts,
      ...userPackageJSONContents.scripts
    }
  };

  FS.writeFileSync(
    "package.json",
    JSON.stringify(updatedUserPackageJSONContents, null, 2)
  );

  logger.info(
    `${Log.notification(Log.icons.checkMark)} These ${Chalk.italic(
      "npm scripts"
    )} were added to your ${Log.file("package.json")}...\n\n${Log.code(
      JSON.stringify(scripts, null, 2)
    )}`
  );
};

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
