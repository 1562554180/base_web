import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import classNames from 'classnames';
import styles from './index.less';

const GlobalFooter = ({ className, links, copyright }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <div className={clsString}>
      {links && (
        <div className={styles.links}>
          {links.map(link => (
            <a key={link.key} target={link.blankTarget !== false ? '_blank' : '_self'} href={link.href}>
              { link.title ? link.title : <LegacyIcon type={link.icon} /> }
            </a>
          ))}
        </div>
      )}
      {copyright && <div className='copyright'>{copyright}</div>}
    </div>
  );
};

export default GlobalFooter;
