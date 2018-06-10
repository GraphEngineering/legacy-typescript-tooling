import {
  copyDevDependenciesToPackageJSON,
  createOrExtendTSConfigJSON,
  createOrExtendTSLintJSON,
  createJestConfigJS
} from "./configureProject";

copyDevDependenciesToPackageJSON();
createOrExtendTSConfigJSON();
createOrExtendTSLintJSON();
createJestConfigJS();
