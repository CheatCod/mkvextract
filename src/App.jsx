import React, { useState, useEffect } from 'react';

import './App.css';

import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({log: true,
  corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js'});

function App() {

  const [ready, setReady] = useState(false);

  const load = async() => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {load();}, []);

  return (
    <div className="App">
      <h1> gae</h1>
    </div>
  );
}

export default App;
