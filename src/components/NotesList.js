import React, { useState, useEffect } from "react";
import { Box, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import NoteItem from './NoteItem'

const NotesList = ({ notes, colors, onNoteSelect, onNoteDelete }) => {
    const notesSorted = notes.sort((a, b) => (Number(a.noteTime) > Number(b.noteTime)))
    const [notesFiltered, setNotesFiltered] = useState(notesSorted)
    const [searchText, setSearchText] = useState('');

    const filterNotes = () => {
        setNotesFiltered(searchText === '' ? notesSorted : notesSorted.filter(note => note.text.toLowerCase().includes(searchText.toLowerCase())))
    }

    useEffect(() => {filterNotes()}, [notes, searchText])

    const changeFilterHandle = (e) => {
        setSearchText(e.target.value)
        console.log('change', searchText, e.target.value)
    }
    
    const handleKeyPress = (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
        }
    }

    const handleFilterClear = () => {
        setSearchText('')
    }

    return(
            <Box spacing={2}>
                {notes.length > 0  ? 
                  <Box component="form" sx={{mt: '10px', p: '0', width: '100%', display: 'flex', alignItems: 'center'}}>
                    <TextField
                        id="notes-filter-textarea"
                        placeholder="Поиск"
                        size='small'
                        // variant="standard"
                        fullWidth
                        noValidate
                        autoComplete="off"
                        value={searchText}
                        onChange={changeFilterHandle}
                        onKeyPress={handleKeyPress}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{mr: '10px', color:'#aaa'}}/>,
                            endAdornment: <IconButton sx={{p:'0', visibility: searchText ? "visible" : "hidden"}} onClick={handleFilterClear}><ClearIcon/></IconButton>
                        }}
                    />
                   </Box>
                 : <></>}
                <Box>
                    {notesFiltered.map((note, idx) => (
                        <NoteItem note={note} colors={colors} noteIndex={idx} key={idx} onNoteSelect={onNoteSelect} onNoteDelete={onNoteDelete}/>)
                        )
                    }
                </Box>
            </Box>
        
    )
};

export default NotesList;