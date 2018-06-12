import { default as chalk } from "chalk";

export const checkMark = chalk.green("✓");

export const fileName = (name: string) => chalk.blue(name);

export const code = (name: string) => `\n${chalk.dim(name)}`;
