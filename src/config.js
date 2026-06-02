import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { ConfigProvider, Spin, App } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import { getStorageData, setStorageData } from 'utils/storage';
import config from 'utils/config';
import dynamic from 'dva/dynamic';
import themeConfig from 'utils/theme';
import { setGlobalModal } from 'utils/modal';
import { getRouterData } from './router';
import styles from './index.less';

const { ConnectedRouter } = routerRedux;

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

// 主题配置
const themes = themeConfig;

// 创建主题 Context
export const ThemeContext = React.createContext({
  themeName: 'dark',
  theme: themes.dark,
  setTheme: () => {},
});

// 获取初始主题名称
export function getInitialThemeName() {
  return getStorageData('theme', config.selectedTheme || 'dark');
}

function getLocale() {
  const locale = getStorageData('loc', config.locale);
  if (locale === 'zhCN') return zhCN;
  return enUS;
}

// 内部组件，用于初始化全局 modal 实例
function AppWrapper({ children }) {
  const { modal } = App.useApp();

  // 设置全局 modal 实例
  React.useEffect(() => {
    setGlobalModal(modal);
  }, [modal]);

  return children;
}

// 主题 Provider 组件
function ThemeProvider({ children }) {
  const [themeName, setThemeNameState] = React.useState(getInitialThemeName());
  const lastThemeRef = React.useRef(themeName);

  const setTheme = React.useCallback((name) => {
    if (!name || name === lastThemeRef.current) return;
    lastThemeRef.current = name;
    setStorageData('theme', name);
    setThemeNameState(name);
    // 更新 body 背景色
    document.body.style.background = themes[name]?.custom?.layoutBg || themes.dark.custom.layoutBg;
    if (config.store) {
      const currentTheme = config.store.getState?.().main?.themeName;
      if (currentTheme !== name) {
        config.store.dispatch({
          type: 'main/updateState',
          payload: { themeName: name },
        });
      }
    }
  }, []);

  const theme = themes[themeName] || themes.dark;

  // 初始化时设置 body 背景色并同步到 store
  React.useEffect(() => {
    document.body.style.background = theme.custom.layoutBg;
    if (config.store && config.store.getState?.().main?.themeName !== themeName) {
      config.store.dispatch({
        type: 'main/updateState',
        payload: { themeName },
      });
    }
    lastThemeRef.current = themeName;
  }, [theme, themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 内部组件：主题消费者，用于重新渲染 ConfigProvider
function ThemedApp({ history, AppLayout }) {
  const { theme } = React.useContext(ThemeContext);

  return (
    <ConfigProvider
      locale={getLocale()}
      theme={theme}
    >
      <App>
        <AppWrapper>
          <ConnectedRouter history={history}>
            <Switch>
              <Route path="/" component={AppLayout} />
            </Switch>
          </ConnectedRouter>
        </AppWrapper>
      </App>
    </ConfigProvider>
  );
}

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const AppLayout = routerData['/'].component;

  return (
    <ThemeProvider>
      <ThemedApp history={history} AppLayout={AppLayout} />
    </ThemeProvider>
  );
}

export default RouterConfig;
