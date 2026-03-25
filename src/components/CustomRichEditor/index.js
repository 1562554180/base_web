import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import _ from 'lodash';
import config from 'utils/config';
import Modal from 'utils/modal';
import { Upload, Button, message } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import ImageResize from 'quill-image-resize-module-react';
import { getUploadFaultLogImgUrl } from 'requests/witData';
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";
import styles from './index.less';

Quill.register('modules/imageResize', ImageResize);

export default class CustomEditor extends Component {
  constructor(props) {
    super(props);
    this.state= {
      content: props.data || '',
      theme: 'snow',
      uploadBoxVisible: false,
      currentImgList: [],
      customModules: {
        toolbar: {
          container: [
            // [{ header: '1' }, { header: '2' }, { font: [] }],
            // [{ size: ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' },
            ],
            // [{ 'script': 'sub' }, { 'script': 'super' }],
            // [{ 'direction': 'rtl' }],
            // ['link', 'image', 'video'],
            ['image'],
            // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['clean'],
          ],
          handlers: {
            'image': this.shouldUploadBox.bind(this),
          },
        },
        clipboard: {
          // toggle to add extra line breaks when pasting HTML:
          matchVisual: false,
        },
        imageResize: {
          parchment: Quill.import('parchment'),
          modules: ['Resize', 'DisplaySize'],
        },
      },
      customFormat: [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
      ],
    }
    this.handleChangeValue=this.handleChangeValue.bind(this);
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.data, nextProps.data)) {
      this.setState({
        content: nextProps.data,
      })
    }
    if (!_.isEqual(this.props.imgList, nextProps.imgList)) {
      this.setState({
        currentImgList: nextProps.imgList,
      })
    }
  }

  handleChangeValue = (htmlContent) => {
    this.setState({
      content: htmlContent,
    })
  }

  shouldUploadBox = () => {
    this.setState({
      uploadBoxVisible: true,
    })
  }

  beforeUpload = (info) => {
    let isFileSize = true;
    const size = info.size / 1024 * 1024;
    if (size > (1024 * 1024 * 100)) {
      isFileSize = false;
    }
    if (!isFileSize) {
      message.warning('图片大小不能超过100MB')
    }
    return isFileSize;
  }

  upload = (info) => {
    const { currentImgList = [] } = this.state;
    if(info.file && !_.isEmpty(info.file.response) && !_.isEmpty(info.file.response.data) && info.file.status === 'done') {

      const newImgList = _.cloneDeep(currentImgList);
      const fileData = info.file.response.data || [];
      if (config.richEditorUploadImgUrl) {
        const fileUrl = `http://${config.richEditorUploadImgUrl}/${fileData[fileData.length - 1]}`;
        newImgList.push(fileData[fileData.length - 1]);
        const quill = this.reactQuillRef.getEditor();
        const cursorPosition = quill.getSelection() ? quill.getSelection().index : 0;
        quill.insertEmbed(cursorPosition, "image", fileUrl);
        quill.setSelection(cursorPosition + 1);
      }
      this.setState({
        uploadBoxVisible: false,
        currentImgList: newImgList,
      })
    }
  }

  handleRenderUploadModal = () => {
    const { uploadBoxVisible } = this.state;
    const uploadProps = {
      name: 'rich_editor_img',
      action: getUploadFaultLogImgUrl(),
      onChange: (info) => this.upload(info),
      beforeUpload: (info) => this.beforeUpload(info),
      showUploadList: false,
      accept:'.png,.jpg,.bmp,.jpeg,.pjp,.pjpeg,.jfif,.ico',
    };
    return (
      (<Modal
        title='上传图片'
        open={uploadBoxVisible}
        closable
        footer={null}
        onCancel={() => this.handleUploadBoxVisible(false)}
        bodyStyle={{height:100, textAlign: 'center'}}
      >
        <Upload {...uploadProps} style={{ cursor: 'pointer'}}>
          <Button icon={<FileAddOutlined />} style={{marginLeft: 8}}>文件上传</Button>
        </Upload>
      </Modal>)
    );
  }

  handleUploadBoxVisible = (visible) => {
    this.setState({
      uploadBoxVisible: visible,
    })
  }

  render() {
    const { width, maxHeight, margin } = this.props;
    const { content, theme, customModules, customFormat, uploadBoxVisible } = this.state;
    return (
      <div className={styles.richEditorBox} style={{ width: width || '100%', maxHeight: maxHeight || window.innerHeight - 200, margin: margin || '0px 0px 0px 0px' }}>
        <ReactQuill
          ref={(el) => { this.reactQuillRef = el }}
          theme={theme}
          value={content}
          modules={customModules}
          formats={customFormat}
          onChange={this.handleChangeValue}
        />
        {
          uploadBoxVisible && this.handleRenderUploadModal()
        }
      </div>
    )
  }
}
