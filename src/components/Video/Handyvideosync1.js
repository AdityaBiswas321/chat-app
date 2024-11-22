import React, { useState, useEffect } from 'react';
// import './HandyVideoSync.css';
import * as Handy from '@ohdoki/handy-sdk';
import styles from './VideoScriptApp.module.css';

function HandyVideoSync({ selectedCategory, apiCallCount }) { // Accept selectedCategory from LLM
  const [connectionKey, setConnectionKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [handy, setHandy] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [randomPlayMode, setRandomPlayMode] = useState(false);
  const [playedMediaIndices, setPlayedMediaIndices] = useState([]);
  const [triggerChange, setTriggerChange] = useState(0);  // New state to force update


  const extractBaseName = (filename) => {
    if (!filename || typeof filename !== 'string') {
      console.error('Filename is undefined, null, or not a string:', filename);
      return null;
    }
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      console.warn('No extension found in the filename:', filename);
      return filename.trim();
    }
    let baseName = filename.substring(0, lastDotIndex).trim();
    baseName = baseName.replace(/^0+/, '');

    if (!baseName) {
      console.error('Base name could not be extracted from filename:', filename);
    } else {
      console.log('Extracted base name:', baseName);
    }
    return baseName;
  };

  const handleFolderUpload = (event, type) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const newMediaList = [...mediaList];

      files.forEach((file) => {
        const url = URL.createObjectURL(file);
        const baseName = extractBaseName(file.name);

        if (baseName) {
          let mediaEntry = newMediaList.find(
            (media) =>
              extractBaseName(media.videoName) === baseName ||
              extractBaseName(media.scriptName) === baseName
          );

          if (!mediaEntry) {
            mediaEntry = { video: '', videoName: '', script: '', scriptName: '', category: '' };
            newMediaList.push(mediaEntry);
          }

          mediaEntry[type] = url;
          mediaEntry[`${type}Name`] = file.name;

          console.log(`Processed ${type}:`, file.name);
          console.log(`Updated mediaEntry:`, mediaEntry);
        } else {
          console.error('Skipping file due to invalid base name:', file.name);
        }
      });

      setMediaList(newMediaList);
    }
  };

  const handleCategoryChange = (index, category) => {
    const updatedMediaList = [...mediaList];
    updatedMediaList[index].category = category;
    setMediaList(updatedMediaList);
  };

  const initHandy = async () => {
    if (!handy) {
      const newHandy = Handy.init();
      setHandy(newHandy);
    }

    try {
      if (handy && connectionKey) {
        const storedKey = await handy.getStoredKey();
        if (!isConnected || (storedKey && storedKey !== connectionKey)) {
          await handy.connect(connectionKey);
          setIsConnected(true);
          console.log('Handy connected!');
        }
      }
    } catch (error) {
      console.error('Failed to initialize or connect Handy:', error);
      setIsConnected(false);
    }
  };

  // Auto-reconnect mechanism, checking connection status periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isConnected && connectionKey) {
        initHandy(); // Attempt to reconnect if disconnected
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, [isConnected, connectionKey, handy]);

  const handleConnectClick = () => {
    if (connectionKey && !isConnected) {
      initHandy();
    }
  };

  // Clean up connection on component unmount
  useEffect(() => {
    if (handy && isConnected) {
      return () => {
        handy.disconnect();
        setIsConnected(false);
      };
    }
  }, [handy, isConnected]);

  const uploadAndSetScript = async (scriptUrl) => {
    try {
      if (!handy || typeof handy.setScript !== 'function') {
        console.error('Handy device is not initialized or does not support setScript.');
        return;
      }

      const response = await fetch(scriptUrl);
      const scriptText = await response.text();
      const scriptData = await Handy.uploadDataToServer(scriptText);
      setMediaList((prevMediaList) => {
        const newMediaList = [...prevMediaList];
        newMediaList[currentMediaIndex] = { ...newMediaList[currentMediaIndex], scriptUrl: scriptData };
        return newMediaList;
      });

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
        if (!handy || !isConnected) {
          console.error('Handy is not connected. Attempting to reconnect...');
          await initHandy();
          if (!handy || !isConnected) {
            console.error('Failed to connect to Handy. Playback cannot start.');
            return;
          }
        }

        await uploadAndSetScript(script);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

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

  const handleDisconnect = async () => {
    if (handy && isConnected) {
      try {
        // Reset stroke zone
        await handy.setStrokeZone({ min: 0, max: 100 }); // Reset to default range
        await handy.setHampVelocity(50); // Reset velocity to default
        console.log('Handy settings reset to default');
        
        // Disconnect Handy
        await handy.disconnect(true); // true to remove all stored states
        setIsConnected(false);
        console.log('Handy disconnected');
      } catch (error) {
        console.error('Failed to reset settings or disconnect:', error);
      }
    }
  };

  const handleVideoEnd = async () => {
    let nextIndex;

    if (randomPlayMode) {
      const unplayedIndices = mediaList
        .map((_, index) => index)
        .filter((index) => !playedMediaIndices.includes(index));

      if (unplayedIndices.length === 0) {
        setPlayedMediaIndices([]);
        nextIndex = Math.floor(Math.random() * mediaList.length);
      } else {
        nextIndex = unplayedIndices[Math.floor(Math.random() * unplayedIndices.length)];
      }

      setPlayedMediaIndices((prev) => [...prev, nextIndex]);
    } else {
      nextIndex = (currentMediaIndex + 1) % mediaList.length;
    }

    setCurrentMediaIndex(nextIndex);

    if (mediaList[nextIndex]?.script) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
      await uploadAndSetScript(mediaList[nextIndex].script);
      handlePlayPause(true); // Start playing the next video and script
    }
  };

// Handle LLM category selection (reward/punishment)
useEffect(() => {
  const filteredMedia = mediaList.filter((media) => media.category === selectedCategory);

  if (selectedCategory === 'deny') {
    handleDeny();
  } else if (selectedCategory === 'stop') {
    handleStop();
  } else if (filteredMedia.length > 0) {
    let randomMediaIndex;
    let selectedMediaIndex;

    // Keep selecting a new random video until it's different from the current one
    do {
      randomMediaIndex = Math.floor(Math.random() * filteredMedia.length);
      selectedMediaIndex = mediaList.indexOf(filteredMedia[randomMediaIndex]);
    } while (selectedMediaIndex === currentMediaIndex && filteredMedia.length > 1);  // Ensures it's not the same video if there's more than one

    // Set the selected media index to play a random video from the selected category
    setCurrentMediaIndex(selectedMediaIndex);

    // Automatically play the video once category is selected
    handlePlayPause(true);
  }
}, [apiCallCount]);  // Trigger video playback whenever apiCallCount changes


    // Function to handle 'deny()' command
    const handleDeny = async () => {
    console.log("Deny triggered: Setting device to high position and holding.");
    if (!handy || !isConnected) {
        console.error('Handy is not connected');
        return;
      }
      try {
        await handy.setStrokeZone({ min: 100, max: 100 }); // Set to 100% (topmost position)
        await handy.hampPlay(); // Start the movement to go to the top
    
        setTimeout(async () => {
          await handy.hampStop(); // Stop all movement once the top is reached
          console.log('Deny action triggered: Device moved to the highest position and stopped.');
        }, 500); // Adjust timeout to ensure the device reaches the top
    
      } catch (error) {
        console.error('Error during deny action:', error);
      }
    };

    

    // Function to handle 'stop()' command
    const handleStop = () => {
        console.log("Stop triggered: Pausing video and stopping script.");
        const videoElement = document.getElementById('video-player');
    
        if (videoElement) {
        videoElement.pause(); // Pause the video
        }
    
        if (handy && isConnected) {
        handy.hampStop(); // Stop the device's motion
        }
    
        setIsPlaying(false); // Update state to reflect that playback is stopped
    };
  

  // Handle the video end event
  useEffect(() => {
    const videoElement = document.getElementById('video-player');

    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoEnd);

      return () => {
        videoElement.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [currentMediaIndex, mediaList, randomPlayMode, playedMediaIndices]);

  // Only sync the script when the user seeks
  useEffect(() => {
    const videoElement = document.getElementById('video-player');

    if (videoElement) {
      const handleSeeked = () => {
        const currentTime = videoElement.currentTime;
        syncScriptWithVideo(currentTime); // Sync script only when user seeks
      };

      videoElement.addEventListener('seeked', handleSeeked);

      return () => {
        videoElement.removeEventListener('seeked', handleSeeked);
      };
    }
  }, [currentMediaIndex, mediaList, isConnected]);

  const syncScriptWithVideo = async (currentTime) => {
    if (!handy || !isConnected || !mediaList[currentMediaIndex]?.scriptUrl) return;

    try {
      await handy.hsspPlay(currentTime); // Sync the script to the current time after seeking
      console.log(`Synchronized script with video after seek: ${currentTime}`);
    } catch (error) {
      console.error('Failed to synchronize script with video after seek:', error);
    }
  };

  return (
    <div className={styles["handy-video-sync"]}>
    <div className={styles["video-container"]}>
      {mediaList[currentMediaIndex]?.video && (
        <video
          id="video-player"
          controls
          src={mediaList[currentMediaIndex].video}
          style={{ width: '100%', maxWidth: '800px' }}
        ></video>
      )}
    </div>

    <div className={styles["video-and-connection-wrapper"]}>
      <div className={styles["connection-input-wrapper"]}>
        <input
          type="text"
          className={styles["connection-key-input"]}
          value={connectionKey}
          onChange={(e) => setConnectionKey(e.target.value)}
          placeholder="Enter Handy Connection Key"
        />
        <button onClick={handleConnectClick}>Connect</button>
        <button onClick={handleDisconnect}>Disconnect & Reset</button>
        <span className={`${styles["connection-status-icon"]} ${isConnected ? styles.connected : styles.disconnected}`}>
          {isConnected ? '✅' : '❌'}
        </span>
      </div>

      <div className={styles["file-input-wrapper"]}>
        <input type="file" id="script-input" onChange={(e) => handleFolderUpload(e, 'script')} webkitdirectory="true" multiple />
        <label htmlFor="script-input">Choose Script Folder</label>
      </div>

      <div className={styles["file-input-wrapper"]}>
        <input type="file" id="video-input" onChange={(e) => handleFolderUpload(e, 'video')} webkitdirectory="true" multiple />
        <label htmlFor="video-input">Choose Video Folder</label>
      </div>

      <div className={styles["media-selection"]}>
        {mediaList.map((media, index) => (
          <div key={index} className={styles["media-item"]}>
            <button onClick={() => handleMediaSelection(index)}>
              {media.videoName || `Video ${index + 1}`}
            </button>
            <span> + {media.scriptName || 'No Script'}</span>

            <div>
              <label>
                <input
                  type="radio"
                  value="reward"
                  checked={media.category === 'reward'}
                  onChange={() => handleCategoryChange(index, 'reward')}
                />
                Reward
              </label>
              <label>
                <input
                  type="radio"
                  value="punishment"
                  checked={media.category === 'punishment'}
                  onChange={() => handleCategoryChange(index, 'punishment')}
                />
                Punishment
              </label>
              <label>
                <input
                  type="radio"
                  value="tease"
                  checked={media.category === 'tease'}
                  onChange={() => handleCategoryChange(index, 'tease')}
                />
                Tease
              </label>
              <label>
                <input
                  type="radio"
                  value="edge"
                  checked={media.category === 'edge'}
                  onChange={() => handleCategoryChange(index, 'edge')}
                />
                Edge
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className={styles["controls"]}>
        <button onClick={() => handlePlayPause(!isPlaying)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      <div className={styles["random-play-mode"]}>
        <label>
          <input
            type="radio"
            checked={randomPlayMode}
            onChange={() => setRandomPlayMode(true)}
          />
          Random Play Mode
        </label>
        <label>
          <input
            type="radio"
            checked={!randomPlayMode}
            onChange={() => setRandomPlayMode(false)}
          />
          Sequential Play Mode
        </label>
      </div>
    </div>
  </div>
  );
  
}

export default HandyVideoSync;
