import React, { useEffect, useRef, useState } from 'react';

import { styled, useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import ChaptersList from './components/ChaptersList';
import VideoPlayer from './components/VideoPlayer'
import RutubePlayer from './components/RutubePlayer'

import InputVideoURL from "./components/InputVideoURL";
import InputChapter from "./components/InputChapter";
import InputNote from './components/InputNote';
import NotesList from './components/NotesList';
import NoteMark from './components/NoteMark'

import { grey, lightBlue } from '@mui/material/colors';
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {main: '#0af'}, 
        background: {default:'#1e1e1e', paper: '#252525'},
        text: {primary: '#ccc', secondary: grey[500]}, 
    }, 
});


const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(1),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth - 40}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 10,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

function App() {
    const theme = useTheme();
    // const notesColors = ["#0af", "#4d0", "#f90", "#f30", "#a3f"];
    const [colorsIsLoaded, setColorsIsLoaded] = useState(false);
    const [colorsError, setColorsError] = useState(null);
    const [colors, setColors] = useState([]);

    const [chaptersIsLoaded, setChaptersIsLoaded] = useState(false);
    const [chaptersError, setChaptersError] = useState(null);
    const [chaptersList, setChaptersList] = useState([]);

    const [videosIsLoaded, setVideosIsLoaded] = useState(false);
    const [videosError, setVideosError] = useState(null);
    const [videosList, setVideosList] = useState([]);

    const [videoIsAdded, setVideoIsAdded] = useState(false);
    const [videoAddError, setVideoAddError] = useState(null);
    const [currentVideo, setCurrentVideo] = useState({id: null, chapterId: null, added:null, title: 'Видео не выбрано', url: ''});
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    const [notesIsLoaded, setNotesIsLoaded] = useState(false);
    const [notesSaved, setNotesSaved] = useState(false);
    const [notesError, setNotesError] = useState(null);
    const [notes, setNotes] = useState([])
    const [notesOnSlider, setNotesOnSlider] = useState([])

    const [open, setOpen] = useState(true);

    const getData = (url, setData, setIsLoaded, setError) => {
        fetch(url)
            .then(res => res.json())
            .then((result) => {
                if(url.toLowerCase().includes('color')){
                    result = result.map(c => c.value)
                }
                setData(result);
                setIsLoaded(true);
            },
                // Если обрабатывать ошибки здесь, а не в блоке catch(), то поймаем исключения и от реальных ошибок в компонентах.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const addVideoDb = (newVideo) => {
        fetch(`http://localhost:5000/addVideo/?id=${newVideo.id}&chapterId=${newVideo.chapterId}&added=${newVideo.added}&title=${newVideo.title}&url=${newVideo.url}`)
            .then(res => res.json())
            .then((result) => {
                setVideoIsAdded(true);
            },
                (error) => {
                    setVideoIsAdded(false);
                    setVideoAddError(error);
                }
            )
    }

    const updateVideoDb = (newData) => {
        let url = `http://localhost:5000/updVideo/?id=${newData.id}`
        url += 'chapterId' in newData ? `&chapterId=${newData.chapterId}` : ``
        url += 'added' in newData ? `&added=${newData.added}` : ``
        url += 'title' in newData ? `&title=${newData.title}` : ``
        fetch(url)
            .then(res => res.json())
            .then((result) => {
                setVideoIsAdded(true);
            },
                (error) => {
                    setVideoIsAdded(false);
                    setVideoAddError(error);
                }
            )
    }

    const deleteVideoDb = (videoId) => {
        fetch(`http://localhost:5000/deleteVideo/?id=${videoId}`)
            .then(res => res.json())
            .then((result) => {
                setVideoIsAdded(true);
            },
                (error) => {
                    setVideoIsAdded(false);
                    setVideoAddError(error);
                }
            )
    }

    const addNoteBd = (newNote) => {
        let url = `http://localhost:5000/addNote/?videoId=${newNote.videoId}&noteTime=${newNote.noteTime}&colorId=${newNote.colorId}&text=${newNote.text}`
        fetch(url)
            .then(res => res.json())
            .then((result) => {
                setNotesSaved(true);
            },
                (error) => {
                    setNotesSaved(false);
                    setNotesError(error);
                }
            )
    }

    const deleteNoteDb = (noteData) => {
        let url = `http://localhost:5000/deleteNote/?videoId=${noteData.videoId}`
        url += 'noteTime' in noteData ? `&noteTime=${noteData.noteTime}` : ``
        fetch(url)
            .then(res => res.json())
            .then((result) => {
                setNotesSaved(true);
            },
                (error) => {
                    setNotesSaved(false);
                    setNotesError(error);
                }
            )
    }

    // Запрос списка разделов, видео, цветов:
    useEffect(() => {
        getData("http://localhost:5000", setChaptersList, setChaptersIsLoaded, setChaptersError);
        getData("http://localhost:5000/getVideos", setVideosList, setVideosIsLoaded, setVideosError);
        getData("http://localhost:5000/getColors", setColors, setColorsIsLoaded, setColorsError);
    }, [])

    const getCurrentNotes = (videoId) => {
        getData(`http://localhost:5000/getNotes/?videoId=${videoId}`, setNotes, setNotesIsLoaded, setNotesError)

    }

    const addNote = (newNote) => {
        setNotes([...notes, newNote])
        addNoteBd(newNote)
    };

    const deleteNote = (noteTime) => {
        setNotes(notes.filter((item) => (item.videoId !== currentVideo.id || item.noteTime !== noteTime)));
        deleteNoteDb({videoId: currentVideo.id, noteTime: noteTime})
    };

    useEffect(() => {
        setNotesOnSlider(duration ? notes.map((note, idx) => <NoteMark relTime={note.noteTime / duration} color={colors[note.colorId-1]} onNoteSelect={onNoteSelect} key={idx} />) : null)
    }, [notes, duration])

    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const deleteVideo = (videoId) =>{
        setVideosList(videosList.filter(item => item.id !== videoId));
        deleteVideoDb(videoId);
        deleteNoteDb({videoId: videoId});
        if(videoId == currentVideo.id){
            // currentVideo.id = null;
            setCurrentVideo({id: null, chapterId: null, added:null, title: 'Видео не выбрано', url: ''});
        }
    }


    const urlSubmit = (url) => {
        // const newVideo = {id: null, chapterId: null, title: 'Видео не загружено', url: url}
        // setCurrentVideo(newVideo)
        const foundByUrl = videosList.filter(item => item.url === url)
        if(foundByUrl.length){
            setCurrentVideo(foundByUrl[0]);
            getCurrentNotes(foundByUrl[0].id);
            return;
        }
        setNotes([])
        fetch(`https://noembed.com/embed?url=${url}`)
            .then(e => e.json())
            .then(e => {
                if(!('error' in e)){
                    const timeStamp = Date.now();
                    const newVideo = {
                        id: timeStamp,
                        chapterId: chaptersList.filter(item => item.title === 'Разное')[0].id,
                        added: timeStamp,
                        title: e.title ? e.title : 'Название загружается...',
                        url: url};
                    setCurrentVideo(newVideo);
                    setVideosList([...videosList, newVideo]);
                    addVideoDb(newVideo);
                }else{
                    setCurrentVideo({id: null, chapterId: null, added:null, title: 'Видео не выбрано', url: url});
                }
            }
            );
    }

    const chapterSelect = (newChapterId) => {
        const newAdded = Date.now()
        for (const i in videosList) {
            if (videosList[i].id === currentVideo.id) {
                videosList[i] = { ...videosList[i], chapterId: newChapterId, added: newAdded };
                setCurrentVideo(videosList[i])
                updateVideoDb({id: videosList[i].id, chapterId: newChapterId, added: newAdded})
                break;
            }
        }
        setVideosList(videosList)
    }

    const videoPlayerRef = useRef();

    const doPlay = (play) => {
        play ? videoPlayerRef.current.handlePlay() : videoPlayerRef.current.handlePause()
        return videoPlayerRef.current.getCurrentTime()
    }

    const getCurrentSeconds = () => (videoPlayerRef.current.getCurrentTime());
 
    const onInputNoteFocus = (pause=false) => {
        pause && videoPlayerRef.current.handlePause();
        return videoPlayerRef.current.getCurrentTime();
    };

    const onNoteSelect = (relTime) => {
        videoPlayerRef.current.seekTo(relTime)
    };


    return (
        <ThemeProvider theme={darkTheme}>
        {/* <ThemeProvider theme= {createTheme({palette: {mode: 'light'}})}> */}
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
            {/* <Box position="fixed" open={open}> */}
            <Box sx={{ alignItems: 'center', padding: 1 }}>
                    <IconButton onClick={handleDrawerOpen} sx={{ ...(open && { display: 'none' }) }}>
                        <MenuIcon color="primary" />
                    </IconButton>
            </Box>
            <Drawer sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', }, }}
                variant="persistent" anchor="left" open={open}>
                <Button variant='contained' startIcon={<ChevronLeftIcon />} sx={{ py: 2, px: 0, ml: -8 }} onClick={handleDrawerClose}>Мои видео-заметки</Button>
                {/* <Divider /> */}
                <ChaptersList chaptersList={chaptersList} videosList={videosList} urlSubmit={urlSubmit} onVideoDelete={deleteVideo}/>
            </Drawer>
            
            <Main open={open}>
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item lg={8} xs={12}>
                            <InputVideoURL urlPlace={currentVideo.url} onFormSubmit={urlSubmit} />
                        </Grid>
                        <Grid item lg={4} xs={12}>
                        {currentVideo.id ? <Box sx={{mt: '10px'}}><InputChapter selectedId={currentVideo.chapterId} chaptersList={chaptersList} chapterSelect={chapterSelect} /></Box>
                        : null
                        }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item lg={8} xs={12}>
                            <Typography variant='h5' sx={{ m: '10px 0' }}>{currentVideo.title}</Typography>
                            <VideoPlayer url={currentVideo.url} notesOnSlider={notesOnSlider} durationCallback={setDuration} setCurrentTime={setCurrentTime} ref={videoPlayerRef} />
                            {/* <NotesBar notes={notes} colors={colors.map(c => c.value)} duration={duration} onNoteSelect={onNoteSelect} /> */}

                        </Grid>
                        <Grid item lg={4} xs={12}>
                            {currentVideo.id ? <>
                            <InputNote doPlay={doPlay} currentTime={currentTime}  addNote={addNote} colors={colors} videoId={currentVideo.id} />
                            <NotesList notes={notes} colors={colors} onNoteSelect={onNoteSelect} onNoteDelete={deleteNote} />
                            </> 
                            : null
                            }
                        </Grid>
                    </Grid>
                </Grid>


            </Main>
        </Box>
        </ThemeProvider>
    );
}


export default App;