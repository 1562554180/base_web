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

### CustomForm

动态表单组件，基于配置数组渲染表单项，支持级联选择和条件显示。

**文件位置**: `src/components/CustomForm/index.js`

**核心功能**:
- 根据配置数组动态渲染表单项
- 级联选择（relevanceMapping/relevanceFields）
- 条件显示字段（relationMapping）
- 表单验证、提交、重置

**使用示例**:
```jsx
import CustomForm from 'components/CustomForm';

const items = [
  { label: '名称', field_name: 'name', type: 'input', required: true },
  { label: '类型', field_name: 'type', type: 'select', options: [{ label: 'A', value: 'a' }] },
];

<CustomForm
  ref={formRef}
  items={items}
  values={{ name: 'test' }}
  onSubmit={(err, values) => { if (!err) console.log(values); }}
  onReset={() => console.log('reset')}
/>
```

**主要 Props**:

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `items` | Array | `[]` | 表单项配置数组 |
| `values` | Object | `{}` | 初始值 |
| `onSubmit` | Function | - | 提交回调 `(err, values) => void` |
| `onReset` | Function | - | 重置回调 |
| `onValuesChange` | Function | - | 值变化回调 `(e, record, values, items) => void` |
| `onRef` | Function | - | 获取组件 ref |
| `relevanceMapping` | Object | `{}` | 级联选择映射配置 |
| `relevanceFields` | Array | `[]` | 触发级联的字段名 |
| `relationMapping` | Object | `{}` | 条件显示映射配置 |
| `disabled` | Boolean | `false` | 禁用所有字段 |
| `layout` | String | `'horizontal'` | 表单布局 |
| `span` | Number | - | 所有字段的 Col span |

**Ref 方法**:
- `resetForm()` - 重置表单
- `setFieldsValue(values)` - 设置字段值
- `getFieldValue(field)` - 获取字段值
- `validateFields()` - 验证表单

### FormItemCreator

表单项渲染器，支持多种输入类型，配合 Form 组件使用。

**文件位置**: `src/components/FromItemCreator/index.js`

**支持的输入类型**:

| type | 组件 | 说明 |
|------|------|------|
| `input` | Input | 文本输入 |
| `inputNumber` | InputNumber | 数字输入 |
| `textarea` | Input.TextArea | 多行文本 |
| `select` | Select | 下拉选择 |
| `radio` | Radio.Group | 单选 |
| `radioButton` | Radio.Button | 按钮单选 |
| `checkbox` | Checkbox/Checkbox.Group | 复选框 |
| `switch` | Switch | 开关 |
| `date` | DatePicker | 日期选择 |
| `date_range` | RangePicker | 日期范围 |
| `cascader` | Cascader | 级联选择 |
| `password` | Input.Password | 密码输入 |
| `number_range` | 两个 Input | 数字范围 |
| `hex` | Input | 十六进制（带验证） |
| `ip` | Input | IP 地址（带验证） |
| `port` | Input | 端口号（带验证） |
| `text` | span | 纯文本展示 |

**使用示例**:
```jsx
import { Form } from 'antd';
import FormItemCreator from 'components/FromItemCreator';

const MyForm = () => {
  const [form] = Form.useForm();
  return (
    <Form form={form}>
      <FormItemCreator
        item={{
          label: '用户名',
          field_name: 'username',
          type: 'input',
          required: true,
          placeholder: '请输入用户名',
        }}
      />
      <FormItemCreator
        item={{
          label: 'IP 地址',
          field_name: 'ip',
          type: 'ip',
          required: true,
        }}
      />
    </Form>
  );
};
```

**Props**:

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `item` | Object | - | 字段配置对象（必填） |
| `marginBottom` | Number | `12` | 下边距 |
| `marginTop` | Number | `0` | 上边距 |
| `defaultValues` | Object | `{}` | 验证范围默认值 |
| `style` | Object | - | 额外样式 |
| `hasBr` | Boolean | - | 影响宽度计算 |
| `onSelectChange` | Function | - | Select 变化回调 |

**item 配置**:
```js
{
  field_name: String,    // 字段名（必填）
  label: String,         // 标签
  type: String,          // 输入类型
  value: Any,            // 初始值
  required: Boolean,     // 是否必填
  rules: Array,          // 额外验证规则
  options: Array,        // 选项（select/radio/checkbox）
  config: { value, label }, // 选项键名映射
  placeholder: String,   // 占位符
  disabled: Boolean,     // 禁用
  props: Object,         // 传递给输入组件的 props
  formItemLayout: Object, // Form.Item 布局
  pxWidth: Number,       // 固定标签宽度
  tooltip: String,       // Tooltip 提示
  mode: String,          // Select 模式 ('multiple'/'tags')
  value_range: String,   // 范围验证 (e.g., '[0,100]')
}
```

### FormSubmit

全新的动态表单组件，基于配置渲染表单项，支持字段联动（条件显示、选项联动）。

**文件位置**: `src/components/FormSubmit/index.js`

**核心功能**:
- 17 种表单类型支持
- 内置校验规则（IP、端口、十六进制、密码）
- 条件显示联动（字段A的值控制字段B的显示/隐藏）
- 选项联动（字段A的值决定字段B的可选项，支持多层级联）
- 自动生成 placeholder
- 灵活布局（formItemLayout + span）

**支持的表单类型**:

| type | 组件 | 说明 |
|------|------|------|
| `input` | Input | 文本输入 |
| `textarea` | Input.TextArea | 多行文本 |
| `select` | Select | 下拉选择 |
| `number` | InputNumber | 数字输入 |
| `number_range` | 两个 InputNumber | 数字范围（生成 min/max 两个字段） |
| `ip` | Input | IP 地址（自动校验） |
| `port` | InputNumber | 端口号（自动校验 1-65535） |
| `hex` | Input | 十六进制（自动校验） |
| `passport` | Input.Password | 密码（校验：6-16位，含数字+大小写字母） |
| `radio` | Radio | 单个单选框 |
| `radio_group` | Radio.Group | 单选组 |
| `checkbox` | Checkbox | 单个复选框 |
| `checkbox_group` | Checkbox.Group | 复选组 |
| `date` | DatePicker | 日期选择 |
| `date_range` | RangePicker | 日期范围 |
| `cascader` | Cascader | 级联选择 |
| `color` | Input[type="color"] | 颜色选择器 |

**使用示例**:

基础用法：
```jsx
import FormSubmit from 'components/FormSubmit';

const items = [
  { field_name: 'name', label: '名称', type: 'input', required: true },
  { field_name: 'type', label: '类型', type: 'select', options: [
    { value: 'tcp', label: 'TCP' },
    { value: 'udp', label: 'UDP' },
  ]},
  { field_name: 'ip', label: 'IP 地址', type: 'ip', required: true },
  { field_name: 'port', label: '端口', type: 'port' },
];

<FormSubmit
  ref={formRef}
  items={items}
  formItemLayout={{ label: 6, wrapper: 18 }}
  onSubmit={(values) => console.log(values)}
  onReset={() => console.log('reset')}
  values={{ name: '默认名称' }}
/>
```

联动用法（条件显示 + 选项联动）：
```jsx
const items = [
  { field_name: 'protocol', label: '协议类型', type: 'select', required: true, options: [
    { value: 'tcp', label: 'TCP' },
    { value: 'udp', label: 'UDP' },
    { value: 'http', label: 'HTTP' },
  ]},
  // 条件显示：协议=UDP 时显示
  { field_name: 'udpPort', label: 'UDP 端口', type: 'port' },
  // 条件显示：协议=HTTP 时显示
  { field_name: 'httpPath', label: 'HTTP 路径', type: 'input' },
  // 多层选项联动
  { field_name: 'province', label: '省份', type: 'select', options: [
    { value: 'beijing', label: '北京' },
    { value: 'shanghai', label: '上海' },
  ]},
  { field_name: 'city', label: '城市', type: 'select' },
  { field_name: 'district', label: '区县', type: 'select' },
];

const linkageConfig = {
  // 条件显示：根据协议类型显示/隐藏字段
  visibleWhen: {
    udpPort: { field: 'protocol', equals: 'udp' },
    httpPath: { field: 'protocol', equals: 'http' },
  },
  // 选项联动：省市县三级联动
  optionsLinkage: {
    city: {
      dependOn: 'province',
      map: {
        beijing: [{ value: 'haidian', label: '海淀区' }, { value: 'chaoyang', label: '朝阳区' }],
        shanghai: [{ value: 'pudong', label: '浦东新区' }, { value: 'jingan', label: '静安区' }],
      },
    },
    district: {
      dependOn: ['province', 'city'],  // 多字段依赖
      map: {
        'beijing.haidian': [{ value: 'zhongguancun', label: '中关村' }],
        'beijing.chaoyang': [{ value: 'sanlitun', label: '三里屯' }],
        'shanghai.pudong': [{ value: 'lujiazui', label: '陆家嘴' }],
      },
    },
  },
};

<FormSubmit
  items={items}
  linkageConfig={linkageConfig}
  onSubmit={(values) => console.log(values)}
/>
```

**主要 Props**:

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `items` | Array/Object | `[]` | 表单项配置，支持数组或对象格式 |
| `formItemLayout` | Object | `{label: 8, wrapper: 16}` | 标签与表单的栅格占比 |
| `values` | Object | `{}` | 表单初始值 |
| `linkageConfig` | Object | - | 联动配置（visibleWhen + optionsLinkage） |
| `onSubmit` | Function | - | 提交回调 `(values) => void` |
| `onReset` | Function | - | 重置回调 `() => void` |
| `onValuesChange` | Function | - | 值变化回调 `(changedValues, allValues) => void` |

**item 配置**:
```js
{
  field_name: String,    // 字段名（必填）
  label: String,         // 标签
  type: String,          // 表单类型
  required: Boolean,     // 是否必填
  placeholder: String,   // 占位符（默认自动生成：请输入/选择${label}）
  rules: Array|Object,   // 额外校验规则 {pattern, message}
  span: Number,          // 栅格占位 0-24，默认 24
  defaultValue: Any,     // 默认值
  options: Array,        // 选项（select/radio_group/checkbox_group/cascader）
  config: Object,        // 选项键名映射 {value, label}
  text: String,          // 单选/复选框的文本内容
  props: Object,         // 传递给输入组件的额外 props
}
```

**linkageConfig 配置**:

```js
{
  // 条件显示映射
  visibleWhen: {
    [fieldName]: {
      field: String,          // 依赖的字段名
      equals: Any,            // 等于某值时显示
      notEquals: Any,         // 不等于某值时显示
      in: Array,              // 值在数组中时显示
      notIn: Array,           // 值不在数组中时显示
      show: Function,         // 自定义判断 (value, allValues) => boolean
    }
  },

  // 选项联动映射
  optionsLinkage: {
    [fieldName]: {
      dependOn: String|Array, // 依赖的字段名或字段名数组
      map: Object,            // 值到选项的映射 { [depValue]: options }
      separator: String,      // 多依赖时的分隔符，默认 '.'
      clearOnDepChange: Boolean, // 依赖变化时是否清空当前字段值，默认 true
    }
  }
}
```

**Ref 方法**:
- `validateFields()` - 验证表单，返回 Promise
- `resetFields()` - 重置表单
- `setFieldsValue(values)` - 设置字段值
- `getFieldValue(name)` - 获取单个字段值
- `getFieldsValue()` - 获取所有字段值
- `submit()` - 触发表单提交

**number_range 特殊处理**:
- 生成两个字段：`${field_name}_min` 和 `${field_name}_max`
- 提交时自动合并为 `{ min, max }` 对象

**内置校验规则**:
- `ip`: IPv4 格式校验（如 192.168.1.1）
- `port`: 端口范围校验（1-65535）
- `hex`: 十六进制格式校验（0-9, A-F, a-f）
- `passport`: 密码强度校验（6-16位，必须包含数字、大写字母、小写字母）

### EditHeader

可配置的表格列/表单字段编辑器，支持配置表头、表单项和文本字段。

**文件位置**: `src/common/EditHeader/index.js`

**核心功能**:
- 三种配置模式：表头（headers）、表单项（formItem）、文本（text）
- 拖拽排序、导入导出配置
- 表单项支持字段依赖和条件显示配置
- 配置持久化到后端

**使用示例**:

```jsx
import EditHeader from 'common/EditHeader';

// 表头配置
<EditHeader
  title="编辑表头"
  type="user_list_headers"
  columnsType="headers"
  updateHeaders={(headers) => this.setState({ headers })}
/>

// 表单字段配置
<EditHeader
  title="配置表单字段"
  type="user_form_config"
  columnsType="formItem"
  updateHeaders={(formConfig) => this.setState({ formConfig })}
/>

// 隐藏按钮，通过外部控制显示
<EditHeader
  type="my_config"
  isHideBtn
  ref={editHeaderRef}
  updateHeaders={this.handleConfigUpdate}
/>
// 外部调用: editHeaderRef.current.handleModalVisible(true)
```

**主要 Props**:

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | String | `'编辑表头'` | 按钮文字和弹窗标题 |
| `modalTitle` | String | - | 单独设置弹窗标题 |
| `type` | String | - | 配置类型标识（用于后端存储） |
| `localType` | String | - | 本地默认配置的备选类型 |
| `columnsType` | String | `'headers'` | 配置模式：`'headers'`/`'formItem'`/`'text'` |
| `isAddShowInDetail` | Boolean | `false` | 表头模式是否显示"详情显示"列 |
| `updateHeaders` | Function | - | 配置更新回调 `(data) => void` |
| `disabled` | Boolean | `false` | 禁用按钮 |
| `style` | Object | - | 按钮样式 |
| `isHideBtn` | Boolean | `false` | 隐藏触发按钮 |
| `size` | String | `'default'` | 按钮尺寸 |
| `btnClassName` | String | - | 按钮 className |
| `hideAdd` | Boolean | `false` | 隐藏添加按钮 |

**columnsType 模式说明**:

| 模式 | 可配置字段 | 用途 |
|------|----------|------|
| `headers` | ch_name, en_name, show_in_detail, is_disabled, en_name_form, hidden, type, position, align, width, mapping, unit, is_sorter, is_search | 表格列配置 |
| `formItem` | ch_name, en_name, hidden, required, span, value_range, field_type, options, default_value, relevance_field, visible_when_config, unit | 表单字段配置 |
| `text` | ch_name, en_name, tooltip, default_value, is_edit, hidden, type, mapping, unit | 文本字段配置 |

**formItem 模式字段联动配置**:

1. **依赖字段（relevance_field）**: 配置 select 字段的选项联动
   - 选择另一个 select 字段作为依赖
   - 在弹窗中为每个父字段值配置对应的子选项

2. **条件显示（visible_when_config）**: 配置字段的显示条件
   - 选择依赖字段
   - 选择操作符：等于、不等于、包含于、不包含于
   - 设置匹配值

**配置数据结构（formItem 模式）**:

```javascript
{
  id: String,              // 唯一标识
  ch_name: String,         // 中文名
  en_name: String,         // 英文名（字段名）
  hidden: '0' | '1',       // 是否隐藏
  required: '0' | '1',     // 是否必填
  span: String,            // 栅格占比（0-24）
  value_range: String,     // 取值范围
  field_type: String,      // 字段类型
  options: String,         // 选项 JSON
  default_value: String,   // 默认值
  relevance_field: String, // 依赖字段名
  relevance_config: String,// 依赖配置 JSON
  useCascader: '0' | '1',  // 是否使用级联模式
  visible_when_config: String, // 条件显示配置 JSON
  unit: String,            // 单位
}
```

**visible_when_config 格式**:
```json
{
  "dependOn": "field_name",
  "operator": "equals",
  "value": "expected_value"
}
```

**relevance_config 格式**:
```json
{
  "parentValue1": {
    "data": [{"key": "k1", "value": "v1"}],
    "readableName": "显示名称"
  }
}
```

### initFormItems

表单项配置初始化工具函数，将后端配置转换为前端可用的格式。

**文件位置**: `src/common/utils.js`

**导出**: `initFormItems(list, formData, noFormData)`

**参数**:
- `list`: Array - 表单项配置数组（来自 EditHeader 或后端）
- `formData`: Object - 当前表单数据（用于 range_relevance 判断）
- `noFormData`: Boolean - 是否包含隐藏字段

**返回值**:
```javascript
{
  items: Array,           // 处理后的表单项配置
  linkageConfig: {        // FormSubmit 联动配置
    visibleWhen: Object,  // 条件显示配置
    optionsLinkage: Object // 选项联动配置
  }
}
```

**使用示例**:

```jsx
import { initFormItems } from 'common/utils';
import FormSubmit from 'components/FormSubmit';

const MyForm = ({ formConfig }) => {
  const { items, linkageConfig } = initFormItems(formConfig);

  return (
    <FormSubmit
      items={items}
      linkageConfig={linkageConfig}
      onSubmit={(values) => console.log(values)}
    />
  );
};
```

**转换逻辑**:
- `relevance_config` → `linkageConfig.optionsLinkage`
- `visible_when_config` → `linkageConfig.visibleWhen`
- 选项格式转换：`{key, value}` → `{value: key, label: value}`

## Code Generation Tools

The `tools/` directory contains scaffolding scripts:
- `crud.js` - Generates CRUD page components, models, requests, and mock services
- `list.js` - Generates list page scaffolding
- `router.js` - Generates router configuration for PHP/Java backends
- `php/OpsGenerator.js` - Generates PHP operation handlers
