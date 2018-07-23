import * as FS from "fs";

import * as Log from "./Log";

export const help = `Automatically manages ${Log.tool(
  "npm scripts"
)} for your packages`;

export const action = (packages: string[]) => (
  _args: any,
  options: any,
  logger: Logger
) => {
  logger.info("");
  options.save ? save(logger, packages) : print(logger, packages);
};

export const print = (logger: Logger, packages: string[]) =>
  logger.info(
    `${Log.notification(Log.icons.info)} These ${Log.tool(
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
    `${Log.notification(Log.icons.checkMark)} These ${Log.tool(
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
      tst: "tst",
      ["tst:init"]: "npm run tst init",
      ["tst:scripts"]: "npm run tst scripts",
      ["tst:dependencies"]: "npm run tst dependencies"
    }
  );
