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

const packages = FS.readdirSync("packages").filter(
  itemName => !itemName.includes(".")
);

CLI.version(packageJSON.version).description("TypeScript Tooling");

CLI.command("init", `Configure ${Log.tool("typescript-tooling")}`).action(
  Init.action(packageJSON)
);

CLI.command("dev", `Run a package with ${Log.tool("nodemon")}`)
  .help(`Run a package with ${Log.tool("nodemon")}.`)
  .argument("<package-name>", Log.packages(packages), packages)
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

CLI.command("test", `Test a package with ${Log.tool("Jest")}`)
  .help(
    `Run package tests with ${Log.tool("Jest")}. If ${Chalk.yellow(
      "[package-name]"
    )} isn't specified, all tests will run.`
  )
  .argument("[package-name]", Log.packages(packages), packages)
  .option("-w --watch", "Re-run tests on file changes", CLI.BOOLEAN, false)
  .action((_args, _options, logger) => {
    shellCommand(`echo "TODO!"`, logger);
  });

CLI.command("build", `Build a package with ${Log.tool("TypeScript")}`)
  .help(
    `Compile a package with ${Log.tool("TypeScript")}. If ${Chalk.yellow(
      "[package-name]"
    )} isn't specified, all packages will build.`
  )
  .argument("[package-name]", Log.packages(packages), packages)
  .option("-w --watch", "Re-run tests on file changes", CLI.BOOLEAN, false)
  .action((_args, _options, logger) => {
    shellCommand(`echo "TODO!"`, logger);
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
