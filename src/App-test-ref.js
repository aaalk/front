import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { v4 as uuid } from "uuid";

import ReactPlayer from "react-player";

// Render a YouTube video player
export default function App() {
  const reactPlayerRef = useRef();
  const inputRef = useRef();
  const timestampsPrevState = useRef([]);

  const [timestamps, setTimestamps] = useState([]);

  const bookmark = () => {
    setTimestamps((state) => [
      ...state,
      { time: reactPlayerRef.current.getCurrentTime(), id: uuid() }
    ]);
  };

  useEffect(() => {
    if (timestampsPrevState.current.length < timestamps.length) {
      inputRef.current && inputRef.current.focus();
    }
  });
  console.log(timestampsPrevState);

  const shouldBeAbleToAddBookmarks =
    timestamps.length === 0 || !Boolean(timestamps.find((t) => !t.text));

  const handleChangeText = (id, text) => {
    setTimestamps((t) => {
      const thisBookmark = t.find((timestamp) => timestamp.id === id);
      const restBookmarks = t.filter((timestamp) => timestamp.id !== id);
      thisBookmark.text = text;

      return [...restBookmarks, thisBookmark];
    });
  };

  const handleDelete = (id) => {
    setTimestamps((t) => t.filter((timestamp) => timestamp.id !== id));
  };

  return (
    <div className="App">
      <ReactPlayer
        url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
        ref={reactPlayerRef}
        config={{
          youtube: {
            playerVars: { controls: 1 }
          }
        }}
      />
      <div style={{ marginTop: "10px" }}>
        <div>
          <button onClick={bookmark} disabled={!shouldBeAbleToAddBookmarks}>
            Place bookmark
          </button>
        </div>
        <ul>
          {timestamps.map((t) => (
            <div style={{ display: "flex" }} key={t.id}>
              <li style={{ width: "100px" }}>
                {Math.round(t.time * 100) / 100}s
              </li>
              <input
                value={t.text}
                onChange={(e) => handleChangeText(t.id, e.target.value)}
                placeholder="Enter bookmark text"
                ref={!t.text ? inputRef : null}
              />
              <button
                onClick={() => reactPlayerRef.current.seekTo(t.time, "seconds")}
                sytle={{ paddingRight: "5px" }}
              >
                Scroll to
              </button>
              <button onClick={() => handleDelete(t.id)}>Delete</button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

render(<App />, document.getElementById("root"));
