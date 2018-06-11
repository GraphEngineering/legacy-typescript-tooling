import * as fs from "fs";
import * as path from "path";

import {
  copyDevDependenciesToPackageJSON,
  createOrExtendTSConfigFileJSON,
  createDefaultJestConfigJS,
  extendWithDefaultJestConfig
} from "./configureProject";

import * as DefaultConfigs from "./DefaultConfigs";

const mockFs: jest.Mocked<typeof fs> = fs as any;
const mockPath: jest.Mocked<typeof fs> = path as any;

jest.mock("fs");
jest.mock("path");

beforeEach(() => {
  mockFs.readFileSync.mockClear();
  mockFs.writeFileSync.mockClear();
  mockFs.existsSync.mockClear();
});

test("copies default `devDependencies` into the user's `package.json`", () => {
  const userPackageJSON = {
    name: "test-project",
    devDependencies: {
      "test-package": "^1.0.0"
    }
  };

  const mergedPackageJSON = {
    ...userPackageJSON,
    devDependencies: {
      ...DefaultConfigs.devDependencies,
      ...userPackageJSON.devDependencies
    }
  };

  mockFs.readFileSync.mockReturnValue(
    new Buffer(JSON.stringify(mergedPackageJSON, null, 2))
  );

  copyDevDependenciesToPackageJSON();

  expect(mockFs.writeFileSync.mock.calls[0][1]).toBe(
    JSON.stringify(mergedPackageJSON, null, 2)
  );
});

describe("creating and extending TypeScript or TSLint config files", () => {
  const configFileJSONFileName = "fileName.json";
  const configFileJSONDefaultContents = {
    extends: `./node_modules/typescript-tooling/dist/DefaultConfigs/${configFileJSONFileName}`
  };

  test("creates `fileName.json` when one doesn't exist", () => {
    mockFs.existsSync.mockReturnValue(false);

    createOrExtendTSConfigFileJSON(configFileJSONFileName);

    expect(mockFs.writeFileSync.mock.calls[0][1]).toBe(
      JSON.stringify(configFileJSONDefaultContents, null, 2)
    );
  });

  test("extends `fileName.json` when one exists", () => {
    const configFileJSONExistingContents = {
      compilerOptions: { strict: true }
    };

    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(
      JSON.stringify(configFileJSONExistingContents, null, 2)
    );

    const configFileJSONContentsWithExtends = {
      ...configFileJSONDefaultContents,
      ...configFileJSONExistingContents
    };

    createOrExtendTSConfigFileJSON(configFileJSONFileName);

    expect(mockFs.writeFileSync.mock.calls[0][1]).toBe(
      JSON.stringify(configFileJSONContentsWithExtends, null, 2)
    );
  });
});

describe("creating a Jest config file and extending the default settings", () => {
  test("creates `jest.config.js` when one doesn't exist", () => {
    const jestConfigJSContents = `module.exports = require("typescript-tooling").extendWithDefaultJestConfig({});\n`;

    mockFs.existsSync.mockReturnValue(false);

    createDefaultJestConfigJS();

    expect(mockFs.writeFileSync.mock.calls[0][1]).toBe(jestConfigJSContents);
  });

  test("skips `jest.config.js` creation when one exists", () => {
    mockFs.existsSync.mockReturnValue(true);

    createDefaultJestConfigJS();

    expect(mockFs.writeFileSync).not.toBeCalled();
  });

  test("extends `jest.config.js` with defaults", () => {
    const jestConfigJSExistingContents = {
      verbose: true,
      moduleFileExtensions: ["scss"]
    };

    const jestConfigJSWithExtensions = extendWithDefaultJestConfig(
      jestConfigJSExistingContents
    );

    expect(jestConfigJSWithExtensions.verbose).toBe(true);
    expect(jestConfigJSWithExtensions.moduleFileExtensions).toEqual([
      ...DefaultConfigs.jestConfig.moduleFileExtensions,
      ...jestConfigJSExistingContents.moduleFileExtensions
    ]);
  });
});
