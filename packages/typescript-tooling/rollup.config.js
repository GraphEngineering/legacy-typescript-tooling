import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";

export default {
  plugins: [
    // make it possible to direcly import static JSON files
    json(),

    // automatically bring in CommonJS imports and use node module resolution
    commonjs(),
    resolve(),

    // enable source maps
    sourceMaps(),

    // configure TypeScripts with overrides for compiler settings
    typescript({
      tsconfigOverride: {
        // inform the compiler of any module types we handle with Rollup (JSON)
        include: [".tst/declarations.d.ts"],

        // force the compiler to leave JSON imports as-is, we handle them above
        compilerOptions: { resolveJsonModule: false }
      }
    })
  ],

  // use source maps and CommonJS for output
  output: {
    format: "cjs",
    sourcemap: true
  },

  // don't worry about node's built-in modules (e.g. "fs", "path", "http")
  external: Object.keys(process.binding("natives")).filter(
    module => !/^_|^(internal|v8|node-inspect)\/|\//.test(module)
  ),

  // suppress errors caused by the way TypeScript generates JavaScript
  onwarn: (warning, warn) =>
    warning.code !== "THIS_IS_UNDEFINED" && warn(warning)
};
