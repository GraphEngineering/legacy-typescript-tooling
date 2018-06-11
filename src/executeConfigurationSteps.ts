import {
  copyDevDependenciesToPackageJSON,
  createOrExtendTSConfigFileJSON,
  createDefaultJestConfigJS
} from "./configureProject";

copyDevDependenciesToPackageJSON();

createOrExtendTSConfigFileJSON("tsconfig.json");
createOrExtendTSConfigFileJSON("tslint.json");

createDefaultJestConfigJS();
