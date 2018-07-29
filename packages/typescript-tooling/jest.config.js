export default {
  // look for files matching `*.spec.ts(x)`
  testMatch: ["**/?(*.)+(spec).ts?(x)"],

  // run those files using `ts-jest`
  transform: { "^.+\\.(ts|tsx)$": "ts-jest" },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  /*
    Transform imports using package paths...

    `import * as <Package> from "~/<package>";`

    becomes...

    `import * as <Package> from "<rootDir>/packages/<package>/src";`
  */
  moduleNameMapper: { "~(.*)$": "<rootDir>/packages/$1/src" }
};
