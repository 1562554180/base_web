import React from 'react';
import { Card, Tooltip } from 'antd';
import classNames from 'classnames';
import PopupProtoList from 'common/PopupProtoList';

import styles from './index.less';

const renderTotal = (total, tooltipValue, isShowTooltip, popover, special) => {
  let totalDom;
  const styleParams = {};
  if (popover) {
    styleParams.cursor = "pointer";
  }
  switch (typeof total) {
    case 'undefined':
      totalDom = null;
      break;
    case 'function':
      totalDom = isShowTooltip ? <Tooltip title={tooltipValue}><div style={styleParams} className={special ? styles.special_total : styles.total}>{total()}</div></Tooltip> : <div style={styleParams} className={special ? styles.special_total : styles.total}>{total()}</div>;
      break;
    default:
      totalDom = isShowTooltip ? <Tooltip title={tooltipValue}><div style={styleParams} className={special ? styles.special_total : styles.total}>{total}</div></Tooltip> : <div style={styleParams} className={special ? styles.special_total : styles.total}>{total}</div>;
  }
  return totalDom;
};

const ChartCard = ({
  isChangeStyle,
  loading = false,
  contentHeight,
  title,
  avatar,
  action,
  total,
  special,
  footer,
  children,
  bodyStyle,
  titleTextAlign,
  isShowTooltip,
  tooltipValue,
  popover,
  isToday,
  Popovertitle,
  ip,
  onClick,
  isBasicHome,
  linkClick,
  ...rest
}) => {
  const content = (
    <div className={styles.chartCard}>
      <div
        className={classNames(styles.chartTop, {
          [styles.chartTopMargin]: !children && !footer,
        })}
      >
        <div style={{textAlign: titleTextAlign || 'left',display: isChangeStyle ? 'flex': ''}}>
          <div className={styles.avatar}>{avatar}</div>
          <div>
            <div className={styles.meta}>
              <span className={classNames(styles.title, footer ? 'metaTheme': '')}>{title}</span>
              <span className={classNames(styles.action, footer ? 'metaTheme': '')}>{action}</span>
            </div>
            {renderTotal(total, tooltipValue, isShowTooltip, popover, special)}
          </div>
        </div>
      </div>
      {children && (
        <div className={styles.content} style={{ height: contentHeight || 'auto' }}>
          <div className={contentHeight && styles.contentFixed}>{children}</div>
        </div>
      )}
      {footer && (
        <div
          className={classNames(styles.footer, {
            [styles.footerMargin]: !children,
          })}
        >
          {footer}
        </div>
      )}
    </div>
  );

  
  if(popover) {
    return (
      <PopupProtoList isToday={isToday} Popovertitle={Popovertitle} dataSource={popover} ip={ip} isBasicHome={isBasicHome} linkClick={linkClick}>
        <Card onClick={onClick} loading={loading} bodyStyle={{...bodyStyle, cursor: 'pointer'} || { padding: '20px 24px 8px 24px', cursor: 'pointer'}} {...rest}>
          {content}
        </Card>
      </PopupProtoList>
    )
  }
  return (
    <Card onClick={onClick} loading={loading} bodyStyle={bodyStyle || { padding: '20px 24px 8px 24px'}} {...rest}>
      {content}
    </Card>
  );
};

export default ChartCard;
