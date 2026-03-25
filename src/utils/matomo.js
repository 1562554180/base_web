import _ from "lodash"

const menuMapping = {}

// 生成菜单映射
export const createMenuMapping = (menuArr) => {
  menuArr.forEach(item => {
    if (item.children && item.children.length > 0) {
      createMenuMapping(item.children)
    } else {
      menuMapping[item.path] = item.name
    }
  })
  return menuMapping
}

/*
params:{
  pathUrl: 页面地址 string;
  pathName: 页面名称 string;
  eventInfo: 事件信息 array： ["事件分类","事件动作"] 例如：["Button Click","Click"],
  eventInfo可选参数: ["事件名称","事件值"]
}
*/

export const matomo = (params, matomoSetting) => {
  if (_.isEmpty(params)) return false;
  const _paq = window._paq = window._paq || [];
  _paq.push(['enableLinkTracking']);
  const { u = '', setSiteId = '' } = matomoSetting
  const { pathUrl = window.location.href, pathName = "", eventInfo } = params
  if (pathUrl) {
    _paq.push(['setCustomUrl', pathUrl]);
    _paq.push(['setDocumentTitle', pathName]);
    _paq.push(['trackPageView']);
  }
  if (eventInfo) {
    _paq.push(['trackEvent', ...eventInfo]);
  }
  _paq.push(['setTrackerUrl', u + 'matomo.php']);
  _paq.push(['setSiteId', setSiteId]);
  const d = document
  if (_.isEmpty(d.getElementsByClassName("matomoScript"))) {
    const g = d.createElement('script')
    g.className = 'matomoScript'
    const s = d.getElementsByTagName('script')[0];
    g.async = true; g.src = u + 'matomo.js'; s.parentNode.insertBefore(g, s);
  }
}