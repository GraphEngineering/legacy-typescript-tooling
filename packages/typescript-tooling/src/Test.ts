import * as Log from "./Log";
import * as Shell from "./Shell";

export const help = `Run tests with ${Log.tool("Jest")}`;

export const action = async (args: any, options: any, logger: Logger) => {
  logger.info("");

  const watch = options.watch ? " --watch" : "";
  const pattern = `packages/${args.packageName}/**/*.spec.ts*`;
  const command = `npx jest${watch} ${pattern}`;

  process.exit(Shell.run(logger, command));
};
