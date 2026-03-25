import React, { Component } from 'react/index.js';
import { Form } from '@ant-design/compatible';
import { connect } from 'dva';
import {Button, Card, message} from 'antd';
import FromItemCreator from 'components/FromItemCreator';
import CustomForm from 'components/CustomForm';
import Icon from 'components/Icon';
import EditHeader from 'common/EditHeader'
import {initFormItems } from 'common/utils';
import _ from 'lodash';
import './index.less'

const modeList = [
  {
    label: '112Mbandpass+固定增益',
    value: 0,
  },
  {
    label: '1倍bandpass+固定增益',
    value: 1,
  },
  {
    label: '手动bandpass+固定增益',
    value: 2,
  },
  {
    label: '1倍bandpass+自动增益',
    value: 3,
  },
  {
    label: '2倍bandpass+自动增益',
    value: 4,
  },
]
const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
@Form.create()
@connect(({ global}) => {
  return {
    global,
  }
})
export default class DvbCondition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formConfig: [ 
        {
          label: '增益控制',
          field_name: 'filter_mode',
          placeholder: '增益控制模式(dB)',
          type: 'select',
          options:[
            {
              label: '112Mbandpass+固定增益',
              value: 0,
            },
            {
              label: '1倍bandpass+固定增益',
              value: 1,
            },
            {
              label: '手动bandpass+固定增益',
              value: 2,
            },
            {
              label: '1倍bandpass+自动增益',
              value: 3,
            },
            {
              label: '2倍bandpass+自动增益',
              value: 4,
            },
          ],
          rules: [
            { required: true },
          ],
          disabled:false,
          value:null,
        },
        {
          label: '增益(dB)',
          field_name: 'filter_gain_dB',
          placeholder: '增益(dB)',
          type: 'input',
          rules: [
            { required: true },
          ],
          disabled:false,
          value:null,
        },
        
      ],
    }
  }
  
  componentDidMount() {
    const { formConfig }=this.state
    const dvbguardFilterInfo = this.props.global.dvbguardFilterInfo
    const uform = _.cloneDeep(formConfig)
    if (formConfig.some(item=>item.field_name==='filter_gain_dB') && !_.isEmpty(dvbguardFilterInfo)&&!_.isUndefined(dvbguardFilterInfo)) {
      uform[1].value = dvbguardFilterInfo?.filter_gain || '',
      uform[0].value=modeList.find(item=>item.value===dvbguardFilterInfo?.filter_mode)?.label
      this.setState({ formConfig: uform,filterMode:dvbguardFilterInfo?.filter_mode,filterGainDB:dvbguardFilterInfo?.filter_gain,gainDb:dvbguardFilterInfo?.filter_gain})
    }
  }


  updateState = (v, field) => {
    const { formConfig } = this.state
    const dvbguardFilterInfo = this.props.global.dvbguardFilterInfo
    const uForm = _.cloneDeep(formConfig)
    if (field === 'filter_mode') {
      if ((v===3||v===4) && uForm[uForm.length - 1].field_name === 'filter_gain_dB'){
        uForm.pop()
        this.setState({ formConfig: uForm })
      }
      if ((v===0 || v===1 || v===2) && !uForm.some(item => item.field_name === 'filter_gain_dB')) {
        uForm.push({
          label: '增益(dB)',
          field_name: 'filter_gain_dB',
          placeholder: '增益(dB)',
          type: 'input',
          rules: [
            { required: true },
          ],
          disabled: false,
          value: dvbguardFilterInfo?.filter_gain || '',
        })
      }
        this.setState({ formConfig: uForm, filterMode: v })
    }
    if (field === 'filter_gain_dB') {
      this.setState({ gainDb: v.target.value })
    }
  }

  remove = (valueWithUnit) => {
    return valueWithUnit.replace('dB', '').trim()
  }

  saveSetDvb = () => {
    const isAutoArr = [3,4]
    const { filterMode,gainDb } = this.state
    const dvbguardFilterInfo = this.props.global.dvbguardFilterInfo
    const { onCloseDia, freqInfoWs } = this.props
    const returnCommand = () => {
      if (filterMode === dvbguardFilterInfo.filter_mode) {
        return 'set_dvbguard_filter_gain'
      } else {
        return 'set_dvbguard_filter_param'
      }
    }
    const send = {
      filter_mode: filterMode,
      filter_gain_dB: parseInt(this.remove(gainDb || '')),
      Command: returnCommand(),
    };
    if (_.isUndefined(filterMode)) {
      message.error('增益控制不可为空')
    } else if (!isAutoArr.includes(filterMode) && !gainDb) {
      message.error('请填写完内容后再提交')
    } else {
      freqInfoWs.onSendWsMessage(JSON.stringify(send));
      setTimeout(() => {
        onCloseDia()
      }, 200)
    }
  }

  updateNowDvbFields = (list) => {
    const obj = initFormItems(list);
    this.setState({ nowDvbConfig: obj.items })
  }

  render() {
    const { formConfig=[],nowDvbConfig} = this.state
    const {form}=this.props
    const dvbguardFilterInfo = _.cloneDeepWith(this.props.global.dvbguardFilterInfo)||{}
    dvbguardFilterInfo.filter_mode=modeList.find(item=>item.value===this.props.global.dvbguardFilterInfo.filter_mode)?.label
    return (
      <>
        <Card
          title='DVB板卡设置'
          style={{ marginBottom: '10px' }}
        > 
          {formConfig?.map(item => {
          return <FromItemCreator key={item.field_name} item={{ ...item, formItemLayout, props: {onChange: (v) => this.updateState(v, item.field_name)}}} form={form} />
        })} 
          <div style={{marginTop:'10px',marginBottom:'15px',marginLeft:'20px'}}>
            <Button type='primary' onClick={this.saveSetDvb}>保存</Button>
          </div>
        </Card>
        <Card
          title='当前设置'
          extra={
            <div>
              <EditHeader columnsType='formItem' updateHeaders={this.updateNowDvbFields} title={<Icon type='setting' title='DVB调理显示设置' />} modalTitle='DVB调理参数配置' type='now_dvb_use' style={{ display: this.props.isSuperAdministrator ? 'inline-block' : 'none' }} />
            </div>
          }
        >
          <CustomForm
            parent={this}
            contentWidth={342}
            config={{ value: 'key', label: 'value' }}
            items={nowDvbConfig}
            values={dvbguardFilterInfo||{}}
            disabled
          />
        </Card>
      </>
    )
  }
}