import * as Log from "./Log";
import * as Shell from "./Shell";

export const help = `Install and save required ${Log.tool("peerDependencies")}`;

export const action = (packageJSON: any) => async (
  _args: any,
  options: any,
  logger: Logger
) => {
  logger.info("");

  const code = options.install
    ? await install(logger, packageJSON)
    : print(logger, packageJSON);

  process.exit(code || 0);
};

export const print = (logger: Logger, packageJSON: any) =>
  logger.info(
    `${Log.notification(Log.icons.info)} Install ${Log.tool(
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
