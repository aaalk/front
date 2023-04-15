import React, { useState, useEffect } from "react";
import ListItem from '@mui/material/ListItem';
import { Box, Typography } from "@mui/material";

import ListItemButton from '@mui/material/ListItemButton';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

const ChapterItemListItem = ({ video, urlSubmit, onVideoDelete }) => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseOver = () => {
    setIsHover(true);
  };

  const handleMouseOut = () => {
    setIsHover(false);
  };

    return (
      <ListItem sx={{p:0, display: 'flex', justifyContent: 'space-between'}} key={`${video.id}-link`} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <Box sx={{ml:1, my:1, maxWidth:'250px', cursor: 'pointer'}} onClick={() => urlSubmit(video.url)}>
          {video.title}
        </Box>
        {isHover 
        ? <ClearIcon sx={{color: '#ccc', cursor: 'pointer'}} onClick={() => onVideoDelete(video.id)}/>
        : null}
    </ListItem>
  );
};

export default ChapterItemListItem;