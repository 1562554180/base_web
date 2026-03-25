import React, { Component } from 'react';
import { Resizable } from 'react-resizable';
import _ from 'lodash';
import { connect } from 'dva';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sass";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/mode-css";
import beautify from 'js-beautify';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Select, Button } from "antd";
import { colorObj } from 'common/colors';
import { objToStrValue } from 'utils/utils';
import styles from './index.less';

const cssBeautify = beautify.css;
const jsBeautify = beautify.js;
const htmlBeautify = beautify.html;

const jsOption =
{
    "indent_size": 4,
    "indent_char": " ",
    "indent_with_tabs": false,
    "editorconfig": false,
    "end_with_newline": false,
    "indent_level": 0,
    "preserve_newlines": true,
    "max_preserve_newlines": 10,
    "space_in_paren": false,
    "space_in_empty_paren": false,
    "jslint_happy": false,
    "space_after_anon_function": false,
    "space_after_named_function": false,
    "brace_style": "collapse",
    "unindent_chained_methods": false,
    "break_chained_methods": false,
    "keep_array_indentation": false,
    "unescape_strings": false,
    "wrap_line_length": 0,
    "e4x": false,
    "comma_first": false,
    "operator_position": "before-newline",
    "indent_empty_lines": false,
    "templating": ["auto"],
}

const formatOptions = {
  javascript: {fn: jsBeautify, option: jsOption},
  css: {fn: cssBeautify, option: {indent_size: 2}},
  html: {fn: htmlBeautify, option: {indent_size: 2, end_with_newline: true}},
  xml: {fn: htmlBeautify, option: {indent_size: 2, end_with_newline: true}},
  python: {fn: jsBeautify, option: jsOption},
  php: {fn: jsBeautify, option: jsOption},
  json: {fn: jsBeautify, option: jsOption},
}


const Option = Select.Option;
const modes = [
  {type: 'javascript', label: 'javascript'},
  {type: 'html', label: 'html'},
  {type: 'xml', label: 'xml'},
  {type: 'java', label: 'java'},
  {type: 'python', label: 'python'},
  {type: 'sass', label: 'sass'},
  {type: 'mysql', label: 'mysql'},
  {type: 'json', label: 'json'},
  {type: 'text', label: 'text'},
  {type: 'css', label: 'css'},
]

const themes = [
  {type: 'tomorrow_night_blue', label: 'night_blue'},
  {type: 'monokai', label: 'monokai'},
  {type: 'github', label: 'github'},
  {type: 'tomorrow', label: 'tomorrow'},
  {type: 'kuroir', label: 'kuroir'},
  {type: 'twilight', label: 'twilight'},
  {type: 'xcode', label: 'xcode'},
  {type: 'textmate', label: 'textmate'},
  {type: 'solarized_dark', label: 'solarized dark'},
  {type: 'solarized_light', label: 'solarized light'},
  {type: 'terminal', label: 'terminal'},
]

@connect(({ main }) => ({
  selectedTheme: main.selectedTheme,
}))

export default class BeautifyFiles extends Component {
  constructor(props){
    super(props);
    const state = this.initState(props, {})
    this.state = {
      ...this.initTheme(props),
      ...state,
    };
    this.editor = {};
  }

  updateMode = (e) => {
    const { value, readOnly } = this.props;
    let strValue = objToStrValue(value);
    const formatOption = formatOptions[e];
    if(formatOption) {
      strValue = formatOption.fn(strValue, formatOption.option)
    }
    const state = {
      mode: e,
    };
    if(readOnly) {
      state.editValue = strValue;
    }
    this.setState(state)
  }

  renderModesBar = () => {
    const { mode } = this.state;
    return (
      (<Select size='small' popupClassName={styles.timeOptionStyle} style={{width: 120}} value={mode} onChange={this.updateMode}>
        {modes.map(item => {
          return <Option key={item.type} value={item.type}>{item.label.toLocaleUpperCase()}</Option>
        })}
      </Select>)
    );
  }

  renderThemesBar = () => {
    const { theme } = this.state;
    return (
      (<Select size='small' popupClassName={styles.timeOptionStyle} style={{width: 150}} value={theme} onChange={(e) => this.setState({theme: e})}>
        {themes.map(item => {
          return <Option value={item.type} key={item.type}>{item.label.toLocaleUpperCase()}</Option>
        })}
      </Select>)
    );
  }

  onChange = (e) => {
    const { name } = this.props;
    if (this.props.onChange){
      this.props.onChange(e)
    }
    if (this.editor[name]) {
      this.handleCompleterChange(this.editor[name], [], e);
    }
  }

  onResize = (e, { size }) => {
    this.setState({
      height: size.height,
      width: size.width,
    })
  }

  initState = (props, state) => {
    const { mode, value, style = {} } = props;
    const newState = {mode: mode || 'html', theme: 'tomorrow_night_blue'};
    const formatOption = formatOptions[mode];
    const strValue = objToStrValue(value);
    if(formatOption) {
      newState.editValue = formatOption.fn(strValue, formatOption.option)
    } else {
      newState.editValue = strValue;
    }
    if(!state.width && !state.height) {
      newState.width = style.width || 500;
      newState.height = style.height || 400;
    }

    return newState;
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props.completers, nextProps.completers)) {
      const { name, completers = [] } = nextProps;
      if (this.editor[name]) {
        if (completers.length) {
          this.handleCompleterChange(this.editor[name], completers);
        }
      }
    }

    if(this.props.value !== nextProps.value) {
      const newState = this.initState(nextProps, this.state);
      this.setState(newState)
    }

    if(this.props.width !== nextProps.width || this.props.height !== nextProps.heigth || !_.isEqual(this.props.style, nextProps.style)) {
      const newState = this.initStyle(nextProps, this.state);
      this.setState(newState)
    }

    if (this.props.selectedTheme !== nextProps.selectedTheme) {
      const state = this.initTheme(nextProps);
      this.setState(state)
    }
  }

  initStyle = (props) => {
    const {style = {} } = props;
    const newState = {};
    newState.width = props.width || style.width || 500;
    newState.height = props.height || style.height || 400;
    return newState;
  }

  initTheme = (props) => {
    const { selectedTheme } = props;
    const state = colorObj.httpBeautify[selectedTheme ||'default'];
    return state;
  }

  onLoad = editor => {
    const { name, completers = [], updateHeight } = this.props;
    const length = editor.session.doc.$lines.length;
    if (updateHeight) updateHeight(length * 14 + 14)
    if (name && !this.editor[name]) {
      this.editor[name] = editor;
      if (completers.length) {
        this.handleCompleterChange(this.editor[name], completers);
      }
    }
  }

  handleCompleterChange = (editor, completers = []) => {
    if (editor) {
      editor.completers.push({
        getCompletions(aceEditor, session, pos, prefix, callback) {
          callback(null, completers);
        },
      })
    }
  }

  updateHeight = (type) => {
    const { height } = this.state;
    this.setState({height: type === 'add' ? height + 30 : height - 30})
  }

  createSelectBars = () => {
    const { width, height } = this.state;
    const { hideSelectBars, title, barStyle } = this.props;
    if(hideSelectBars) return null;
    return (
      <div style={{padding: '5px 0', display: 'flex', width, justifyContent: 'space-between', ...barStyle}}>
        {title && <div>{title}</div>}
        <div>
          {this.renderModesBar()}
          <Button size='small' style={{margin: '0px 10px'}} disabled={height <= 200} onClick={() => this.updateHeight('minus')} icon={<MinusOutlined />} />
          <Button size='small' onClick={() => this.updateHeight('add')} icon={<PlusOutlined />} />
        </div>
      </div>
    );
  }

  render() {
    const { name, commands, readOnly } = this.props;
    const { width, height, editValue, themeType, mode } = this.state;
    return (
      <div className={styles.aceEditor}>
        {this.createSelectBars()}
        <Resizable width={width} height={height} onResize={this.onResize}>
          <div style={{width, height}}>
            <AceEditor
              mode={mode}
              theme={themeType}
              name={name || 'UNIQUE_ID_OF_DIV'}
              onLoad={this.onLoad}
              onChange={this.onChange}
              fontSize={12}
              readOnly={readOnly}
              showPrintMargin={false}
              showGutter
              highlightActiveLine
              wrapEnabled={false}
              commands={commands}
              value={editValue}
              width={`${width}px`}
              height={`${height}px`}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
              editorProps={{
                $blockScrolling: true,
              }}
            />
          </div>
        </Resizable>
      </div>
    );
  }
}
