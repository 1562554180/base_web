import React, { Component } from 'react';
import { Button } from 'antd';

class ThumbnailButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
    };
  }

  mouseOut = () => {
    this.setState({
      expand: false,
    })
  }

  mouseOver = () => {
    this.setState({
      expand: true,
    })
  }

  render() {
    const { text, ...btnProps } = this.props;
    const { expand } = this.state;

    return (
      <Button onMouseOver={this.mouseOver} onFocus={this.mouseOver} onMouseLeave={this.mouseOut} {...btnProps}>
        {expand && text}
      </Button>
    );
  }
}

export default ThumbnailButton;
