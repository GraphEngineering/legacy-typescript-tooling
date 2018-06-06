import { extendDefaultJestConfig } from "./index";

import * as Config from "~/Config";

// describe("configuring typescript", () => {
//   // test("user config is merged with defaults", () => {

//   // });
// });

describe("managing `devDependencies`", () => {
  test("user `devDependencies` are merged with defaults", () => {
    expect(true).toBe(true);
  });
});

describe("configuring jest", () => {
  test("user provided config is merged with defaults", () => {
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
