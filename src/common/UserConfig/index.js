/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import AutoSizeDialog from 'components/Dialog';
import { Form } from '@ant-design/compatible';
import { Radio } from 'antd';
import { ThemeContext } from '@/config';


@Form.create()
export default class UserConfig extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      selectedTheme: 'dark',
    };
    this.pageTitle = '偏好设置';
  }

  componentDidMount() {
    // 从 context 获取当前主题
    if (this.context?.themeName) {
      this.setState({ selectedTheme: this.context.themeName });
    }
  }

  componentDidUpdate(prevProps) {
    // 弹窗打开时同步主题状态
    if (this.props.modalVisible && !prevProps.modalVisible) {
      if (this.context?.themeName) {
        this.setSelectedTheme(this.context.themeName)
      }
    }
  }

  setSelectedTheme = (v) => {
    this.setState({ selectedTheme: v });
  }

  onOk = () => {
    const { selectedTheme } = this.state;
    const { handleModalVisible } = this.props;

    // 使用 context 的 setTheme 方法立即切换主题
    if (this.context?.setTheme && selectedTheme !== this.context.themeName) {
      this.context.setTheme(selectedTheme);
    }

    handleModalVisible(false);
  };

  handleThemeChange = (e) => {
    this.setState({ selectedTheme: e.target.value });
  };

  handleRenderContent = () => {
    const { selectedTheme } = this.state;
    const themeOptions = [
      { label: '蓝色深色', value: 'dark' },
      { label: '白色浅色', value: 'light' },
      { label: '科技黑', value: 'techBlack' },
    ];

    return (
      <div className="userConfig" style={{ padding: '20px 0' }}>
        <div style={{ marginBottom: 8, color: 'var(--ant-color-text)' }}>主题风格</div>
        <Radio.Group
          value={selectedTheme}
          onChange={this.handleThemeChange}
          optionType="button"
          buttonStyle="solid"
        >
          {themeOptions.map(item => (
            <Radio.Button key={item.value} value={item.value}>{item.label}</Radio.Button>
          ))}
        </Radio.Group>
      </div>
    );
  }

  render() {
    const { modalVisible, handleModalVisible } = this.props;

    return (
      <AutoSizeDialog
        title={this.pageTitle}
        visible={modalVisible}
        maxWidth={400}
        maxHeight={200}
        style={{ marginTop: 65 }}
        closable
        onOk={this.onOk}
        onCancel={() => handleModalVisible(false)}
      >
        {this.handleRenderContent()}
      </AutoSizeDialog>
    );
  }
}
