#! /usr/bin/env node

// const { version } = require("../package.json");
// const { main } = require("../dist/index");

// main(version, process.argv);

const exec = require("child_process").exec;

const [, npmScriptName] = JSON.parse(process.env.npm_config_argv).original;
const [packageName, scriptName, scriptModifier] = npmScriptName.split(":");

console.log({ packageName, scriptName, scriptModifier });

const command = {
  clean: `rimraf packages/${packageName}/dist`
}[scriptName];

const childProcess = exec(command);

childProcess.stdout.on("data", data => {
  process.stdout.write(data);
});

childProcess.on("error", data => {
  process.exit(1);
});

childProcess.on("exit", () => {
  process.exit(0);
});
