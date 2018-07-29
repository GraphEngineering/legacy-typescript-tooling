import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";

export default {
  plugins: [
    json(),
    commonjs(),
    resolve(),
    sourceMaps(),
    typescript({
      tsconfigOverride: {
        include: [".tst/declarations.d.ts"],
        compilerOptions: { resolveJsonModule: false }
      }
    })
  ],

  input: "packages/twilio/src/index.ts",
  output: {
    file: "packages/twilio/dist/index.js",
    format: "cjs",
    sourcemap: true
  },

  external: Object.keys(process.binding("natives")).filter(
    module => !/^_|^(internal|v8|node-inspect)\/|\//.test(module)
  ),

  onwarn: (warning, warn) =>
    warning.code !== "THIS_IS_UNDEFINED" && warn(warning)
};
