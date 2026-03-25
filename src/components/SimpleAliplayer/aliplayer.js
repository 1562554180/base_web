import React, { Component } from "react";

export default class Aliplayer extends Component {
  state = {
    // 播放地址
    source: '',
    // 视频高度 
    height: '',
    // 是否自动播放 
    autoplay: false,
    // 是否直播流 
    isLive: false,
    // 是否循环播放 
    rePlay: false,
    // 播放在线视频 
    playsinline: true,
    // 是否预加载 
    preload: true,
    // 播放模式 h5 还可以选择flash播放 
    useH5Prism: true
  };

  componentDidMount() {
    const { source, height, autoplay, isLive, rePlay, playsinline, preload, useH5Prism, width } = this.props;
    // 初始化播放器 每次必须初始化才可以播放
    const player = new window.Aliplayer({
      "id": 'player-con',
      "source": source,
      "width": "100%",
      "height": height,
      "autoplay": autoplay,
      "isLive": isLive,
      "rePlay": rePlay,
      "playsinline": playsinline,
      "preload": preload,
      "controlBarVisibility": "hover",
      "useH5Prism": useH5Prism,
      "skinLayout": [
        {name: 'errorDisplay', align: 'tlabs', x: 0, y: 0},
        {name: 'infoDisplay', align: 'cc'},
        {
          name: 'controlBar', align: 'blabs', x: 0, y: 0,
          children: [
            {name: "progress", align: "blabs", x: 0, y: 44},
            {name: "playButton", align: "tl", x: 15, y: 12},
            {name: "timeDisplay", align: "tl", x: 10, y: 7},
            {name: "fullScreenButton", align: "tr", x: 10, y: 12},
            {name:"subtitle", align:"tr",x:15, y:12},
            {name:"setting", align:"tr",x:15, y:12},
            {name: "volume", align: "tr", x: 5, y: 10},
          ],
        },
      ],
    }, (p) => {
      p._switchLevel = 0;
    });
  }

  render() {
    return (
      <div className="prism-player" id="player-con" />
    );
  }
}