import babel from 'rollup-plugin-babel'

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
    })
  ]
}