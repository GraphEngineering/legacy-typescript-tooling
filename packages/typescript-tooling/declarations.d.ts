/*
  Since Rollup handles JSON imports during builds, this file is included to so
  the TypeScript compiler knows not to throw errors when it sees:

  import <data> from "<fileName>.json";
*/

declare module "*.json" {
  const contents: any;
  export default contents;
}
