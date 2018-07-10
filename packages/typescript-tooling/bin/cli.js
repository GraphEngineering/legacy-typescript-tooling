#! /usr/bin/env node

const { version } = require("../package.json");
const { main } = require("../dist/index");

main(version, process.argv);
