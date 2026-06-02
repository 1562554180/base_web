const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const createMockMiddleware = require('./webpack.mock');
const { ModuleFederationPlugin } = webpack.container;
// const dllManifest = require('./dll/vendor-manifest.json');

// const ip = '172.16.10.128';
// const ip = '172.16.10.139';
// const ip = '172.16.10.140';
// const ip = '172.16.10.135';
// const ip = '172.16.10.137';
// const ip = '172.17.96.81';
// const ip = '172.17.96.82';
// const ip = '172.17.96.120';
// const ip = '172.17.96.33';

// const ip = '172.17.96.116';
// const ip = '172.17.96.129';
// const ip = '172.17.96.127';
// const ip = '172.17.96.80';

const ip = '172.16.10.26';
// const ip = '172.16.10.171';

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    // Webpack 5 缓存配置 - 大幅提升二次编译速度
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
      cacheDirectory: path.resolve(__dirname, '.webpack_cache'),
    },

    // 入口配置
    entry: {
      main: './src/index.js',
      vendor: ['react', 'react-dom'],
    },

    // 输出配置
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'yuantek_assets/[name].[contenthash].js' : 'yuantek_assets/[name].js',
      chunkFilename: isProduction ? 'yuantek_assets/[name].[contenthash].chunk.js' : 'yuantek_assets/[name].chunk.js',
      publicPath: '/',
      // 开发环境不需要清理，提升速度
      clean: isProduction,
    },

    // 模式
    mode: isProduction ? 'production' : 'development',

    // 模块配置
    module: {
      rules: [
        // JavaScript/JSX 文件处理
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              // 使用项目根目录的 .babelrc.js 配置
              configFile: path.resolve(__dirname, '.babelrc.js'),
              // 启用缓存，提升编译速度
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
        },

        // CSS 文件处理 - 项目源码（应用 postcss）
        {
          test: /\.css$/,
          include: path.resolve(__dirname, 'src'),
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        // CSS 文件处理 - node_modules（不应用 postcss，直接打包）
        {
          test: /\.css$/,
          include: /node_modules/,
          use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
        },

        // LESS 文件处理
        {
          test: /\.less$/,
          oneOf: [
            // antd 5.0 不再使用 less，使用 CSS-in-JS，所以不再需要处理 antd 的 less 文件
            // 注意：public/color.less 不在这里处理，由 CopyWebpackPlugin 复制到 dist，让 less.js 在浏览器中处理
            {
              include: path.resolve(__dirname, 'src/'),
              test: /\.less$/,
              use: [
                isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    esModule: false,
                    modules: {
                      localIdentName: '[name]__[local]--[hash:base64:5]',
                    },
                    importLoaders: 1,
                    sourceMap: true,
                  },
                },
                {
                  loader: 'less-loader',
                  options: {
                    lessOptions: {
                      javascriptEnabled: true, // 启用 JavaScript 以支持 antd 的 bezierEasing.less
                      // 添加路径别名，将 antd/lib/style/themes/default.less 重定向到我们的占位符文件
                      paths: [
                        path.resolve(__dirname, 'src/utils'),
                      ],
                    },
                    sourceMap: !isProduction,
                  },
                },
              ],
            },
          ],
        },

        // 图片文件处理
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'yuantek_assets/images/[hash][ext][query]',
          },
        },

        // 字体文件处理
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'yuantek_assets/fonts/[hash][ext][query]',
          },
        },
      ],
    },

    // 插件配置
    plugins: [
      // 进度插件（可选，开发环境可禁用以提升性能）
      ...(process.env.WEBPACK_PROGRESS !== 'false' ? [new webpack.ProgressPlugin()] : []),

      // 模块联邦主应用配置（Host）
      new ModuleFederationPlugin({
        name: 'antdShell',
        filename: 'remoteEntry.js',
        remotes: {
          // 这里根据子应用的 webpack ModuleFederation 配置来写
          // home 仍然从开发服务器加载（端口 3001）
          // home: 'home@http://localhost:3001/remoteEntry.js',
          // about 从主应用的 public 目录加载（不需要单独的服务器）
          // about: 'about@/remotes/about/remoteEntry.js',
        },
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: '17.0.2',
          },
          'react-dom': {
            singleton: true,
            eager: true,
            requiredVersion: '17.0.2',
          },
        },
      }),

      // HTML 模板处理
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: isProduction ? 'yuantek_index.html' : 'index.html',
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyCSS: true,
          minifyJS: true,
        } : false,
      }),

      // CSS 提取插件
      new MiniCssExtractPlugin({
        filename: isProduction ? 'yuantek_assets/[name].[contenthash].css' : 'yuantek_assets/[name].css',
        chunkFilename: isProduction ? 'yuantek_assets/[name].[contenthash].chunk.css' : 'yuantek_assets/[name].chunk.css',
      }),

      // 复制 public/yuantek_others 文件夹到 dist
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public/yuantek_others'),
            to: 'yuantek_others', // 相对于 output.path (dist)
            noErrorOnMissing: true, // 如果文件夹不存在也不报错
          },

          // 复制远程页面模块联邦文件到 dist（模块联邦子应用）
          {
            from: path.resolve(__dirname, 'public/remotes'),
            to: 'remotes',
            noErrorOnMissing: true,
          },
        ],
      }),

      // 环境变量注入
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        'process.env.BABEL_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      }),

      // Fix for @ant-design/compatible resetComponent import issue
      // Replace antd/es/style imports in @ant-design/compatible with our polyfill
      new webpack.NormalModuleReplacementPlugin(
        /^antd\/es\/style$/,
        path.resolve(__dirname, 'src/utils/antd-style-polyfill.js')
      ),
      // Fix for @ant-design/compatible theme util alias import issue
      new webpack.NormalModuleReplacementPlugin(
        /^antd\/es\/theme\/util\/alias$/,
        path.resolve(__dirname, 'src/utils/antd-theme-alias-polyfill.js')
      ),
      // Ignore node-fetch and other Node.js-only modules that shouldn't be bundled for browser
      new webpack.IgnorePlugin({
        resourceRegExp: /^node-fetch$/,
      }),
      // Replace isomorphic-fetch's node implementation with browser fetch
      new webpack.NormalModuleReplacementPlugin(
        /^isomorphic-fetch\/fetch-npm-node\.js$/,
        path.resolve(__dirname, 'src/utils/fetch-polyfill.js')
      ),
      // Also replace fetch-npm-browserify.js to avoid whatwg-fetch dependency
      // Use our polyfill instead which uses native browser fetch
      new webpack.NormalModuleReplacementPlugin(
        /^isomorphic-fetch\/fetch-npm-browserify\.js$/,
        path.resolve(__dirname, 'src/utils/fetch-polyfill.js')
      ),
    ],

    // 优化配置
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: {
        name: 'runtime',
      },
      minimize: isProduction,
      minimizer: [
        new TerserPlugin(),
        new CssMinimizerPlugin({
          parallel: true,
        }),
      ],
    },

    // 解析配置
    resolve: {
      fallback: {
        os: require.resolve('os-browserify/browser'),
        // Node.js core modules polyfills for webpack 5
        path: false, // Not needed in browser environment
        url: false, // Not needed in browser environment, use URL API instead
        http: false, // Not needed in browser environment
        https: false, // Not needed in browser environment
        zlib: false, // Not needed in browser environment
        stream: false, // Not needed in browser environment
        util: false, // Not needed in browser environment
        buffer: false, // Not needed in browser environment, use global Buffer if needed
      },
      extensions: ['.js', '.jsx', '.json'],
      // 缓存模块解析结果，提升编译速度
      unsafeCache: /node_modules/,
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'utils': path.resolve(__dirname, 'src/utils'),
        'theme': path.resolve(__dirname, 'src/theme'),
        // Shim incompatible bizcharts-plugin-slider to avoid runtime errors
        'bizcharts-plugin-slider': path.resolve(
          __dirname,
          'src/utils/bizcharts-plugin-slider-shim.js'
        ),
        // Fix for @ant-design/compatible resetComponent import issue
        'antd/es/style': path.resolve(__dirname, 'src/utils/antd-style-polyfill.js'),
        // Fix for @ant-design/compatible theme util alias issue
        'antd/es/theme/util/alias': path.resolve(__dirname, 'src/utils/antd-theme-alias-polyfill.js'),
        // Fix for rc-resize-observer resolution issue in rc-virtual-list
        'rc-resize-observer': path.resolve(__dirname, 'node_modules/rc-resize-observer'),
        // Fix for @ant-design/colors - 使用 es 目录而不是 dist
        '@ant-design/colors/dist/index.esm.js': path.resolve(__dirname, 'node_modules/@ant-design/colors/es/index.js'),
        '@ant-design/colors/dist': path.resolve(__dirname, 'node_modules/@ant-design/colors/es'),
        // Fix for @ant-design/compatible - 确保正确解析 es 模块
        '@ant-design/compatible/es': path.resolve(__dirname, 'node_modules/@ant-design/compatible/es'),
        // Fix for @ant-design/compatible mention (removed in v5)
        '@ant-design/compatible/es/mention/index.js': path.resolve(__dirname, 'src/utils/antd-compatible-mention-shim.js'),
        '@ant-design/compatible/es/mention': path.resolve(__dirname, 'src/utils/antd-compatible-mention-shim.js'),
        // Fix for rc-util warning in @ant-design/compatible
        '@ant-design/compatible/node_modules/rc-util/es/warning.js': path.resolve(__dirname, 'src/utils/rc-util-warning-shim.js'),
      },
      modules: [
        path.resolve(__dirname, 'src'),
        'node_modules',
      ],
      // 确保优先解析根目录的 node_modules
      symlinks: false,
      // 确保正确解析 ES 模块
      // 优先使用 browser 字段，确保在浏览器环境中使用正确的实现
      // 对于 antd 5.0，优先使用 es 目录（ES 模块）
      mainFields: ['browser', 'module', 'main', 'es'],
    },

    // Source Map 配置（生产环境禁用 source map，开发环境使用更快的选项）
    devtool: isProduction ? false : 'eval-cheap-module-source-map',

    // 开发服务器配置
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'public'),
          publicPath: '/', // 确保 public 目录的文件可以通过根路径访问（如 /color.less）
        },
        // 提供 node_modules/less/dist 目录，让 less.min.js 可以直接访问
        {
          directory: path.join(__dirname, 'node_modules/less/dist'),
          publicPath: '/', // less.min.js 可以通过 /less.min.js 访问
          serveIndex: false,
        },
        // 提供 dll 目录，便于直接加载 vendor.dll.js
        {
          directory: path.join(__dirname, 'dll'),
          publicPath: '/dll',
        },
      ],
      port: 'auto',
      hot: true,
      open: false,
      proxy: {
        '/services/': {
          target: `http://${ip}/services/`,
          changeOrigin: true,
          pathRewrite: { '^/services/': '' },
        },
      },
      historyApiFallback: true,
      compress: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      // 集成 mock 中间件
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }
        // 添加 mock 中间件
        const mockApp = createMockMiddleware();
        devServer.app.use(mockApp);
        return middlewares;
      },
    },
  };
};
