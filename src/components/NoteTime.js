import React from "react";
import { Box } from "@mui/material";
import Duration from "./Duration";

const NoteTime = ({ seconds, bgcolor, onClick=null }) => (
    <Box sx={{cursor: 'pointer', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              bgcolor: bgcolor, 
              color: '#fff', 
              p:1,
              mr: '10px'
              }} 
              onClick={onClick}>
        <Duration seconds={seconds} />
    </Box>
);

export default NoteTime;   