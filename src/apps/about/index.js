import React, { PureComponent } from 'react';

export default class HomeIndex extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return <div style={{ height: 'calc(100vh - 65px)', position: 'relative', overflowX: 'hidden' }} />;
	}
}
