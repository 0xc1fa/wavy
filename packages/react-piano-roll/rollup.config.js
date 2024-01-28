import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';
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
    // peerDepsExternal(),
    // scss({
    //   output: false
    // }),
    // scss({
    //   output: false,
    //   processor: css => postcss([autoprefixer])
    //       .process(css)
    //       .then(result => result.css)
    // }),
    // postcss({
    //   preprocessor: (content, id) => new Promise((resolve, reject) => {
    //     const result = sass.renderSync({ file: id })
    //     resolve({ code: result.css.toString() })
    //   }),
    //   plugins: [
    //     autoprefixer
    //   ],
    //   sourceMap: true,
    //   extract: true,
    //   extensions: ['.sass','.css']
    // }),
    postcss({
      writeDefinitions: true,
    }),
    typescript(),
    // babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }),
    // nodeResolve(),
    // commonjs(),
    // terser(),
  ]
};
