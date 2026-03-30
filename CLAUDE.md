# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QWP-Antd is a React-based admin dashboard application built with:
- **React 17.0.2** with **Ant Design 5.x** (migrated from v4)
- **DVA** (state management based on Redux/saga)
- **Webpack 5** (custom configuration with Module Federation support)
- **LESS** for styling

The project is a satellite signal processing system management interface for "天元特通" (Yuantek), featuring network topology visualization, spectrum analysis, and VSAT network management.

## Development Commands

```bash
# Start development server (opens on auto port)
npm start

# Production build (outputs to dist/)
npm run build

# Linting (ESLint + Stylelint)
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Generate CRUD scaffold code
npm run crud -- --path=system/user/sample --model=sampleModel

# Generate PHP router code
npm run router:php
```

## Architecture

### Directory Structure

```
src/
├── apps/           # Page components (route targets)
│   ├── layout.js   # Main app layout wrapper
│   └── home/       # Home page module
├── common/         # Shared utilities (ECharts configs, export helpers)
├── components/     # Reusable UI components
├── layouts/        # Layout templates (BlankLayout, PageHeaderLayout)
├── models/         # DVA models (state management)
│   ├── main.js     # Primary application state
│   ├── passport.js # Authentication state
│   └── sat/        # Feature-specific models
├── requests/       # API request modules (service layer)
├── services/       # Service configurations
├── theme/          # Theme configurations
├── utils/          # Utility functions (config, localization, form handling)
├── config.js       # React router configuration with Antd ConfigProvider
├── router.js       # Route definitions using dva/dynamic
└── index.js        # Application entry point (dva initialization)
```

### Key Patterns

**DVA State Management:**
- Models are registered in `src/index.js` and loaded dynamically via `dva/dynamic`
- Models follow the pattern: `namespace`, `state`, `effects` (sagas), `reducers`, `subscriptions`
- The main model handles authentication, menu state, theme, and global settings

**Dynamic Routing:**
- Routes defined in `src/router.js` using `dynamicWrapper`
- Route paths map to components in `src/apps/`
- Models can be loaded on-demand with route components

**Module Federation:**
- This app is a Module Federation host (`antdShell`)
- Remote modules: `home` (dev server), `about` (static)
- Shared dependencies: React and ReactDOM as singletons

**Configuration:**
- `src/utils/config.js` contains application-wide settings (API endpoints, timer intervals, device configurations)
- `src/config.js` provides the React router with Antd ConfigProvider theming (dark theme with custom tokens)

**API Layer:**
- Request modules in `src/requests/` define API calls
- Development proxy configured in `webpack.config.js` (`/services/` → backend IP)
- Mock middleware available via `webpack.mock.js`

**Theming:**
- Antd v5 CSS-in-JS with custom token overrides in `src/config.js`
- LESS files for component-specific styles
- Theme switching supported via `config.selectedTheme`

### Module Resolution Aliases

Configured in both `.babelrc.js` and `webpack.config.js`:
- `@/` → `src/`
- `utils/` → `src/utils/`
- `theme/` → `src/theme/`
- `components/` → `src/components/`
- `requests/` → `src/requests/`
- `common/` → `src/common/`
- `layouts/` → `src/layouts/`

### Backend Integration

- Services accessed via `/services/` prefix
- Development backend IP configured in `webpack.config.js` (currently `172.16.10.26`)
- Supports both REST and non-RESTful API modes (`config.restfulApi`)

## Component Library

### AgTable

基于 AG Grid v32 封装的高性能表格组件，兼容 Ant Design Table API，支持从 `newStandardTable` 渐进式迁移。

**文件位置**: `src/components/agTable/index.js`

**导出**:
- 默认导出: `ConnectedAgTable` - 自动注入主题（dva connect）
- 命名导出: `PureAgTable` - 无 dva 依赖

**核心功能**:
- 列宽自适应 + localStorage 持久化（需设置 `tableKey`）
- 列操作菜单（对齐、排序、固定、隐藏、调整表头）
- 行选择（checkbox/radio）、展开行、行拖拽排序
- 集成搜索栏（复用 `newStandardTable/searchBar`）
- 多主题支持（light/dark/techBlack）
- 内置数据获取模式（`fetchData`），支持搜索、排序、分页自动触发请求

**两种数据模式**:

1. **外部数据模式**（默认）：通过 `data` prop 传入数据，组件只负责展示
2. **自动请求模式**：传入 `fetchData` 函数，组件在挂载、搜索、排序、分页变化时自动调用，参数自动合并，数据在组件内部管理

**使用示例**:

外部数据模式：
```jsx
<AgTable
  tableKey="user-list"
  columns={columns}
  data={data}                    // 数组或 { list: [] }
  height={500}
/>
```

自动请求模式（推荐）：
```jsx
// fetchData 签名: (params, callback) => void
// params: AgTable 合并后的参数对象（分页、排序、搜索、基础params）
// callback: 回调函数，将接口返回数据透传给 AgTable

fetchData = (params, callback) => {
  api.getList(params, (res) => {
    callback(res);  // 直接透传接口返回数据
  });
}

// 页面使用
<AgTable
  tableKey="user-list"
  columns={columns}
  fetchData={this.fetchData}
  params={{ status: 'active' }}  // 基础参数，每次请求都会带上
  isUpdate={refreshFlag}         // 改变时触发 fetchData 重新请求
  pageSize={100}
/>
```

**主要 Props**:

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | Array | `[]` | 列配置，兼容 Ant Design Table 格式 |
| `data` | Array/Object | `[]` | 数据源（外部数据模式） |
| `fetchData` | Function | - | 数据获取函数 `(params, callback) => void`，callback 透传接口数据 |
| `params` | Object | `{}` | fetchData 的基础参数，每次请求都会合并 |
| `isUpdate` | Boolean | `false` | 改变时触发 fetchData 重新请求（用于外部刷新） |
| `dataField` | String | `''` | 回调数据中取数据的字段名，如 `'list'` 则取 `res['list']` |
| `getData` | Function | - | 数据获取后的回调 `(data) => void` |
| `height` | Number | `540` | 表格高度 |
| `loading` | Boolean | `false` | 加载状态 |
| `pagination` | Boolean | `true` | 是否启用分页 |
| `pageSize` | Number | `30` | 每页条数 |
| `selectedRowKeys` | Array | `[]` | 选中的行 keys |
| `onSelectRow` | Function | - | 行选择回调 `(selectedRowKeys, selectedRows)` |
| `onRowClick` | Function | - | 行点击回调 `(record, index)` |
| `expandedRowRender` | Function | - | 展开行渲染函数 |
| `rowKey` | String/Function | `'id'` | 行唯一标识 |
| `rowSelectionType` | String | `'checkbox'` | 选择类型 |
| `tableKey` | String | - | 表格唯一标识（用于持久化） |
| `searchObj` | Object | `{}` | 搜索条件对象 |
| `onSearch` / `onReset` | Function | - | 搜索/重置回调 |
| `enableRowDrag` | Boolean | - | 是否启用行拖拽 |

**fetchData 签名**:
```js
// params: AgTable 合并后的参数（字段名固定，使用者自行适配后端）
// callback(res): 回调函数，透传接口返回数据
//   - 若设置了 dataField='list'，取 res['list'] 作为表格数据
//   - 若 dataField 为空，直接使用 res
fetchData = (params, callback) => {
  api.getList(params, (res) => {
    callback(res);
  });
}
```

**fetchData 参数对象（字段名固定）**:
```js
{
  ...params,           // 基础参数（props.params）
  ...internalFilters,  // 当前搜索条件
  currentPage,         // 当前页码
  pageSize,            // 每页条数
  order,               // 排序方向 'asc' | 'desc'
  sorter,              // 排序字段（dataIndex）
}
```

**特殊列配置属性**:
- `dataType`: 排序数据类型（`'number'`/`'ip'`/默认字符串）
- `is_disabled`: 标记为固定操作列，不可移动
- `isSearch` / `type` / `options`: 搜索栏配置

## Code Generation Tools

The `tools/` directory contains scaffolding scripts:
- `crud.js` - Generates CRUD page components, models, requests, and mock services
- `list.js` - Generates list page scaffolding
- `router.js` - Generates router configuration for PHP/Java backends
- `php/OpsGenerator.js` - Generates PHP operation handlers
