import * as FS from "fs";
import * as Path from "path";
import * as ChildProcess from "child_process";

import CLI from "caporal";
import { default as Chalk } from "chalk";

import * as Init from "./Init";
import * as Log from "./Log";

export = (argv: string[]) => CLI.parse(argv);

const packageJSON = JSON.parse(
  FS.readFileSync(Path.join(__dirname, `../package.json`)).toString()
);

CLI.version(packageJSON.version);

CLI.command(
  "init",
  "Configure typescript-tooling in the current directory"
).action(Init.action(packageJSON));

CLI.command("dev", "Run a package with nodemon using watch mode")
  .argument("<package name>", "The name of your package")
  .action(({ packageName }, _options, logger) => {
    const packagePath = `packages/${packageName}`;

    const project = FS.existsSync(`${packagePath}/tsconfig.json`)
      ? `--project ${packagePath}/tsconfig.json`
      : "";

    const nodemonExec = `ts-node ${project} --require tsconfig-paths/register ${packagePath}/src/index.ts`;

    shellCommand(
      `nodemon --watch ${packagePath}/src --ext ts,tsx --exec "${nodemonExec}"`,
      logger
    );
  });

const shellCommand = (command: string, logger: Logger) => {
  logger.info(
    `\n${Log.notification(Log.icons.info)} ${Chalk.dim(
      "Running command..."
    )}\n\n${Log.code(command)}\n`
  );

  const childProcess = ChildProcess.exec(command);

  childProcess.stdout.on("data", data => logger.info(`${data}`));
  childProcess.stderr.on("data", data => logger.error(Chalk.red(`${data}`)));

  childProcess.on("close", code => {
    code === 0
      ? logger.info(Log.success("Command finished"))
      : logger.error(Log.error("Command failed!"));

    process.exit(code);
  });
};
