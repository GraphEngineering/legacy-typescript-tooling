import { mergeDevDependencies, extendDefaultJestConfig } from "./index";
import * as Config from "~/Config";

import * as fs from "fs";

const mockFs: jest.Mocked<typeof fs> = fs as any;

jest.mock("fs");

describe("managing `devDependencies`", () => {
  test("user `devDependencies` are merged with defaults", () => {
    const userPackageJSON = {
      name: "test-project",
      devDependencies: {
        "test-package": "^1.0.0"
      }
    };

    const mergedPackedJSON = JSON.stringify(
      {
        ...Config.devDependencies,
        ...userPackageJSON.devDependencies
      },
      null,
      2
    );

    mockFs.readFileSync.mockReturnValue(
      new Buffer(JSON.stringify(userPackageJSON))
    );

    mockFs.writeFileSync = jest.fn();

    expect(mockFs.writeFileSync.mock.calls[0][0]).toEqual(mergedPackedJSON);
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
