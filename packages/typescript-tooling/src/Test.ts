import * as Log from "./Log";
import * as Shell from "./Shell";

export const help = `Run tests with ${Log.tool("Jest")}`;

export const action = async (_args: any, options: any, logger: Logger) => {
  logger.info("");
  process.exit(Shell.run(logger, `npx jest${options.watch ? " --watch" : ""}`));
};
