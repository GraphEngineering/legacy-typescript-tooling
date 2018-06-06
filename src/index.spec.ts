import { mergeDevDependencies, extendDefaultJestConfig } from "./index";

import * as Config from "~/Config";

// describe("configuring typescript", () => {
//   // test("user config is merged with defaults", () => {

//   // });
// });

describe("managing `devDependencies`", () => {
  test("user `devDependencies` are merged with defaults", () => {
    const packageJSON = {
      devDependencies: {
        "test-package": "^1.0.0"
      }
    };

    const mergedPackageJSON = mergeDevDependencies(packageJSON);

    expect(mergedPackageJSON.devDependencies).toEqual({
      ...Config.devDependencies,
      ...packageJSON.devDependencies
    });
  });
});

describe("configuring jest", () => {
  test("user `jest.config.js` is merged with defaults", () => {
    const userConfig = {
      verbose: true,
      moduleFileExtensions: ["scss"]
    };

    const mergedConfig = extendDefaultJestConfig(userConfig);

    expect(mergedConfig.verbose).toBe(true);
    expect(mergedConfig.moduleFileExtensions).toEqual([
      ...Config.jest.moduleFileExtensions,
      ...userConfig.moduleFileExtensions
    ]);
  });
});
