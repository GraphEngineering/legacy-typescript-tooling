import * as FS from "fs";
import * as Path from "path";

import CLI from "caporal";
import { default as Chalk } from "chalk";

import * as Log from "./Log";

import * as Init from "./Init";
import * as Scripts from "./Scripts";
import * as Deps from "./Deps";
import * as Dev from "./Dev";
import * as Shell from "./Shell";

export = (argv: string[]) => CLI.parse(argv);

const packageJSON = JSON.parse(
  FS.readFileSync(Path.join(__dirname, `../package.json`)).toString()
);

const packages = FS.readdirSync("packages").filter(
  itemName => !itemName.includes(".")
);

CLI.version(packageJSON.version).description("TypeScript Tooling");

CLI.command("init", Init.help)
  .help(Init.help)
  .option(
    "--install",
    `Install and save required ${Log.tool("peerDependencies")}`,
    CLI.BOOLEAN,
    true
  )
  .option(
    "--scripts",
    `Save ${Log.tool("npm scripts")} to ${Log.file("package.json")}`,
    CLI.BOOLEAN,
    true
  )
  .action(Init.action(packageJSON, packages));

CLI.command("scripts", Scripts.help)
  .help(Scripts.help)
  .option(
    "--save",
    `Save generated ${Log.tool("npm scripts")} to your ${Log.file(
      "package.json"
    )}`,
    CLI.BOOLEAN,
    true
  )
  .action(Scripts.action(packages));

CLI.command("deps", Deps.help)
  .help(Deps.help)
  .option(
    "--install",
    `Install ${Log.tool("peerDependencies")}`,
    CLI.BOOLEAN,
    true
  )
  .option(
    "--save",
    `Save ${Log.tool("peerDependencies")} to ${Log.file("package.json")}`,
    CLI.BOOLEAN,
    true
  )
  .action(Deps.action(packageJSON));

CLI.command("test", `Test a package with ${Log.tool("Jest")}`)
  .help(
    `Test a package with ${Log.tool("Jest")}. If ${Chalk.yellow(
      "[package-name]"
    )} isn't specified, tests run for all packages.`
  )
  .argument("[package-name]", Log.packages(packages), packages)
  .option("-w --watch", "Re-run tests on file changes", CLI.BOOLEAN, false)
  .action((_args, _options, logger) => Shell.exec(logger, `echo "TODO!"`));

CLI.command("dev", Dev.help)
  .help(
    `${Dev.help}. If ${Chalk.yellow(
      "[package-name]"
    )} isn't specified, all packages run.`
  )
  .argument("[package-name]", Log.packages(packages), packages)
  .action(Dev.action);

CLI.command("build", `Build a package with ${Log.tool("TypeScript")}`)
  .help(
    `Build a package with ${Log.tool("TypeScript")}. If ${Chalk.yellow(
      "[package-name]"
    )} isn't specified, build all packages.`
  )
  .argument("[package-name]", Log.packages(packages), packages)
  .action((_args, _options, logger) => Shell.exec(logger, `echo "TODO!"`));
