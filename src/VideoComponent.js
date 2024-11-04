import React, { useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; // Ensure you have this package installed
import './App.css';
let ffmpeg; // Store the ffmpeg instance
function MultiTrimVideo() {
  const [videoDuration, setVideoDuration] = useState(0);
  const [intervalDuration, setIntervalDuration] = useState(60);
  const [videoSrc, setVideoSrc] = useState('');
  const [videoFileValue, setVideoFileValue] = useState('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [videoTrimmedUrls, setVideoTrimmedUrls] = useState([]);
  const videoRef = useRef();

  const loadScript = (src) => {
    return new Promise((onFulfilled, _) => {
      const script = document.createElement('script');
      let loaded;
      script.async = 'async';
      script.defer = 'defer';
      script.setAttribute('src', src);
      script.onreadystatechange = script.onload = () => {
        if (!loaded) {
          onFulfilled(script);
        }
        loaded = true;
      };
      script.onerror = function () {
        console.log('Script failed to load');
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const blobURL = URL.createObjectURL(file);
    setVideoFileValue(file);
    setVideoSrc(blobURL);
  };

  const convertToHHMMSS = (val) => {
    const secNum = parseInt(val, 10);
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - hours * 3600) / 60);
    let seconds = secNum - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return hours === '00' ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    loadScript(
      'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2/dist/ffmpeg.min.js',
    ).then(() => {
      if (typeof window !== 'undefined') {
        ffmpeg = window.FFmpeg.createFFmpeg({ log: true });
        ffmpeg.load();
        setIsScriptLoaded(true);
      }
    });
  }, []);

  useEffect(() => {
    if (videoRef && videoRef.current) {
      const currentVideo = videoRef.current;
      currentVideo.onloadedmetadata = () => {
        setVideoDuration(currentVideo.duration);
      };
    }
  }, [videoSrc]);

  const handleTrim = async () => {
    if (isScriptLoaded) {
      const { name, type } = videoFileValue;
      ffmpeg.FS('writeFile', name, await window.FFmpeg.fetchFile(videoFileValue));
      const videoFileType = type.split('/')[1];
      const urls = [];

      // Calculate the number of segments based on intervalDuration
      const intervalSeconds = parseInt(intervalDuration, 10);
      let start = 0;

      while (start < videoDuration) {
        const end = Math.min(start + intervalSeconds, videoDuration);

        // Run the ffmpeg command to trim each segment
        await ffmpeg.run(
          '-i', name,
          '-ss', `${convertToHHMMSS(start)}`,
          '-to', `${convertToHHMMSS(end)}`,
          '-acodec', 'copy',
          '-vcodec', 'copy',
          `out_${start}.${videoFileType}`
        );

        const data = ffmpeg.FS('readFile', `out_${start}.${videoFileType}`);
        const url = URL.createObjectURL(new Blob([data.buffer], { type: videoFileValue.type }));
        urls.push(url);

        // Move to the next segment
        start = end;
      }

      setVideoTrimmedUrls(urls);
    }
  };

  const handleDownloadAllAsZip = async () => {
    const zip = new JSZip();

    // Use Promise.all to ensure all files are processed
    await Promise.all(
      videoTrimmedUrls.map(async (url, index) => {
        const response = await fetch(url);
        const blob = await response.blob();
        zip.file(`trimmed_segment_${index + 1}.mp4`, blob);
      })
    );

    // Generate the zip file and trigger the download
    zip.generateAsync({ type: 'blob' }).then((zipFile) => {
      saveAs(zipFile, 'video_segments.zip');
    });
  };

  return (
    <div className="App">
      <input type="file" onChange={handleFileUpload} />
      <br />
      <label>
        Interval Duration (seconds): 
        <input
          type="number"
          value={intervalDuration}
          onChange={(e) => setIntervalDuration(e.target.value)}
          min="1"
        />
      </label>
      <br />
      {videoSrc?.length > 0 && (
        <React.Fragment>
          <video src={videoSrc} ref={videoRef} controls>
            <source src={videoSrc} type={videoFileValue.type} />
          </video>
          <br />
          <button onClick={handleTrim}>Trim Video</button>
          <button onClick={handleDownloadAllAsZip} disabled={videoTrimmedUrls.length === 0}>
            Download All as Zip
          </button>
          <br />
          <div>
            {videoTrimmedUrls.map((url, index) => (
              <div key={index}>
                <h4>Segment {index + 1}</h4>
                <video controls src={url} />
              </div>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default MultiTrimVideo;
