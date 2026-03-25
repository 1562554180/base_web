import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const StandardFormRow = ({ title, children, last, block, grid, ...rest }) => {
  const cls = classNames(styles.standardFormRow, {
    [styles.standardFormRowBlock]: block,
    [styles.standardFormRowLast]: last,
    [styles.standardFormRowGrid]: grid,
  }, 'standardFormStyle');

  return (
    <div className={cls} {...rest}>
      {title && (
        <div className={classNames(styles.label, 'metaTheme')}>
          <span>{title}</span>
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default StandardFormRow;
