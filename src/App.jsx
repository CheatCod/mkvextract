import React, { useState, useEffect } from 'react';

import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({
  log: true,
  corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
});

function App() {
  const [ready, setReady] = useState(false);

  let [video, setVideo] = useState();

  let [url, setUrl] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const extractSub = async () => {
    console.log('executing extractSub');
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
    url = URL.createObjectURL(new Blob([data.buffer], { type: 'srt' }));
    setUrl(url);
  };

  function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return ready ? (
    <div className="App">
      <nav>
        <button className="mkvextract"> MKVExtract </button>
        <div className="menu"> </div>
      </nav>
      <span className="circle1"></span>
      <span className="circle2"></span>

      <div className="hero">
        <h1>
          Simple,
          <br /> no upload , subtitle extractor
        </h1>
        <h2> High performance web app built with FFmpeg and web assembly </h2>

        <div className="drag-and-drop">
          <h3> Drag & drop your video to start</h3>
          <button
            className="addFile"
            onClick={() => document.getElementById('fileButton').click()}
          >
            +
          </button>
        </div>
        <button className="download" download={url}>
          Download
        </button>
      </div>

      <input
        id="fileButton"
        type="file"
        onChange={(e) => {
          video = e.target.files?.item(0);
          setVideo(video);
          extractSub().then(() => downloadURI(url, 'gay.srt'));
        }}
      />

      <h4>Result</h4>

      <button onClick={extractSub}> Extract Sub </button>

      <a href={url} download="sub.srt" id="download">
        download
      </a>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
