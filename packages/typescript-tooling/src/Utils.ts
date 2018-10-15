import * as FS from "fs";

export const packages = () =>
  FS.existsSync("packages")
    ? FS.readdirSync("packages").filter(itemName => !itemName.includes("."))
    : [];

export const packagePath = (packageName: string): string =>
  `packages/${packageName}`;
