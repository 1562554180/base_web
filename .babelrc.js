const path = require('path');

module.exports = {
  "presets": [
    ["@babel/preset-env", {"targets": {"browsers": ["last 2 versions"]}}],
    "@babel/preset-react"
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "version": "legacy" }],
    ["@babel/plugin-transform-class-properties", { "loose": false }],
    [
      'module-resolver',
      {
        alias: {
          theme: path.resolve(__dirname, 'src/theme'),
          components: path.join(__dirname, './src/components'),
          utils: path.join(__dirname, './src/utils'),
          layouts: path.resolve(__dirname, 'src/layouts'),
          models: path.resolve(__dirname, 'src/models'),
          requests: path.join(__dirname, './src/requests'),
          common: path.resolve(__dirname, 'src/common'),
          assets: path.resolve(__dirname, 'src/assets'),
        },
      },
    ],
    [
      'import',
      {
        libraryName: 'antd',
        style: 'less', // 确保使用less版本
        libraryDirectory: 'es', // 使用es模块
      },
    ],
  ]
}

