import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';
import autoprefixer from 'autoprefixer';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    dir: 'dist',
    format: 'esm',
  },
  external: [ 'react', 'react/jsx-runtime' ],
  plugins: [
    peerDepsExternal(),
    postcss({
      plugins: [
        autoprefixer
      ],
      writeDefinitions: true,
      sourceMap: true,
    }),
    typescript(),
    babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }),
    nodeResolve(),
    commonjs(),
    // terser(),
  ]
};
