import React, { useState, useEffect } from 'react';
import './App.css';
import * as Handy from '@ohdoki/handy-sdk';

function HandyVideoSync() {
  const [connectionKey, setConnectionKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [handy, setHandy] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const extractBaseName = (filename) => {
    if (!filename || typeof filename !== 'string') {
      console.error('Filename is undefined, null, or not a string:', filename);
      return null;
    }
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      console.warn('No extension found in the filename:', filename);
      return filename.trim(); // Return the full name if no extension is found
    }
    let baseName = filename.substring(0, lastDotIndex).trim();

    // Normalize base name by removing leading zeros
    baseName = baseName.replace(/^0+/, '');

    if (!baseName) {
      console.error('Base name could not be extracted from filename:', filename);
    } else {
      console.log('Extracted base name:', baseName);
    }
    return baseName;
  };

  const handleFolderUpload = (event, type) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    if (files.length > 0) {
      const newMediaList = [...mediaList];

      files.forEach((file) => {
        const url = URL.createObjectURL(file);
        const baseName = extractBaseName(file.name);

        if (baseName) {
          // Find or create a media entry for the base name
          let mediaEntry = newMediaList.find(
            (media) => extractBaseName(media.videoName) === baseName || extractBaseName(media.scriptName) === baseName
          );

          if (!mediaEntry) {
            // Create a new media entry if one does not exist
            mediaEntry = { video: '', videoName: '', script: '', scriptName: '' };
            newMediaList.push(mediaEntry);
          }

          // Update the entry with the new video or script information
          mediaEntry[type] = url;
          mediaEntry[`${type}Name`] = file.name;

          console.log(`Processed ${type}:`, file.name);
          console.log(`Updated mediaEntry:`, mediaEntry);
        } else {
          console.error('Skipping file due to invalid base name:', file.name);
        }
      });

      console.log("Final media list after upload:", newMediaList);

      setMediaList(newMediaList);
    }
  };

  const initHandy = async () => {
    if (!handy) {  // Initialize only if handy is not already initialized
      const newHandy = Handy.init();
      try {
        await newHandy.connect(connectionKey);
        setHandy(newHandy);
        setIsConnected(true);
        console.log('Handy connected!');
      } catch (error) {
        console.error('Failed to initialize or connect Handy:', error);
        setIsConnected(false);
      }
    }
  };

  useEffect(() => {
    if (connectionKey && !isConnected) {
      initHandy();
    }

    return () => {
      if (handy && isConnected) {
        console.log('Disconnecting Handy...');
        handy.disconnect();
        setIsConnected(false);
      }
    };
  }, [connectionKey]);

  const uploadAndSetScript = async (scriptUrl) => {
    try {
      if (!handy || typeof handy.setScript !== 'function') {
        console.error('Handy device is not initialized or does not support setScript.');
        return;
      }

      // Fetch the script file as text
      const response = await fetch(scriptUrl);
      const scriptText = await response.text();

      // Upload the script using Handy's upload method
      const scriptData = await Handy.uploadDataToServer(scriptText);
      setMediaList((prevMediaList) => {
        const newMediaList = [...prevMediaList];
        newMediaList[currentMediaIndex] = { ...newMediaList[currentMediaIndex], scriptUrl: scriptData };
        return newMediaList;
      });

      // Set the uploaded script URL in Handy
      await handy.setScript(scriptData);
      console.log('Script uploaded and set successfully.');
    } catch (error) {
      console.error('Failed to upload or set script:', error);
    }
  };

  const handlePlayPause = async (play) => {
    const { script, video } = mediaList[currentMediaIndex];

    if (!script) {
      console.error('No script set. Please upload a script first.');
      return;
    }

    const videoElement = document.getElementById('video-player');

    if (play) {
      try {
        // Ensure the Handy is connected
        if (!handy || !isConnected) {
          console.error('Handy is not connected. Attempting to reconnect...');
          await initHandy();
          if (!handy || !isConnected) {
            console.error('Failed to connect to Handy. Playback cannot start.');
            return;
          }
        }

        await uploadAndSetScript(script);

        // Log script data for debugging
        console.log(`Script being used:`, script);

        // Add a delay to ensure the script is fully uploaded
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

        // Start playback
        console.log('Starting playback...');
        await handy.hsspPlay();
        videoElement.play();
        console.log('Playback started.');
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to start playback:', error);
      }
    } else {
      videoElement.pause();
      try {
        await handy.hsspStop();
        console.log('Playback paused.');
        setIsPlaying(false);
      } catch (error) {
        console.error('Failed to pause playback:', error);
      }
    }
  };

  const handleMediaSelection = async (index) => {
    setCurrentMediaIndex(index);
    setIsPlaying(false);

    const videoElement = document.getElementById('video-player');
    videoElement.pause();

    if (mediaList[index]?.script && !mediaList[index].isScriptSet) {
      await uploadAndSetScript(mediaList[index].script);
      mediaList[index].isScriptSet = true;
      console.log('Script set for selected media.');
    }
  };

  return (
    <div className="handy-video-sync">
      <div className="connection-input-wrapper">
        <input
          type="text"
          className="connection-key-input"
          value={connectionKey}
          onChange={(e) => setConnectionKey(e.target.value)}
          placeholder="Enter Handy Connection Key"
        />
        <span className={`connection-status-icon ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '✅' : '❌'}
        </span>
      </div>

      <div className="file-input-wrapper">
        <input type="file" id="script-input" onChange={(e) => handleFolderUpload(e, 'script')} webkitdirectory="true" multiple />
        <label htmlFor="script-input">Choose Script Folder</label>
      </div>

      <div className="file-input-wrapper">
        <input type="file" id="video-input" onChange={(e) => handleFolderUpload(e, 'video')} webkitdirectory="true" multiple />
        <label htmlFor="video-input">Choose Video Folder</label>
      </div>

      <div className="media-selection">
        {mediaList.map((media, index) => (
          <div key={index} className="media-item">
            <button onClick={() => handleMediaSelection(index)}>
              {media.videoName || `Video ${index + 1}`}
            </button>
            <span> + {media.scriptName || 'No Script'}</span>
          </div>
        ))}
      </div>

      <div className="video-container">
        {mediaList[currentMediaIndex]?.video && (
          <video id="video-player" controls src={mediaList[currentMediaIndex].video} style={{ width: '100%', maxWidth: '800px' }}></video>
        )}
      </div>

      <div className="controls">
        <button onClick={() => handlePlayPause(!isPlaying)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
}

export default HandyVideoSync;
