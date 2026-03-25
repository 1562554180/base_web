import React from 'react';
import _ from 'lodash';
import * as Icon from '@ant-design/icons';

const themeMapping = {line: 'Outlined', fill: 'Filled', two_tone: 'TwoTone'};

export default function CreateIcon (props) {
  const { type, theme = 'line', className, color, size, style, spin = false, customIcon = false, onClick, ...otherProps } = props;
  const $style = {...style};
  if (color) $style.color = color;
  if (size) $style.fontSize = size;
  if (customIcon) {
    const IconFont = Icon.createFromIconfontCN({scriptUrl: '/yuantek_others/iconfont.js'});
    return <IconFont type={type} className={className} style={$style} spin={spin} onClick={onClick} {...otherProps} />
  }
  if (!_.isString(type) || !_.isString(theme)) return null;
  if (!themeMapping[theme]) return null;
  const utype = `${type.split('-').map(i => _.upperFirst(i)).join('')}${themeMapping[theme]}`;
  const IconComponent = Icon[utype];
  if (!IconComponent) return null;

  return (
    <IconComponent className={className} style={$style} spin={spin} onClick={onClick} {...otherProps} />
  );
}
