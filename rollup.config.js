import babel from 'rollup-plugin-babel'
import {nodeResolve} from '@rollup/plugin-node-resolve'

export default {
  input: './src/index.js',
  output: {
    format: 'umd', // 模块化类型
    file: 'dist/umd/vue.js',
    name: 'Vue', // 打包后的全局变量名字
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    nodeResolve() // import默认找index.js
  ]
}