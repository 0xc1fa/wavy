import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import { babel } from "@rollup/plugin-babel";
import autoprefixer from "autoprefixer";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import banner2 from 'rollup-plugin-banner2'

export default {
  input: "src/index.ts",
  output: {
    sourcemap: true,
    dir: "dist",
    format: "esm",
  },
  external: ["react", "react/jsx-runtime", "lodash"],
  plugins: [
    peerDepsExternal(),
    postcss({
      plugins: [autoprefixer],
      writeDefinitions: true,
      sourceMap: true,
    }),
    typescript(),
    babel({
      extensions: [".ts", ".tsx"], // file extensions to transpile
      babelHelpers: "bundled", // how to handle Babel helpers
      exclude: "node_modules/**", // exclude node_modules
    }),
    // babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }),
    nodeResolve(),
    commonjs(),
    banner2(() => {
      return '"use client";\n'
    }),
    // terser(),
  ],
};
