import * as fs from "fs";

import {
  copyDevDependenciesToPackageJSON,
  createOrExtendTSConfigJSON,
  createOrExtendTSLintJSON,
  createJestConfigJS,
  extendDefaultJestConfig
} from "./configureProject";

import * as Config from "./DefaultConfigs";

const mockFs: jest.Mocked<typeof fs> = fs as any;

jest.mock("fs");

beforeEach(() => {
  mockFs.readFileSync.mockClear();
  mockFs.writeFileSync.mockClear();
  mockFs.existsSync.mockClear();
});

test("inserts default `devDependencies` into the user's `package.json`", () => {
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

  copyDevDependenciesToPackageJSON();

  expect(mockFs.writeFileSync.mock.calls[0][1]).toBe(
    JSON.stringify(mergedPackageJSON, null, 2)
  );
});

describe("configuring TypeScript", () => {
  test("creates `tsconfig.json` when the file isn't found", () => {
    const defaultTSConfigJSON = JSON.stringify({ extends: "./blah" }, null, 2);

    mockFs.existsSync.mockReturnValue(false);

    createOrExtendTSConfigJSON();

    expect(mockFs.writeFileSync.mock.calls[0][1]).toBe(defaultTSConfigJSON);
  });

  test("extends `tsconfig.json` when the file is found", () => {
    const existingTSConfig = {
      compilerOptions: { strict: true }
    };

    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(
      JSON.stringify(existingTSConfig, null, 2)
    );

    const extendedTSConfig = { extends: "./blah", ...existingTSConfig };

    createOrExtendTSConfigJSON();

    expect(mockFs.writeFileSync.mock.calls[0][1]).toBe(
      JSON.stringify(extendedTSConfig, null, 2)
    );
  });
});

describe("configuring TSLint", () => {
  test("creates `tslint.json` when the file isn't found", () => {
    const defaultTSLintJSON = JSON.stringify({ extends: "./blah" }, null, 2);

    mockFs.existsSync.mockReturnValue(false);

    createOrExtendTSLintJSON();

    expect(mockFs.writeFileSync.mock.calls[0][1]).toBe(defaultTSLintJSON);
  });

  test("extends `tslint.json` when the file is found", () => {
    const existingTSLint = {
      compilerOptions: { strict: true }
    };

    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(
      JSON.stringify(existingTSLint, null, 2)
    );

    const extendedTSLint = { extends: "./blah", ...existingTSLint };

    createOrExtendTSLintJSON();

    expect(mockFs.writeFileSync.mock.calls[0][1]).toBe(
      JSON.stringify(extendedTSLint, null, 2)
    );
  });
});

describe("configuring Jest", () => {
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

  test("creates the correct `jest.config.js` one doesn't exist", () => {
    const jestConfigJS = "source code for `jest.config.js`";

    mockFs.existsSync.mockReturnValue(false);
    mockFs.readFileSync.mockReturnValue(jestConfigJS);

    createJestConfigJS();

    expect(mockFs.writeFileSync.mock.calls[0][1]).toBe(jestConfigJS);
  });

  test("does not create default `jest.config.js` if one exists", () => {
    mockFs.existsSync.mockReturnValue(true);

    createJestConfigJS();

    expect(mockFs.writeFileSync).not.toBeCalled();
  });
});
