const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: [
      'react',
      'react-dom',
      'antd',
      'lodash',
      'moment',
      'echarts',
      'g2',
      '@antv/g6',
      '@antv/data-set',
      '@antv/g2plot',
      '@antv/x6',
      '@antv/x6-react-shape',
    ],
  },
  output: {
    path: path.join(__dirname, 'dll'),
    filename: '[name].dll.js',
    library: '[name]_library',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dll', '[name]-manifest.json'),
      name: '[name]_library',
    }),
    new webpack.ProgressPlugin(),
  ],
  mode: 'production',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
};
