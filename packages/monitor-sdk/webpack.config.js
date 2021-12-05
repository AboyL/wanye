const path = require('path');
//webpack打包项目的 HtmlWebpackPlugin生成产出HTML文件 user-agent 把浏览器的UserAgent变成一个对象
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.ts',//入口文件
  mode: 'development',//开发模式
  output: {
    path: path.resolve(__dirname, 'dist'),//输出目录
    filename: 'monitor.js'//文件名
  },
  devServer: {
    // allowedHosts:'all',
    // static: {
    //   directory: path.join(__dirname, 'dist'),
    // },
    // compress: true,
    port: 9000,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({//自动打包出HTML文件的
      template: './index.html',
      inject: 'head',
      // 不能用过 默认的 默认的是defer
      scriptLoading:'blocking'
    })
  ]

}