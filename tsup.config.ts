import type { Options } from "tsup";

export const tsup: Options = {
  clean: true,
  dts: true,
  format: "esm",
  skipNodeModulesBundle: true,
  target: "es2020",
  outDir: "dist",
  entry: ["src/**/*.ts"],
};
