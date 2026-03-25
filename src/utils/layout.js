import React from 'react';
import config from './config'

export const sizer = {
  add(context) {
    context._updateSize = context.updateSize.bind(context);
    if (context.updateSize() === false) {
      const _initSizeTimer = () => {
        if (context.updateSize() === false) {
          context._initSizeTimer = setTimeout(_initSizeTimer, 100000);
        } else {
          context._initSizeTimer = false;
        }
      };
      _initSizeTimer();
    }
    window.addEventListener('resize', context._updateSize);
  },
  remove(context) {
    if (context._updateSize) {
      window.removeEventListener('resize', context._updateSize);
      if (context._initSizeTimer) clearTimeout(context._initSizeTimer);
    }
  },
}

function css(o, attr) {
  if (!o) return false;
  return window.getComputedStyle(o, null).getPropertyValue(attr)
}

function minHeight(o) {
  const v1 = css(o, 'min-height');

  return v1 ? parseInt(v1.trimRight('px'), 10) : 0;
}

function maxHeight(o) {
  const v1 = css(o, 'max-height');

  return v1 ? parseInt(v1.trimRight('px'), 10) : 0;
}

export const elements = {
  siderScrollbarThumb ({ style, ...props }) {
    const colors = config.colors || {};
  
    return (
      <div style={{ ...style, backgroundColor: colors.siderScrollbarThumber || 'rgb(123, 225, 248)', borderRadius: 3 }} {...props} />
    );
  },
  contentScrollbarThumb ({ style, ...props }) {
    const colors = config.colors || {};
  
    return (
      <div className='scrollBarThumb' style={{ ...style, borderRadius: 3 }} {...props} />
    );
  },
  component(Component, props) {
    return (<Component {...props} />);
  },
  getBoundingRectById(id) {
    const o = document.getElementById(id);

    return o ? o.getBoundingClientRect() : false;
  },
  getBoundingRectBySelector(s) {
    const o = document.querySelector(s);

    return o ? o.getBoundingClientRect() : false;
  },
  css,
  verticalPadding(o) {
    let v1 = css(o, 'padding-top');
    let v2 = css(o, 'padding-bottom');

    v1 = v1 ? parseInt(v1.trimRight('px'), 10) : 0;
    v2 = v2 ? parseInt(v2.trimRight('px'), 10) : 0;

    return  v1 + v2;
  },
  horizontalPadding(o) {
    let v1 = css(o, 'padding-left');
    let v2 = css(o, 'padding-right');

    v1 = v1 ? parseInt(v1.trimRight('px'), 10) : 0;
    v2 = v2 ? parseInt(v2.trimRight('px'), 10) : 0;

    return  v1 + v2;
  },
  top(o) {
    if (!o) return 0;

    let sum = 0;

    while (o != null) {
      sum += o.offsetTop;
      o = o.offsetParent;
    }

    return sum;
  },
  left(o) {
    if (!o) return 0;

    let sum = 0;

    while (o != null) {
      sum += o.offsetLeft;
      o = o.offsetParent;
    }

    return sum;
  },
  minHeight,
  maxHeight,
  height(o) {
    if (!o) return 0;
    
    const h1 = minHeight(o);
    const h2 = maxHeight(o);
    const h3 = o.getBoundingClientRect().height;

    return h2 && h3 > h2 ? h2 : (h1 && h3 < h1 ? h1 : h3);
  },
  verticalMargin(o) {
    let v1 = css(o, 'margin-top');
    let v2 = css(o, 'margin-bottom');

    v1 = v1 ? parseInt(v1.trimRight('px'), 10) : 0;
    v2 = v2 ? parseInt(v2.trimRight('px'), 10) : 0;

    return  v1 + v2;
  },
  horizontalMargin(o) {
    let v1 = css(o, 'margin-left');
    let v2 = css(o, 'margin-right');

    v1 = v1 ? parseInt(v1.trimRight('px'), 10) : 0;
    v2 = v2 ? parseInt(v2.trimRight('px'), 10) : 0;

    return  v1 + v2;
  },
}