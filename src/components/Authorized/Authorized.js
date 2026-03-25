import React from 'react';
import { connect } from 'dva';
import CheckPermissions from './CheckPermissions';

@connect(({ main }) => ({
  settings: main.settings,
}))
class Authorized extends React.Component {
  render() {
    const { children, settings, noMatch = null } = this.props;
    const childrenRender = typeof children === 'undefined' ? null : children;
    return CheckPermissions(settings ? settings.acls : null, childrenRender, noMatch);
  }
}

export default Authorized;
