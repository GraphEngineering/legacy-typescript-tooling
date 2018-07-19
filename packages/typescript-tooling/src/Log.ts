import { default as chalk } from "chalk";

export const info = chalk.yellow("ℹ");
export const checkMark = chalk.green("✓");

export const action = (icon: string, verb: string, path: string) =>
  `${icon} ${chalk.dim(verb)} ${chalk.blue(path)}`;
