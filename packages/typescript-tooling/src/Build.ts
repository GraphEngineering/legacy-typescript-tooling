import * as FS from "fs";

import * as Log from "./Log";
import * as Shell from "./Shell";
import * as Utils from "./Utils";

const DEFAULT_TS_CONFIG_CONTENTS = {
  extends: "../../tsconfig.json",
  includes: ["src/**/*.ts"]
};

const TEMPORARY_TS_CONFIG_FILENAME = ".tsconfig.json";

export const help = `Build a package with ${Log.tool("TypeScript")}`;

export const action = async (
  { packageName }: any,
  _options: any,
  logger: Logger
) => {
  const packagePath = Utils.packagePath(packageName);

  const TSConfigPath = `${packagePath}/${
    !FS.existsSync(`${packagePath}/tsconfig.json`)
      ? TEMPORARY_TS_CONFIG_FILENAME
      : "tsconfig.json"
  }`;

  if (TSConfigPath.includes(TEMPORARY_TS_CONFIG_FILENAME)) {
    FS.writeFileSync(
      TSConfigPath,
      JSON.stringify(DEFAULT_TS_CONFIG_CONTENTS, null, 2)
    );
  }

  const command = `tsc --project ${TSConfigPath} --outDir ${packagePath}/dist`;
  const code = await Shell.exec(logger, command);

  if (TSConfigPath.includes(TEMPORARY_TS_CONFIG_FILENAME)) {
    FS.unlinkSync(TSConfigPath);
  }

  logger.info("");
  process.exit(code);
};
