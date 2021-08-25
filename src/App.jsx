import React, { useState, useEffect } from 'react';

import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({
  log: true,
  corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
});

function App() {
  const [ready, setReady] = useState(false);

  const [video, setVideo] = useState();

  const [url, setUrl] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const extractSub = async () => {
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    await ffmpeg.run(
      '-benchmark',
      '-i',
      'test.mp4',
      '-map',
      '0:s:0',
      'sub.srt',
    );

    const data = ffmpeg.FS('readFile', 'sub.srt');

    setUrl(URL.createObjectURL(new Blob([data.buffer], { type: 'srt' })));
  };
  return ready ? (
    <div className="App">
      <span className="circle1"></span>
      <span className="circle2"></span>
      <h1>Simple, optimized, subtitle extractor</h1>
      <h2> High performance web app built with FFmpeg and web assembly </h2>
      <button className="addFile"> + </button>
      <div className="pane"></div>
      {video && (
        <video controls width="250" src={URL.createObjectURL(video)}>
          {' '}
        </video>
      )}

      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

      <h4>Result</h4>

      <button onClick={extractSub}> Extract Sub </button>

      <a href={url} download="sub.srt">
        download
      </a>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
