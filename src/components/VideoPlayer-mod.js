import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { hot } from 'react-hot-loader'
import ReactPlayer from "react-player";
import Duration from './Duration'
import screenfull from 'screenfull'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import NoteMark from "./NoteMark";
import { Box, Slider, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';

class VideoPlayer extends Component {
    state = {
        url: this.props.url,
        pip: false,
        playing: true,
        controls: false,
        light: false,
        volume: 0.75,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false,
        notesOnSlider: this.props.notesOnSlider,
    };

    load = url => {
        this.setState({
            url,
            played: 0,
            loaded: 0,
            pip: false
        })
    }

    handlePlayPause = () => {
        this.setState({ playing: !this.state.playing })
    }

    handleStop = () => {
        this.setState({ url: null, playing: false })
    }

    handleToggleControls = () => {
        const url = this.state.url
        this.setState({
            controls: !this.state.controls,
            url: null
        }, () => this.load(url))
    }

    handleToggleLight = () => {
        this.setState({ light: !this.state.light })
    }

    handleToggleLoop = () => {
        this.setState({ loop: !this.state.loop })
    }

    handleVolumeChangeOld = e => {
        this.setState({ volume: parseFloat(e.target.value) })
    }

    handleVolumeChange = (e, value) => {
        this.setState({ volume: value })
        // this.player.changeVolume(value)
    }

    handleToggleMuted = () => {
        this.setState({ muted: !this.state.muted })
    }

    handleSetPlaybackRateOld = e => {
        this.setState({ playbackRate: parseFloat(e.target.value) })
    }

    handleSetPlaybackRate = (e, value) => this.setState({ playbackRate: value })

    handleOnPlaybackRateChange = (speed) => this.setState({ playbackRate: parseFloat(speed) })

    handlePlay = () => {
        console.log('onPlay')
        this.setState({ playing: true })
    }

    handleTogglePIP = () => {
        this.setState({ pip: !this.state.pip })
    }

    handleEnablePIP = () => {
        console.log('onEnablePIP')
        this.setState({ pip: true })
    }

    handleDisablePIP = () => {
        console.log('onDisablePIP')
        this.setState({ pip: false })
    }

    handlePause = () => {
        console.log('onPause')
        this.setState({ playing: false })
    }

    handleSeekMouseDownOld = e => {
        this.setState({ seeking: true })
    }
    handleSeekMouseDown = (e) => {
        this.setState({ seeking: true })
    }

    handleSeekChangeOld = e => {
        const played = parseFloat(e.target.value)
        this.setState({ played: played })
        this.props.setCurrentTime(played * this.state.duration)
    }
    
    handleSeekChange = (e, value) => {
        !this.state.seeking && this.setState({ seeking: true })
        this.setState({ played: value })
        this.props.setCurrentTime(value * this.state.duration)
    }

    handleSeekMouseUpOld = e => {
        this.setState({ seeking: false })
        this.player.seekTo(parseFloat(e.target.value))
    }
    handleSeekMouseUp = (e, value) => {
        console.log('===', value)
        this.setState({ seeking: false })
        this.player.seekTo(value)
    }

    handleProgress = state => {
        // console.log('onProgress', state)
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state)
            this.props.setCurrentTime(state.playedSeconds)
        }
    }

    handleEnded = () => {
        console.log('onEnded')
        this.setState({ playing: this.state.loop })
    }

    handleDuration = (duration) => {
        this.setState({ duration })
        this.props.durationCallback(duration)
    }

    handleClickFullscreen = () => {
        screenfull.request(findDOMNode(this.player))
    }

    renderLoadButton = (url, label) => {
        return (
            <button onClick={() => this.load(url)}>
                {label}
            </button>
        )
    }

    ref = player => {
        this.player = player
    }

    getCurrentTime = () => (Math.floor(this.player.getCurrentTime()));
    
    seekTo = (noteTime) => {
        this.player.seekTo(parseFloat(noteTime));
        this.handlePlay();
    };

    volumeLabelFormat = (value) => Math.round(value * 100)
    // timeLabelFormat = (value) => Math.round(value * this.state.duration)
    timeLabelFormat = (value) => <Duration seconds={value * this.state.duration}/>

    speedButtons = [1, 1.25, 1.5, 1.75, 2].map(x => <ToggleButton sx={{px:'10px', py:'1px'}}  key={`${x}x`} value={x}>{`${x}x`}</ToggleButton >);

    render () {
        const { url, playing, controls, light, volume, muted, loop, played, loaded, duration, playbackRate, pip, notesOnSlider } = this.state
        return (
            <div className='app'>
                <section className='section'>

                    <div style={{ position: 'relative', paddingTop: '56.25%', background: '#333' }}>
                        <ReactPlayer style={{ position: 'absolute', top: '0', left: '0' }}
                            ref={this.ref}
                            className='react-player'
                            width='100%'
                            height='100%'
                            url={url}
                            pip={pip}
                            playing={playing}
                            controls={controls}
                            light={light}
                            loop={loop}
                            playbackRate={playbackRate}
                            volume={volume}
                            muted={muted}
                            onReady={() => console.log('onReady')}
                            onStart={() => console.log('onStart')}
                            onPlay={this.handlePlay}
                            onEnablePIP={this.handleEnablePIP}
                            onDisablePIP={this.handleDisablePIP}
                            onPause={this.handlePause}
                            onBuffer={() => console.log('onBuffer')}
                            onPlaybackRateChange={this.handleOnPlaybackRateChange}
                            onSeek={e => console.log('onSeek', e)}
                            onEnded={this.handleEnded}
                            onError={e => console.log('onError', e)}
                            onProgress={this.handleProgress}
                            onDuration={this.handleDuration}
                        />
                    </div>
                    <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ width: 200 }}>
                            <Stack spacing={2} direction="row" alignItems="center">
                                <VolumeUpIcon />
                                <Slider size='small' min={0} max={1} step={0.01} value={volume} onChange={this.handleVolumeChange} valueLabelDisplay="auto" valueLabelFormat={this.volumeLabelFormat} />
                            </Stack>
                        </Box>
                        <ToggleButtonGroup color='primary' value={this.state.playbackRate} exclusive={true} onChange={this.handleSetPlaybackRate} size="small" >
                            {this.speedButtons}
                        </ToggleButtonGroup>
                        <Box sx={{ width: 200, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <FullscreenIcon sx={{ cursor: 'pointer' }} onClick={this.handleClickFullscreen} />
                        </Box>
                    </Box>

                    <div style={{ position: 'relative', top: '8px', display: 'flex', justifyContent: 'space-between' }}><Duration seconds={duration * played} /><Duration seconds={duration} /></div>
                    <Slider sx={{ position: 'relative', zIndex: '10' }} size='medium' value={played} min={0} max={1} step={0.001} onChange={this.handleSeekChange} onChangeCommitted={this.handleSeekMouseUp}  valueLabelDisplay="auto" valueLabelFormat={this.timeLabelFormat}/> 
                   
                    {duration ? <div style={{ position: 'relative', left: '-10px', }}>{notesOnSlider}</div> : null}
                </section>

            </div>
        )
    }
}

// export default hot(module)(VideoPlayer)
export default VideoPlayer
