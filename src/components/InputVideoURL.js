import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, TextField, InputBase, IconButton } from "@mui/material";
// import Grid from '@mui/material/Grid'
// import Paper from '@mui/material/Paper'
// import TextField from "@mui/material/TextField";
// import InputBase from '@mui/material/InputBase';
// import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

function InputVideoURL({urlPlace, onFormSubmit}) {
    const [url, setUrl] = useState(urlPlace)

    useEffect(() => {
        setUrl(urlPlace);
      }, [urlPlace]);

    const handleChange = (e) => {
        setUrl(e.target.value)
    }

    const handleSubmit = () => {
        if(url){onFormSubmit(url);}
    }

    const handleKeyPress = (e) => {
        if(e.key === 'Enter') {
            handleSubmit()
            e.preventDefault();
        }
        
    }

    return(
            // <Paper elevation={6} style={{ padding: '10px', marginBottom: '20px'}}>
            <Box component='form' sx={{ p: '2px 4px', m: '10px 0', display: 'flex', alignItems: 'center'}}>
                <TextField 
                        fullWidth
                        // sx={{ ml: 1, flex: 1 }}
                        id="video-url-textarea"
                        placeholder='Вставьте ссылку на видео'
                        // label="Ссылка на видео"
                        value={url}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        variant="standard"
                        // variant="outlined"
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSubmit}><SearchIcon  color="primary" /></IconButton>
            </Box>

        );
};

export default InputVideoURL;