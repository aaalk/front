import React, { useState, useEffect } from "react";
import { Grid, Box, TextField, IconButton } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import NoteTime from "./NoteTime";

function InputNote({ doPlay, addNote, colors, videoId, currentTime }) {

    const [colorIdx, setColorIdx] = useState(0)
    const [newNote, setNewNote] = useState('')
    const [isPlaying, setIsPlaying] = useState(false);

    const resetState = () => {
        setColorIdx(0);
        setNewNote('');
    };

    useEffect(resetState, [videoId]);
    // useEffect(() => setNoteTime(currentTime), [currentTime]);
    
    const doPause = () => {
        doPlay(false);
        setIsPlaying(false);
    }

    const handleOnFocus = () => {
        doPause();
    };

    const handleOnBlur = (e) => {
        console.log('InputNote onblur')
    };
    
    const changeColor = () => {
        setColorIdx((colorIdx + 1) % colors.length);
    };

    const handleChange = (e) => {
        setNewNote(e.target.value)
    };

    const handleKeyPress = (e) => {
        console.log(e.key)
        isPlaying && doPause(); 
        if(e.key === 'Enter') {
            handleSubmit();
            e.preventDefault();
        }
    };

    const handleSubmit = () => {
        addNote({videoId: videoId, noteTime: doPlay(true), colorId: colorIdx + 1, text: newNote});
        resetState();
        setIsPlaying(true);
    };

    return(
        <Grid  item xs={12} >
            <Box  sx={{ display: 'flex', flexDirection: 'row', padding: '5px' }} >
                <Box sx={{ display: 'flex', alignItems: 'center', }}>
                <NoteTime seconds={currentTime} bgcolor={colors[colorIdx]} onClick={changeColor}/>
                </Box>
                <Box
                component="form"
                sx={{width: '100%', display: 'flex', alignItems: 'center'}}
                noValidate
                autoComplete="off"
                >
                    <TextField
                    id="new-note-textarea"
                    label="Новая заметка"
                    placeholder="Введите текст заметки"
                    variant="standard"
                    multiline
                    fullWidth
                    value={newNote}
                    onFocus={handleOnFocus}
                    onBlur={handleOnBlur}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} onClick={handleSubmit}><AddCircleIcon sx={{ fontSize:'48px', color: colors[colorIdx] }}/></IconButton>
                </Box>
            </Box>
        </Grid>
    );
};

export default InputNote;
