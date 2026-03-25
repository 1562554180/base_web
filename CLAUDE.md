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

## Code Generation Tools

The `tools/` directory contains scaffolding scripts:
- `crud.js` - Generates CRUD page components, models, requests, and mock services
- `list.js` - Generates list page scaffolding
- `router.js` - Generates router configuration for PHP/Java backends
- `php/OpsGenerator.js` - Generates PHP operation handlers
