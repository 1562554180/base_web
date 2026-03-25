import React, { Component } from 'react'
import PropTypes from 'prop-types'
import config from 'utils/config';

class AudioSpectrum extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playStatus: '',
    };
    this.resetStatus(props);
    this.initUI(props);
  }

  resetStatus(props) {
    this.canvasId = props.id || this.getRandomId(50);
    this.animationId = null
    this.audioContext = null
    this.audioEle = null
    this.audioCanvas = null
    this.playStatus = null
  }

  initUI = (props) => {
    const o = document.getElementById(this.canvasId);

    if (props) {
      this.clearTimer();
    }
    if (!o) {
      this.timer = setTimeout(this.initUI, config.timerInterval_5);
      return;
    }
    this.prepareAPIs()
    this.prepareElements()
    // const analyser = this.setupAudioNode(this.audioEle)
    // this.initAudioEvents(analyser)
  }

  componentWillReceiveProps(nextProps) {
    this.resetStatus(nextProps);
    this.initUI(nextProps);
    this.setState({playStatus: ''});
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = false;
    }
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  getRandomId(len) {
    const str = '1234567890-qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    const strLen = str.length
    let res = ''
    for (let i = 0; i < len; i++) {
      const randomIndex = Math.floor((Math.random() * strLen))
      res += str[randomIndex]
    }
    return res
  }

  componentDidMount() {
    this.prepareAPIs()
    this.prepareElements()
    const analyser = this.setupAudioNode(this.audioEle)
    this.initAudioEvents(analyser)
  }

  initAudioEvents = (analyser) => {
    const audioEle = this.audioEle
    audioEle.onpause = () => {
      this.playStatus = 'PAUSED'
      this.setState({
        playStatus: 'PAUSED',
      })
    }
    audioEle.onplay = () => {
      this.playStatus = 'PLAYING'
      this.drawSpectrum(analyser)
      this.setState({
        playStatus: 'PLAYING',
      })
    }
  }

  drawSpectrum = (analyser) => {
    const cwidth = this.audioCanvas.width
    const cheight = this.audioCanvas.height - this.props.capHeight
    const capYPositionArray = [] // store the vertical position of hte caps for the preivous frame
    const ctx = this.audioCanvas.getContext('2d')
    let gradient = ctx.createLinearGradient(0, 0, 0, 300)

    if (this.props.meterColor.constructor === Array) {
      const stops = this.props.meterColor
      const len = stops.length
      for (let i = 0; i < len; i++) {
        gradient.addColorStop(stops[i].stop, stops[i].color)
      }
    } else if (typeof this.props.meterColor === 'string') {
      gradient = this.props.meterColor
    }

    const drawMeter = () => {
      const array = new Uint8Array(analyser.frequencyBinCount); // item value of array: 0 - 255
      if(analyser.getByteFrequencyData) {
        analyser.getByteFrequencyData(array);
      }
      if (this.playStatus === 'PAUSED') {
        for (let i = array.length - 1; i >= 0; i--) {
          array[i] = 0
        }
        const allCapsReachBottom = !capYPositionArray.some(cap => cap > 0)
        if (allCapsReachBottom) {
          ctx.clearRect(0, 0, cwidth, cheight + this.props.capHeight)
          cancelAnimationFrame(this.animationId) // since the sound is top and animation finished, stop the requestAnimation to prevent potential memory leak,THIS IS VERY IMPORTANT!
          return
        }
      }
      const step = Math.round(array.length / this.props.meterCount) // sample limited data from the total array
      ctx.clearRect(0, 0, cwidth, cheight + this.props.capHeight)
      for (let i = 0; i < this.props.meterCount; i++) {
        const value = array[i * step]
        if (capYPositionArray.length < Math.round(this.props.meterCount)) {
          capYPositionArray.push(value)
        };
        ctx.fillStyle = this.props.capColor
        // draw the cap, with transition effect
        if (value < capYPositionArray[i]) {
          // let y = cheight - (--capYPositionArray[i])
          const preValue = --capYPositionArray[i]
          const y = (270 - preValue) * cheight / 270
          ctx.fillRect(i * (this.props.meterWidth + this.props.gap), y, this.props.meterWidth, this.props.capHeight)
        } else {
          // let y = cheight - value
          const y = (270 - value) * cheight / 270
          ctx.fillRect(i * (this.props.meterWidth + this.props.gap), y, this.props.meterWidth, this.props.capHeight)
          capYPositionArray[i] = value
        };
        ctx.fillStyle = gradient; // set the filllStyle to gradient for a better look

        // let y = cheight - value + this.props.capHeight
        const y = (270 - value) * (cheight) / 270 + this.props.capHeight
        ctx.fillRect(i * (this.props.meterWidth + this.props.gap), y, this.props.meterWidth, cheight) // the meter
      }
      this.animationId = requestAnimationFrame(drawMeter)
    }
    this.animationId = requestAnimationFrame(drawMeter)
  }

  setupAudioNode = (audioEle) => {
    if(!this.audioContext) return false;
    const analyser = this.audioContext.createAnalyser()
    analyser.smoothingTimeConstant = 0.8
    analyser.fftSize = 2048

    const mediaEleSource = this.audioContext.createMediaElementSource(audioEle)
    mediaEleSource.connect(analyser)
    mediaEleSource.connect(this.audioContext.destination);

    return analyser
  }

  prepareElements = () => {
    this.audioEle = document.getElementById(this.props.audioId)
    this.audioCanvas = document.getElementById(this.canvasId)
  }

  prepareAPIs = () => {
    // fix browser vender for AudioContext and requestAnimationFrame
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
    try {
      this.audioContext = new window.AudioContext(); // 1.set audioContext
    } catch (e) {
      // console.error('!Your browser does not support AudioContext')
      console.log(e);
    }
  }
  
  render() {
    const { playStatus } = this.state;
    const { style={}, backgroundImage, backgroundImage2 } = this.props;
    const backgroundImageShow = playStatus !== 'PLAYING';
    return (
      <canvas id={this.canvasId} style={{...style, backgroundImage: backgroundImageShow ? backgroundImage : backgroundImage2}} />
    )
  }
}

AudioSpectrum.propTypes = {
  audioId: PropTypes.string.isRequired,
  capColor: PropTypes.string,
  capHeight: PropTypes.number,
  meterWidth: PropTypes.number,
  meterCount: PropTypes.number,
  meterColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.shape({
      stop: PropTypes.number,
      color: PropTypes.string,
    })),
  ]),
  gap: PropTypes.number,
}
AudioSpectrum.defaultProps = {
  capColor: '#FFF',
  capHeight: 2,
  meterWidth: 2,
  meterCount: 40 * (2 + 2),
  meterColor: [
    {stop: 0, color: '#f00'},
    {stop: 0.5, color: '#0CD7FD'},
    {stop: 1, color: 'red'},
  ],
  gap: 10, // gap between meters
}
export default AudioSpectrum
