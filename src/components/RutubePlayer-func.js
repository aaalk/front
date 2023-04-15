/*
https://web.archive.org/web/20180614174104/http://rutube.ru/info/to_developers

https://github.com/rutube/RutubePlayerJSAPI

http://rutube.ru/api/video/[id_video]

<iframe width="720" height="405" src="https://rutube.ru/play/embed/0771d84d3149331b67ab5ab2c655e447" frameBorder="0" allow="clipboard-write; autoplay" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>  <p><a href="https://rutube.ru/video/0771d84d3149331b67ab5ab2c655e447/">Радиус вписанной окружности прямоугольного треугольника. Разные способы решения</a> от <a href="//rutube.ru/video/person/23940439/">Савченко Елена</a> на <a href="https://rutube.ru/">Rutube•LiST</a>

https://rutube.ru/api/oembed/?url=https://rutube.ru/video/b84dcb5360ea36f1db2a63dbc5098ea4/

https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=Eq22sNBsYzo

https://vimeo.com/api/oembed.json?url=https://vimeo.com/286898202

*/

import React, { useEffect, useRef, useState }  from 'react';

function RutubePlayer({ ref, width, height, url, playing, volume, onReady, onStart, onPlay, onPause, onSeek, onProgress, onDuration}) {

    const [url, setURL] = useState(url);
    const [player, setPlayer] = useState(null)
    // const [fullScreen, setFullScreen] = useState(false)
    const [title, setTitle] = useState('')
    const [playing, setPlaying] = useState(playing)
    const [duration, setDuration] = useState(0)
    const [currTime, setCurrTime] = useState(0)

    const handlePlayPause = () => {
        setPlaying(!playing)
    }

    // const handleFullScreen = () => {
    //     setFullScreen(!fullScreen)
    // }

    const seek = () => {
        player.contentWindow.postMessage(JSON.stringify({
            type: 'player:setCurrentTime',
            data: {time: 20}
        }), '*');
    }

    const seekF = () => {
        player.contentWindow.postMessage(JSON.stringify({
            type: 'player:relativelySeek',
            data: {time: +5}
        }), '*');
    }

    const seekB = () => {
        player.contentWindow.postMessage(JSON.stringify({
            type: 'player:relativelySeek',
            data: {time: -5}
        }), '*');
    }

    const setVolume = () => {
        player.contentWindow.postMessage(JSON.stringify({
            type: 'player:setVolume',
            data: {volume: volume}
        }), '*');
    }

    // const setPlaybackRate = () => {
    //     player.contentWindow.postMessage(JSON.stringify({
    //         type: 'player:setPlaybackRate',
    //         data: {playbackRate: 2.0}
    //     }), '*');
    //     console.log('rate done')
    // }

    useEffect(() => {
        console.log('DOM is ready');
        var player = document.getElementById('rutube-player');
        setPlayer(player);
        setURL("https://rutube.ru/play/embed/0771d84d3149331b67ab5ab2c655e447/")
        window.addEventListener('message', function (event) {
            const dd = event.data
            console.log('event.data', dd)
            var message = JSON.parse(dd);
            switch (message.type) {
                // case 'player:changeState':
                case 'player:ready':
                    const mReady=message.data
                    console.log('------ Ready:',mReady); // 
                    // setDuration(d)
                    break;
                case 'player:currentTime':
                    const t=message.data.time
                    // console.log(t); // текущее время
                    setCurrTime(t)
                    break;
                };
        });


    }, []); 

    useEffect(() => {
        if(url){
            const rutubeId = url.replace(/\/$/, '').split('/').pop()
            // const proxy = 'https://cors-anywhere.herokuapp.com/'
            // fetch(proxy+`https://rutube.ru/api/video/${rutubeId}`)
            // fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://rutube.ru/api/video/${rutubeId}`)}`)
            fetch(`https://api.allorigins.win/get?url=https://rutube.ru/api/video/${rutubeId}`)
                .then(e => e.json())
                .then(e => JSON.parse(e.contents))
                .then(e => {
                    console.log(`fetch https://rutube.ru/api/video/${rutubeId}`, e)
                    setTitle(e.title)
                    setDuration(e.duration)
                })
                .catch(e => {console.error(`fetch error https://rutube.ru/api/video/${rutubeId}:`, e)});
            
        }
    }, [url])

    useEffect(() => {
        if(player){
            player.contentWindow.postMessage(JSON.stringify({
                type: 'player:pause',
                data: {}
            }), '*');      
        }  
    }, [player]); 

    // useEffect(() => {
    //     console.log(fullScreen)
    //     if(player){
    //         const type_ = fullScreen ? 'siteFullscreen:on' : 'siteFullscreen:off'
    //         player.contentWindow.postMessage(JSON.stringify({
    //             type: type_,
    //             data: {}
    //         }), '*');      
    //     }  
    // }, [fullScreen]); 

    useEffect(() => {
        if(player){
            const type_ = playing ? 'player:play' : 'player:pause'
                player.contentWindow.postMessage(JSON.stringify({
                    type: type_,
                    data: {}
                }), '*');
            }
    }, [playing])

    return (
        <div>
            <iframe 
                src={url}
                width={width}
                height={height}
                title='rutube-player'
                id='rutube-player' 
                allow="clipboard-write; autoplay"
                webkitAllowFullScreen
                mozallowfullscreen
                allowFullScreen
                >
            </iframe>
            <div>
                <div>{title}</div>
                <button onClick={setVolume}>Volume</button>
                <button onClick={handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
                <button onClick={seek}>Seek</button>
                <button onClick={seekB}>{'<'}</button>
                <button onClick={seekF}>{'>'}</button>
                {/* <button onClick={handleFullScreen}>{'FullScreen'}</button> */}
                {/* <button onClick={setPlaybackRate}>{'2x'}</button> */}
                <div>{duration}</div>
                <div>{currTime}</div>

            </div>
        </div>
    );
}


export default RutubePlayer;
