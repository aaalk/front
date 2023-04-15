import React from 'react';
import List from '@mui/material/List';

import SchoolIcon from '@mui/icons-material/School';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import MicrowaveIcon from '@mui/icons-material/Microwave';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';

import ChapterItem from './ChapterItem';

function ChaptersList({ chaptersList, videosList, urlSubmit, onVideoDelete}) {
  const icons = { "<SchoolIcon/>": <SchoolIcon/>, 
                  "<SportsGymnasticsIcon/>": <SportsGymnasticsIcon/>, 
                  "<MicrowaveIcon/>": <MicrowaveIcon/>, 
                  "<MovieFilterIcon/>": <MovieFilterIcon/>,
                  "<FolderSpecialIcon/>": <FolderSpecialIcon/>};

  const chapters = chaptersList.map((chapter, idx) => (
    {...chapter, icon: icons[chapter.icon], videos: videosList.filter(video => video.chapterId === chapter.id) }
  ))
  return (
    <div> 
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {chapters.map((chapter, idx) => (
          <ChapterItem chapter={chapter} urlSubmit={urlSubmit} onVideoDelete={onVideoDelete} key={`${idx}-${chapter.title}`}/> 
        ))}
    </List>
    </div>
  );
};
export default ChaptersList;