import FS from "fs";
import ChildProcess from "child_process";
import Rimraf from "rimraf";

// set up mocks

jest.mock("fs");
jest.mock("child_process");
jest.mock("rimraf");

const mockFS: jest.Mocked<typeof FS> = FS as any;
const mockChildProcess: jest.Mocked<typeof ChildProcess> = ChildProcess as any;
const mockRimraf: jest.Mocked<typeof Rimraf> = Rimraf as any;

const mockProcessExit = jest.fn();
const mockConsoleLog = jest.fn();

process.exit = mockProcessExit as any;
console.log = mockConsoleLog as any;

// mock data and helpers

const argv = (args: string): string[] => ["node", "tst", ...args.split(" ")];

const stringifyPretty = (contents: any): string =>
  JSON.stringify(contents, null, 2);

const MOCK_PACKAGES = ["package-a", "package-b"];

const MOCK_PACKAGE_JSON_CONTENTS = {
  version: "1.0.0",
  peerDependencies: {
    a: "^1.2.3",
    b: "^4.5.6"
  }
};

const MOCK_PEER_DEPENDENCIES = Object.entries(
  MOCK_PACKAGE_JSON_CONTENTS.peerDependencies
)
  .map(([packageName, version]) => `${packageName}@${version}`)
  .join(" ");

const MOCK_SCRIPTS = {
  "tst:init": "tst init --install false",
  "tst:scripts": "tst scripts",
  "tst:deps": "tst deps",
  "package-a:test": "tst test package-a",
  "package-a:test:watch": "tst test package-a --watch",
  "package-a:dev": "tst dev package-a",
  "package-a:build": "tst build package-a",
  "package-b:test": "tst test package-b",
  "package-b:test:watch": "tst test package-b --watch",
  "package-b:dev": "tst dev package-b",
  "package-b:build": "tst build package-b"
};

const MOCK_FILE_CONTENTS = { contents: "DOES_NOT_CHANGE" };
const MOCK_FILE_JSON = stringifyPretty(MOCK_FILE_CONTENTS);

const MOCK_TS_CONFIG_CONTENTS = { extends: "./.tst/tsconfig.json" };
const MOCK_TS_CONFIG_JSON = `${stringifyPretty(MOCK_TS_CONFIG_CONTENTS)}\n`;

const MOCK_TS_LINT_CONTENTS = { extends: "./.tst/tslint.json" };
const MOCK_TS_LINT_JSON = `${stringifyPretty(MOCK_TS_LINT_CONTENTS)}\n`;

const MOCK_JEST_CONFIG_JSON = `module.exports = require("./.tst/jest.config.js");\n`;

const MOCK_SPAWN_SYNC_ARGS = [[], { shell: true, stdio: "inherit" }];

// `import CLI from "./index"` immediately reads from the file system

mockFS.readFileSync.mockReturnValue(
  new Buffer(JSON.stringify(MOCK_PACKAGE_JSON_CONTENTS))
);

mockFS.readdirSync.mockReturnValue(MOCK_PACKAGES);

import CLI from "./index";

// set up tests

beforeEach(() => {
  jest.resetAllMocks();
  mockChildProcess.spawnSync.mockReturnValue({ status: 0 });
});

describe("command: tst init", () => {
  test("child process status code propagates", () => {
    testChildProcessStatusPropagates(() => CLI(argv("init")));
  });

  beforeEach(() => {
    mockFS.existsSync.mockReturnValue(false);
    mockFS.readFileSync.mockReturnValue(new Buffer(MOCK_FILE_JSON));
  });

  describe("installing `peerDependencies`", () => {
    test("`npm install` is executed with the correct `peerDependencies`", () => {
      CLI(argv("init"));
      expect(mockChildProcess.spawnSync).toBeCalledWith(
        `npm install --save-dev ${MOCK_PEER_DEPENDENCIES}`,
        ...MOCK_SPAWN_SYNC_ARGS
      );
    });

    test("`--install false` does not run `npm install`", () => {
      CLI(argv("init --install false"));
      expect(mockChildProcess.spawnSync).not.toBeCalled();
    });
  });

  describe("`.tst` directory setup", () => {
    test("directory is deleted if it exists", () => {
      mockFS.existsSync.mockReturnValue(true);

      CLI(argv("init"));
      expect(mockRimraf.sync).toBeCalledWith(".tst");
    });

    test("directory is not deleted if it doesn't exist", () => {
      CLI(argv("init"));
      expect(mockRimraf.sync).not.toBeCalled();
    });

    test("directory is always created", () => {
      CLI(argv("init"));
      expect(mockFS.mkdirSync).toBeCalledWith(".tst");
    });
  });

  describe("writing files", () => {
    const packageJSON = stringifyPretty({
      ...MOCK_FILE_CONTENTS,
      scripts: MOCK_SCRIPTS
    });

    const emptyProjectWrites = [
      ["./.tst/lerna.json", MOCK_FILE_JSON],
      ["./.tst/tsconfig.json", MOCK_FILE_JSON],
      ["tsconfig.json", MOCK_TS_CONFIG_JSON],
      ["./.tst/tslint.json", MOCK_FILE_JSON],
      ["tslint.json", MOCK_TS_LINT_JSON],
      ["./.tst/jest.config.js", MOCK_FILE_JSON],
      ["jest.config.js", MOCK_JEST_CONFIG_JSON],
      ["package.json", packageJSON]
    ];

    test("file writes are correct for an empty project", () => {
      CLI(argv("init"));
      expect(mockFS.writeFileSync.mock.calls).toEqual(emptyProjectWrites);
    });

    test("`--scripts false` does not write scripts to `package.json`", () => {
      CLI(argv("init --scripts false"));
      expect(mockFS.writeFileSync.mock.calls).toEqual(
        emptyProjectWrites.filter(([path]) => path !== "package.json")
      );
    });

    const TSConfigOrLintWrites = () =>
      mockFS.writeFileSync.mock.calls.filter(
        ([path]) => path === "tsconfig.json" || path === "tslint.json"
      );

    test("`tsconfig.json` and `tslint.json` contents are preserved", () => {
      mockFS.existsSync.mockReturnValue(true);

      CLI(argv("init"));
      expect(TSConfigOrLintWrites()).toEqual([
        [
          "tsconfig.json",
          `${stringifyPretty({
            ...MOCK_FILE_CONTENTS,
            ...MOCK_TS_CONFIG_CONTENTS
          })}\n`
        ],
        [
          "tslint.json",
          `${stringifyPretty({
            ...MOCK_FILE_CONTENTS,
            ...MOCK_TS_LINT_CONTENTS
          })}\n`
        ]
      ]);
    });

    test("`tsconfig.json` and `tslint.json` not written when `extends` already set", () => {
      mockFS.existsSync.mockReturnValue(true);
      mockFS.readFileSync.mockReturnValue(
        new Buffer(
          stringifyPretty({
            extends: "DOES_NOT_CHANGE"
          })
        )
      );

      CLI(argv("init"));
      expect(TSConfigOrLintWrites()).toEqual([]);
    });
  });
});

describe("command: tst deps", () => {
  test("child process status code propagates", () => {
    testChildProcessStatusPropagates(() => CLI(argv("deps")));
  });

  beforeEach(() => {
    mockFS.readFileSync.mockReturnValue(
      new Buffer(JSON.stringify(MOCK_PACKAGE_JSON_CONTENTS))
    );
  });

  test("`npm install --save-dev` called with `peerDependencies` from `package.json`", () => {
    CLI(argv("deps"));
    expect(mockChildProcess.spawnSync).toBeCalledWith(
      "npm install --save-dev a@^1.2.3 b@^4.5.6",
      ...MOCK_SPAWN_SYNC_ARGS
    );
  });

  test("`--install false` does not execute `npm install`", () => {
    CLI(argv("deps --install false"));
    expect(mockChildProcess.spawnSync).not.toBeCalled();
  });

  test("`--save false` calls `npm install` without `--save-dev`", () => {
    CLI(argv("deps --save false"));
    expect(mockChildProcess.spawnSync).toBeCalledWith(
      `npm install ${MOCK_PEER_DEPENDENCIES}`,
      ...MOCK_SPAWN_SYNC_ARGS
    );
  });
});

describe("command: tst scripts", () => {
  beforeEach(() => {
    mockFS.readFileSync.mockReturnValue(
      new Buffer(stringifyPretty(MOCK_PACKAGE_JSON_CONTENTS))
    );
  });

  test("writes package scripts to `package.json`", () => {
    CLI(argv("scripts"));
    expect(mockFS.writeFileSync).toBeCalledWith(
      "package.json",
      stringifyPretty({
        ...MOCK_PACKAGE_JSON_CONTENTS,
        scripts: MOCK_SCRIPTS
      })
    );
  });

  test("does not override existing scripts", () => {
    const existingScripts = {
      "package-a:build": "SHOULD_NOT_CHANGE"
    };

    mockFS.readFileSync.mockReturnValue(
      new Buffer(
        JSON.stringify({
          ...MOCK_PACKAGE_JSON_CONTENTS,
          scripts: existingScripts
        })
      )
    );

    const userPackageJSONWithMergedScriptsContents = {
      ...MOCK_PACKAGE_JSON_CONTENTS,
      scripts: {
        ...MOCK_SCRIPTS,
        ...existingScripts
      }
    };

    CLI(argv("scripts"));
    expect(mockFS.writeFileSync).toBeCalledWith(
      "package.json",
      stringifyPretty(userPackageJSONWithMergedScriptsContents)
    );
  });

  test("`--save false` does not change the user's `package.json`", () => {
    CLI(argv("deps --save false"));
    expect(mockFS.writeFileSync).not.toBeCalled();
  });
});

describe("command: tst test <package-name>", () => {
  test("child process status code propagates", () => {
    testChildProcessStatusPropagates(() => CLI(argv("test package-a")));
  });

  test("`npx jest` is executed for a package", () => {
    CLI(argv("test package-a"));
    expect(mockChildProcess.spawnSync).toBeCalledWith(
      "npx jest packages/package-a/**/*.spec.ts*",
      ...MOCK_SPAWN_SYNC_ARGS
    );
  });

  test("option `--watch` is passed to Jest", () => {
    CLI(argv("test package-a --watch"));
    expect(mockChildProcess.spawnSync).toBeCalledWith(
      "npx jest --watch packages/package-a/**/*.spec.ts*",
      ...MOCK_SPAWN_SYNC_ARGS
    );
  });
});

describe("command: tst dev <package-name>", () => {
  test("child process status code propagates", () => {
    testChildProcessStatusPropagates(() => CLI(argv("dev package-a")));
  });

  test("`npx nodemon` is executed for a package", () => {
    CLI(argv("dev package-a"));
    expect(mockChildProcess.spawnSync).toBeCalledWith(
      `nodemon --watch packages/package-a/src --ext ts,tsx --exec "ts-node --require tsconfig-paths/register packages/package-a/src/index.ts"`,
      ...MOCK_SPAWN_SYNC_ARGS
    );
  });

  test("`npx nodemon` is executed with the project flag if `tsconfig.json` exists", () => {
    mockFS.existsSync.mockReturnValue(true);

    CLI(argv("dev package-a"));
    expect(mockChildProcess.spawnSync).toBeCalledWith(
      `nodemon --watch packages/package-a/src --ext ts,tsx --exec "ts-node --project packages/package-a/tsconfig.json --require tsconfig-paths/register packages/package-a/src/index.ts"`,
      ...MOCK_SPAWN_SYNC_ARGS
    );
  });
});

describe("command: tst dev <package-name>", () => {
  test("child process status code propagates", () => {
    testChildProcessStatusPropagates(() => CLI(argv("build package-a")));
  });

  test("`npx parcel build` is executed for a package", () => {
    CLI(argv("build package-a"));
    expect(mockChildProcess.spawnSync).toBeCalledWith(
      "npx parcel build packages/package-a/src/index.ts --out-dir packages/package-a/dist --target node",
      ...MOCK_SPAWN_SYNC_ARGS
    );
  });
});

const testChildProcessStatusPropagates = (testFn: () => void) => {
  mockChildProcess.spawnSync.mockReturnValue({ status: 0 });

  testFn();
  expect(mockProcessExit).toBeCalledWith(0);

  mockChildProcess.spawnSync.mockReturnValue({ status: 1 });

  testFn();
  expect(mockProcessExit).toBeCalledWith(1);
};
