import _ from "lodash";
import { default as Chalk } from "chalk";

export const icons = {
  error: Chalk.red("×"),
  info: Chalk.cyan("ℹ"),
  checkMark: Chalk.green("✓")
};

export const tool = _.curry<string, string>(Chalk.bold.italic);
export const code = _.curry<string, string>(Chalk.bgBlack.yellow);
export const file = _.curry<string, string>(Chalk.blue);

export const notification = (icon: string): string =>
  `${Chalk.dim.grey("(")}${icon}${Chalk.dim.grey(")")}`;

export const success = (message: string): string =>
  `${notification(icons.checkMark)} ${Chalk.green(message)}`;

export const error = (message: string): string =>
  `${notification(icons.error)} ${Chalk.red(message)}`;

export const packages = (packageNames: string[]): string =>
  packageNames.join(Chalk.dim("|"));

export const fileAction = (icon: string, verb: string, path: string) =>
  `${notification(icon)} ${Chalk.dim(verb)} ${file(path)}`;
