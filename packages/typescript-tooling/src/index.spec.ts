import FS from "fs";
import ChildProcess from "child_process";

// set up mocks

jest.mock("fs");
jest.mock("child_process");

const mockFS: jest.Mocked<typeof FS> = FS as any;
const mockChildProcess: jest.Mocked<typeof ChildProcess> = ChildProcess as any;

const mockProcessExit = jest.fn();
const mockConsoleOut = jest.fn();

process.exit = mockProcessExit as any;
console.log = console.info = console.warn = console.error = mockConsoleOut as any;

// static mock data

const MOCK_PACKAGES = ["package-a", "package-b"];

const MOCK_PACKAGE_JSON_CONTENTS = {
  version: "1.0.0",
  peerDependencies: {
    a: "^1.2.3",
    b: "^4.5.6"
  }
};

const SPAWN_SYNC_STATIC_ARGS = [[], { shell: true, stdio: "inherit" }];

// the CLI module runs these on import

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

describe("init", () => {
  test("child process status code propagates", () => {
    // testChildProcessStatusPropagates(() => CLI(argv("init")));
  });
});

describe("deps", () => {
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
      ...SPAWN_SYNC_STATIC_ARGS
    );
  });

  test("`--install false` does not execute `npm install`", () => {
    CLI(argv("deps --install false"));
    expect(mockChildProcess.spawnSync).not.toBeCalled();
  });

  test("`--save false` calls `npm install` without `--save-dev`", () => {
    CLI(argv("deps --save false"));
    expect(mockChildProcess.spawnSync).toBeCalledWith(
      "npm install a@^1.2.3 b@^4.5.6",
      ...SPAWN_SYNC_STATIC_ARGS
    );
  });
});

describe("scripts", () => {
  const scripts = {
    "tst:init": "tst init --install false",
    "tst:scripts": "tst scripts",
    "tst:deps": "tst deps",
    "package-a:test": "tst test package-a",
    "package-a:dev": "tst dev package-a",
    "package-a:build": "tst build package-a",
    "package-b:test": "tst test package-b",
    "package-b:dev": "tst dev package-b",
    "package-b:build": "tst build package-b"
  };

  const userPackageJSONContents = {
    version: "1.0.0"
  };

  beforeEach(() => {
    mockFS.readFileSync.mockReturnValue(
      new Buffer(JSON.stringify(userPackageJSONContents))
    );
  });

  test("writes package scripts to `package.json`", () => {
    CLI(argv("scripts"));
    expect(mockFS.writeFileSync).toBeCalledWith(
      "package.json",
      JSON.stringify({ ...userPackageJSONContents, scripts }, null, 2)
    );
  });

  test("does not override existing scripts", () => {
    const existingScripts = {
      "package-a:build": "SHOULD_NOT_CHANGE"
    };

    mockFS.readFileSync.mockReturnValue(
      new Buffer(
        JSON.stringify({
          ...userPackageJSONContents,
          scripts: existingScripts
        })
      )
    );

    const userPackageJSONWithMergedScriptsContents = {
      ...userPackageJSONContents,
      scripts: {
        ...scripts,
        ...existingScripts
      }
    };

    CLI(argv("scripts"));
    expect(mockFS.writeFileSync).toBeCalledWith(
      "package.json",
      JSON.stringify(userPackageJSONWithMergedScriptsContents, null, 2)
    );
  });

  test("`--save false` does not change the user's `package.json`", () => {
    CLI(argv("deps --save false"));
    expect(mockFS.writeFileSync).not.toBeCalled();
  });
});

describe("test", () => {
  test("child process status code propagates", () => {
    testChildProcessStatusPropagates(() => CLI(argv("test")));
  });

  test("Jest is executed", () => {
    CLI(argv("test"));
    expect(mockChildProcess.spawnSync).toBeCalledWith(
      "npx jest",
      ...SPAWN_SYNC_STATIC_ARGS
    );
  });

  test("option `--watch` is passed to Jest", () => {
    CLI(argv("test --watch"));
    expect(mockChildProcess.spawnSync).toBeCalledWith(
      "npx jest --watch",
      ...SPAWN_SYNC_STATIC_ARGS
    );
  });
});

describe("dev", () => {
  test("child process status code propagates", () => {
    // testChildProcessStatusPropagates(() => CLI(argv("dev")));
  });
});

describe("build", () => {
  test("child process status code propagates", () => {
    // testChildProcessStatusPropagates(() => CLI(argv("build")));
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

const argv = (args: string): string[] => ["node", "tst", ...args.split(" ")];
