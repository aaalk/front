import React from "react";
import { Box, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import NoteTime from "./NoteTime";
import { useState } from "react";

const NoteItem = ({ note, colors, noteIndex, onNoteSelect, onNoteDelete }) => {
    const [isHover, setIsHover] = useState(false);

    const handleMouseOver = () => {
      setIsHover(true);
    };
  
    const handleMouseOut = () => {
      setIsHover(false);
    };
    
    const {id, noteTime, colorId, text} = note;
    return(
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <Box sx={{ display: 'flex', flexDirection: 'row', padding: '5px', maxWidth:'460px', cursor: 'pointer', }} onClick ={() => onNoteSelect(noteTime)}>
                <NoteTime seconds={noteTime} bgcolor={colors[colorId-1]}/>
                <Typography variant='body1' display='inline'>{text}</Typography>
            </Box>
            {isHover ? (<IconButton onClick={() => onNoteDelete(noteTime)}><ClearIcon sx={{color:'#ccc'}}/></IconButton>) 
            :null}
        </Box>
    )};

    export default NoteItem;