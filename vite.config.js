import { defineConfig, normalizePath } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const babelTransform = require('@babel/core').transformSync;

// 后端 IP（与 webpack.config.js 保持一致）
const ip = '172.16.10.26';

// 加载 mock 中间件
let createMockMiddleware;
try {
  createMockMiddleware = require('./webpack.mock');
} catch (e) {
  console.warn('[vite] Mock middleware not loaded:', e.message);
}

// 自定义插件 1: 让所有 src/ 下的 .less 文件启用 CSS Modules（与 Webpack 行为一致）
function allLessCSSModulesPlugin() {
  const srcDir = normalizePath(path.resolve(__dirname, 'src'));
  const moduleLessRE = /\.module\.less$/;
  return {
    name: 'all-less-css-modules',
    enforce: 'pre',
    resolveId(source, importer, options) {
      if (!importer || !source.endsWith('.less')) return;
      if (moduleLessRE.test(source)) return;
      if (!source.startsWith('.')) return;
      const resolveDir = path.dirname(importer);
      const resolved = normalizePath(path.resolve(resolveDir, source));
      if (resolved.startsWith(srcDir)) {
        return resolved.replace(/\.less$/, '.module.less');
      }
    },
    load(id) {
      const normalizedId = normalizePath(id);
      if (!normalizedId.startsWith(srcDir) || !moduleLessRE.test(normalizedId)) return;
      const actualPath = normalizedId.replace(/\.module\.less$/, '.less');
      if (!fs.existsSync(actualPath)) return null;
      return fs.readFileSync(actualPath, 'utf-8');
    },
  };
}

// 自定义插件 2: 让 .js 文件中的 JSX 在 dev 和 build 时都能被正确转换
// esbuild loader: 'jsx' 在 Vite 6 中可能不覆盖所有请求（带查询参数的模块 ID）
// 所以统一用 babel 在 enforce: 'pre' 阶段处理所有含 JSX 的 .js 文件
function jsxInJsPlugin() {
  const srcDir = normalizePath(path.resolve(__dirname, 'src'));
  const babelConfig = {
    presets: [
      ['@babel/preset-env', { targets: 'defaults', modules: false }],
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-transform-class-properties', { loose: false }],
    ],
    sourceMaps: false,
    compact: false,
  };
  return {
    name: 'jsx-in-js',
    enforce: 'pre',
    transform(code, id) {
      // 只处理 src/ 下的 .js 文件（不含 .jsx，.jsx 由 esbuild/插件正常处理）
      if (!/\.js$/.test(id)) return;
      if (!normalizePath(id).startsWith(srcDir)) return;
      // 快速检测是否包含 JSX
      if (!/<[A-Z]|<\/[A-Z]|<div|<span|<React|<>/.test(code)) return null;
      const result = babelTransform(code, { ...babelConfig, filename: id });
      if (result && result.code !== code) {
        return { code: result.code, map: result.map };
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [
    allLessCSSModulesPlugin(),
    jsxInJsPlugin(),
    // Mock 中间件插件
    {
      name: 'mock-middleware',
      configureServer(server) {
        if (!createMockMiddleware) return;
        const mockApp = createMockMiddleware();
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.startsWith('/_mock') || req.url.startsWith('/api'))) {
            mockApp(req, res, next);
          } else {
            next();
          }
        });
      },
    },
    react({
      include: /\.(jsx?|tsx?)$/,
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-transform-class-properties', { loose: false }],
          [
            'module-resolver',
            {
              alias: {
                components: './src/components',
                utils: './src/utils',
                layouts: './src/layouts',
                models: './src/models',
                requests: './src/requests',
                common: './src/common',
                assets: './src/assets',
              },
            },
          ],
          [
            'import',
            {
              libraryName: 'antd',
              style: false, // antd 5 使用 CSS-in-JS
              libraryDirectory: 'es',
            },
          ],
        ],
      },
    }),
    // Temporarily disable module federation in Vite mode to avoid runtime
    // remote plugin incompatibility causing blank screen.
    // federation({
    //   name: 'antdShell',
    //   filename: 'remoteEntry.js',
    //   remotes: {},
    //   shared: {
    //     react: { singleton: true, eager: true, requiredVersion: '17.0.2' },
    //     'react-dom': { singleton: true, eager: true, requiredVersion: '17.0.2' },
    //   },
    // }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // 替代 webpack resolve.modules: ['src/', 'node_modules'] 和 babel module-resolver
      components: path.resolve(__dirname, 'src/components'),
      utils: path.resolve(__dirname, 'src/utils'),
      layouts: path.resolve(__dirname, 'src/layouts'),
      models: path.resolve(__dirname, 'src/models'),
      requests: path.resolve(__dirname, 'src/requests'),
      common: path.resolve(__dirname, 'src/common'),
      assets: path.resolve(__dirname, 'src/assets'),
      theme: path.resolve(__dirname, 'src/theme'),
      // LESS tilde import 支持: @import '~theme/variables.less'
      '~theme': path.resolve(__dirname, 'src/theme'),
      '~components': path.resolve(__dirname, 'src/components'),
      '~utils': path.resolve(__dirname, 'src/utils'),
      '~layouts': path.resolve(__dirname, 'src/layouts'),
      '~models': path.resolve(__dirname, 'src/models'),
      '~requests': path.resolve(__dirname, 'src/requests'),
      '~common': path.resolve(__dirname, 'src/common'),
      '~assets': path.resolve(__dirname, 'src/assets'),
      // NormalModuleReplacementPlugin shims
      'antd/es/style': path.resolve(__dirname, 'src/utils/antd-style-polyfill.js'),
      'antd/es/theme/util/alias': path.resolve(__dirname, 'src/utils/antd-theme-alias-polyfill.js'),
      'bizcharts-plugin-slider': path.resolve(__dirname, 'src/utils/bizcharts-plugin-slider-shim.js'),
      // @ant-design/compatible shims
      '@ant-design/compatible/es/mention/index.js': path.resolve(__dirname, 'src/utils/antd-compatible-mention-shim.js'),
      '@ant-design/compatible/es/mention': path.resolve(__dirname, 'src/utils/antd-compatible-mention-shim.js'),
      '@ant-design/compatible/node_modules/rc-util/es/warning.js': path.resolve(__dirname, 'src/utils/rc-util-warning-shim.js'),
      // Module Federation dts plugin subpath fallback (vite optimizeDeps compatibility)
      '@module-federation/dts-plugin/dynamic-remote-type-hints-plugin': path.resolve(__dirname, 'src/utils/mf-dts-dynamic-remote-type-hints-shim.js'),
      // Node.js polyfills
      os: path.resolve(__dirname, 'node_modules/os-browserify/browser.js'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },

  css: {
    modules: {
      generateScopedName: '[name]__[local]--[hash:base64:5]',
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        paths: [path.resolve(__dirname, 'src/utils'), path.resolve(__dirname, 'src')],
      },
    },
  },

  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
    include: [
      'react',
      'react-dom',
      'dva',
      'dva-loading',
      'antd',
      '@ant-design/icons',
      'moment',
      'lodash',
      'echarts',
    ],
  },

  server: {
    port: 8000,
    origin: 'http://localhost:8000',
    open: false,
    proxy: {
      '/services/': {
        target: `http://${ip}/services/`,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/services\//, ''),
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    fs: {
      allow: ['..'],
    },
    watch: {
      usePolling: true, // Windows 兼容性
    },
  },

  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'yuantek_assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      // 排除 .min.js 备份文件
      external: [/(?:^|\/).*\.min\.js$/],
    },
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.BABEL_ENV': JSON.stringify(process.env.BABEL_ENV || 'development'),
  },
});
