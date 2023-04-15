import React, { Component } from "react";
import { findDOMNode } from "react-dom";

class RutubePlayer extends Component {
  state = {
    playedSeconds: 0,
    duration: 0,
  }

  playerPlay() {
    this.player.contentWindow.postMessage(JSON.stringify({
      type: 'player:play',
      data: {}
    }), '*');
  }

  playerPause() {
    this.player.contentWindow.postMessage(JSON.stringify({
      type: 'player:pause',
      data: {}
    }), '*');
  }

  playerPlayPause() {
    const type_ = this.props.playing ? 'player:play' : 'player:pause'
    this.player.contentWindow.postMessage(JSON.stringify({
        type: type_,
        data: {}
    }), '*');
  }

  playerVolume(value){
    this.player.contentWindow.postMessage(
      JSON.stringify({
        type: "player:setVolume",
        data: { volume: value },
      }), "*");
  }

  playerMute(value){
    this.player.contentWindow.postMessage(
      JSON.stringify({
        type: "player:mute",
      }), "*");
  }

  playerUnMute(value){
    this.player.contentWindow.postMessage(
      JSON.stringify({
        type: "player:unMute",
      }), "*");
  }

  parsePlayerMessages(event) {
    const data = event.data;
    const message = typeof(data) === 'string' ? JSON.parse(data) : data // От Рутуб плеера data - строка с JSON, а от Реакта уже объект
    switch (message.type) {
      case "player:ready": // Плеер загрузился и готов к работе
        const messageReady = message.data;
        console.log(">> Ready:", messageReady, );
        this.playerMute()
        break;
      case "player:durationChange": // Длительность текущего видео
        const dur = message.data.duration;
        this.setState({ duration: dur });
        this.props.onDuration(dur);
        this.playerPlay()
        this.playerUnMute()
        this.playerVolume(this.props.volume)
        break;
      case "player:currentTime": // Текущее время
        const playedSeconds = message.data.time;
        const played = playedSeconds / this.state.duration;
        this.setState({ playedSeconds: playedSeconds });
        this.props.onProgress({ playedSeconds: playedSeconds, played: played });
        break;
      case "player:changeState": // Текущее время
        if(message.data.state === 'paused') {
          this.props.onPause();
        }else if(message.data.state === 'playing'){
          this.props.onPlay();
        }
        break;
    }
  }

  getCurrentTime() {
    return this.state.playedSeconds;
  }

  seekTo = (seconds) => {
    this.player.contentWindow.postMessage(
      JSON.stringify({
        type: "player:setCurrentTime",
        data: { time: seconds },
      }),
      "*"
    );
  };

  ref = player => {
    this.player = player;
    console.log('>> ', player)
  }
  componentDidMount() {
    console.log('>> rutube is mounted')
    window.addEventListener("message", this.parsePlayerMessages.bind(this));
  }

  componentDidUpdate(prevProps) {
    if (this.props.volume !== prevProps.volume) {
      this.playerVolume(this.props.volume)
    }
    if (this.props.playing !== prevProps.playing) {
      this.playerPlayPause()
    }
  }

  componentWillUnmount() {
    console.log('>> Rutube unmount')
    window.removeEventListener("message", this.parsePlayerMessages);
  }

  render() {
    const rutubeId = this.props.url.replace(/\/$/, "").split("/").pop();
    const src = `https://rutube.ru/play/embed/${rutubeId}`;
    return (
      <div style={{ position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%' }}>
      <iframe
        ref={this.ref}
        src={src}
        width={this.props.width}
        height={this.props.height}
        title='rutube-player'
        id='rutube-player-iframe'
        allow='clipboard-write; autoplay'
        webkitallowfullscreen={'true'}
        mozallowfullscreen={'true'}
        allowFullScreen={true}
      ></iframe>
      </div>
    );
  }
}

export default RutubePlayer;

/*

<iframe width="720" height="405" src="https://rutube.ru/play/embed/8bbd80ed8329ff206ffd4a34db8177a7" frameBorder="0" allow="clipboard-write; autoplay" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
*/