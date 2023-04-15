import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';

function InputChapter({ selectedId, chaptersList, chapterSelect }) {
    const handleChange = (event) => {
        chapterSelect(event.target.value);
    };
    return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
        <Select
          labelId="chapter-select-label"
          id="chapter-select"
          value={selectedId}
          onChange={handleChange}
          label="Раздел"
        >
            {chaptersList.map((chapter, idx) => (
                <MenuItem value={chapter.id} key={'chapter-selector-' + idx}>{chapter.title}</MenuItem>
                )
            )}
        </Select>
      </FormControl>
    )
}

export default InputChapter