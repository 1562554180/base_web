import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './index.less';

export default class CustomRadioButton extends Component { 
  constructor(props) {
    super(props)
    this.state={
      selected: props.value,
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.value !== nextProps.value) {
      this.setState({
        selected: nextProps.value,
      })
    }
  }

  onClick = (value) => {
    this.setState({
      selected: value,
    }, () => {
      if(this.props.onChange) {
        this.props.onChange(value)
      }
    })
  }

  render() {
    const { selected } = this.state;
    const { items, style } = this.props;
    if(!items || items.length === 0) return null;
    return (
      <div style={style || {}}>
        {
          items.map((item, idx) => {
            const obj = {};
            if(idx === 0) {
              obj.borderRadius = '4px 0 0 4px'
            }
            if(idx === items.length - 1) {
              obj.borderRadius = '0 4px 4px 0'
            }
            return (<span style={obj} onClick={() => this.onClick(item.value)} className={classNames(styles.item, selected === item.value ? 'customRadioActiveTheme' : 'customRadioTheme')}>{item.label}</span>)

          })
        }
      </div>
    )
  }
}
