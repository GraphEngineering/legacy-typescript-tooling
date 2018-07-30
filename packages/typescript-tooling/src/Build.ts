import * as FS from "fs";

import * as Log from "./Log";
import * as Shell from "./Shell";
import * as Utils from "./Utils";

const DEFAULT_TS_CONFIG_CONTENTS = {
  extends: "../../tsconfig.json",
  include: ["src/**/*.ts"]
};

export const help = `Build a package with ${Log.tool("Parcel")}`;

export const action = async (
  { packageName }: any,
  _options: any,
  logger: Logger
) => {
  const packagePath = Utils.packagePath(packageName);
  const TSConfigPath = `${packagePath}/tsconfig.json`;

  const isNecessaryToCreateTSConfig = false; // !FS.existsSync(TSConfigPath);

  if (isNecessaryToCreateTSConfig) {
    FS.writeFileSync(
      TSConfigPath,
      JSON.stringify(DEFAULT_TS_CONFIG_CONTENTS, null, 2)
    );
  }

  const command = `parcel build ${packagePath}/src/index.ts --out-dir ${packagePath}/dist --target node`;
  const code = await Shell.exec(logger, command);

  if (isNecessaryToCreateTSConfig) {
    FS.unlinkSync(TSConfigPath);
  }

  logger.info("");
  process.exit(code);
};
