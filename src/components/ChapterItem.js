import React, { useState, useEffect } from "react";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

import ChapterItemListItem from './ChapterItemListItem'

const ChapterItem = ({ chapter, urlSubmit, onVideoDelete }) => {
    const [open, setOpen] = useState(false);
    const chapterClick = () => { setOpen(!open) };
    return (
    <>
      <ListItemButton onClick={chapterClick} divider>
        <ListItemIcon sx={{color: '#0af'}} >{chapter.icon}</ListItemIcon>
        <ListItemText primary={chapter.title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" sx={{ m:0, pt:1, pb:2, background: '#1c1c1c' }}>
          {chapter.videos.length === 0 
           ? <ListItem sx={{ display: 'flex', justifyContent: 'center', color: '#888' }} key={`${chapter.id}-item`}>Здесь ничего нет...</ListItem> 
           : chapter.videos.sort((a, b) => b.added - a.added).map(video => (
              <ChapterItemListItem video={video} urlSubmit={urlSubmit} onVideoDelete={onVideoDelete} key={`${video.id}-link`} />
            ))
          }
        </List>
      </Collapse>
    </>
  );
};

export default ChapterItem;