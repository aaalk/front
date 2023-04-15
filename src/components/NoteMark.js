import React from "react";

const NoteMark = ({ duration, seconds, color, onNoteSelect }) => {
    // const pos = `${Number(relTime) * 100}%`;
    const pos = `${100 * seconds / duration}%`;
    return(
        <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: pos, top: '-19px', width: '20px', cursor: 'pointer'  }} onClick ={() => onNoteSelect(seconds)}>
            <div style={{background: '#058', width: '2px', height: '15px', marginLeft: '9px' }}></div>
            <div style={{background: color, width: '20px', height: '20px', border: '2px solid #fff', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', borderRadius: '10px' }}></div>
        </div>
        )
};

export default NoteMark;