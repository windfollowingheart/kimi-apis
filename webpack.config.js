const path = require('path');

module.exports = {
  entry: './dist/node/index.js', // 入口文件
  // entry: './test/test_md_latex/test1.js', // 入口文件
  output: {
    filename: 'kimi_apis.min.js', // 打包后的文件名
    // filename: 'test2.js', // 打包后的文件名
    path: path.resolve(__dirname, '.'), // 输出路径
    libraryTarget: "umd", // 适配浏览器
    globalObject: "this",
  },
  module: {
    rules: [
      // 配置加载器，例如用于加载 CSS 文件
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // 可以添加更多的规则来处理其他类型的文件
    ],
  },
  // 可以添加其他配置，如插件、优化等
};