import { default as Chalk } from "chalk";

export const icons = {
  error: Chalk.red("×"),
  info: Chalk.cyan("ℹ"),
  checkMark: Chalk.green("✓")
};

export const notification = (icon: string): string =>
  `${Chalk.dim.grey("(")}${icon}${Chalk.dim.grey(")")}`;

export const code = (code: string): string => Chalk.italic.bgBlack.yellow(code);

export const fileAction = (icon: string, verb: string, path: string) =>
  `${notification(icon)} ${Chalk.dim(verb)} ${Chalk.blue(path)}`;

export const success = (message: string): string =>
  `${notification(icons.checkMark)} ${Chalk.bold.green(message)}`;

export const error = (message: string): string =>
  `${notification(icons.error)} ${Chalk.bold.red(message)}`;
