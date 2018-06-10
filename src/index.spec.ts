import * as fs from "fs";

import {
  configureDevDependencies,
  configureJest,
  extendDefaultJestConfig
} from "./index";

import * as Config from "~/Config";

const mockFs: jest.Mocked<typeof fs> = fs as any;

jest.mock("fs");

beforeEach(() => {
  mockFs.readFileSync.mockClear();
  mockFs.writeFileSync.mockClear();
  mockFs.existsSync.mockClear();
});

describe("configuring `devDependencies`", () => {
  test("merges user `devDependencies` with defaults", () => {
    const userPackageJSON = {
      name: "test-project",
      devDependencies: {
        "test-package": "^1.0.0"
      }
    };

    const mergedPackageJSON = {
      ...userPackageJSON,
      devDependencies: {
        ...Config.devDependencies,
        ...userPackageJSON.devDependencies
      }
    };

    mockFs.readFileSync.mockReturnValue(
      new Buffer(JSON.stringify(mergedPackageJSON, null, 2))
    );

    configureDevDependencies();
    expect(mockFs.writeFileSync.mock.calls[0][1]).toEqual(
      JSON.stringify(mergedPackageJSON, null, 2)
    );
  });
});

describe("configuring jest", () => {
  test("merges `jest.config.js` with defaults", () => {
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

  test("writes the correct `jest.config.js` one doesn't exist", () => {
    const jestConfigJS = `module.exports = require("./dist").extendDefaultJestConfig({});`;

    mockFs.existsSync.mockReturnValue(false);
    mockFs.readFileSync.mockReturnValue(jestConfigJS);

    configureJest();
    expect(mockFs.writeFileSync.mock.calls[0][1]).toEqual(jestConfigJS);
  });

  test("does not write default `jest.config.js` if one exists", () => {
    mockFs.existsSync.mockReturnValue(true);
    expect(mockFs.writeFileSync).not.toBeCalled();
  });
});
