import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file for styling
import * as Handy from '@ohdoki/handy-sdk'; // Import the Handy SDK

function HandyVideoSync() {
  const [connectionKey, setConnectionKey] = useState(''); // State for storing connection key
  const [isConnected, setIsConnected] = useState(false); // Connection status
  const [handy, setHandy] = useState(null); // Handy instance
  const [mediaList, setMediaList] = useState([]); // List of media items (videos and scripts)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0); // Index of the currently selected media item
  const [isPlaying, setIsPlaying] = useState(false); // Playback state
  const [text, setText] = useState('');

  // const handleSpeak = () => {
  //   speak(text);
  // }

  // function speak(text) {
  //   if (!('speechSynthesis' in window)) {
  //     alert("Sorry, your browser does not support text to speech!");
  //     return;
  //   }
  
  //   const utterance = new SpeechSynthesisUtterance(text);
  
  //   // Get the list of available voices
  //   const voices = speechSynthesis.getVoices();
  
  //   // Choose a voice that is likely to be more sensual
  //   // This part is subjective, so you might need to experiment with different voices
  //   const selectedVoice = voices.find(voice => voice.name === 'Google UK English Female') || voices[0];
  
  //   // Set the voice
  //   utterance.voice = selectedVoice;
  
  //   // Adjust pitch and rate for a more sensual effect
  //   utterance.pitch = 0.8; // 0 to 2 (default is 1)
  //   utterance.rate = 0.85; // 0.1 to 10 (default is 1)
  //   utterance.volume = 1; // 0 to 1 (default is 1)
  
  //   speechSynthesis.speak(utterance);
  // }

  // Function to handle file uploads
  function handleFileUpload(event, type) {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaList((prevMediaList) => {
        const newMediaList = [...prevMediaList];
        newMediaList[currentMediaIndex] = { ...newMediaList[currentMediaIndex], [type]: url };
        return newMediaList;
      });

      if (type === 'script') {
        const reader = new FileReader();
        reader.onload = async () => {
          const script = reader.result;
          await uploadAndSetScript(script);
        };
        reader.readAsText(file);
      }
    }
  }

  useEffect(() => {
    const initHandy = async () => {
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
    };

    if (connectionKey) {
      initHandy();
    }

    return () => {
      if (handy) {
        console.log('Disconnecting Handy...');
        handy.disconnect();
      }
    };
  }, [connectionKey]);

  const uploadAndSetScript = async (script) => {
    try {
      // Upload the script
      const scriptData = await Handy.uploadDataToServer(script);
      setMediaList((prevMediaList) => {
        const newMediaList = [...prevMediaList];
        newMediaList[currentMediaIndex] = { ...newMediaList[currentMediaIndex], scriptUrl: scriptData };
        return newMediaList;
      });

      // Set the script in Handy
      await handy.setScript(scriptData);
      console.log('Script uploaded and set successfully.');
    } catch (error) {
      console.error('Failed to upload or set script:', error);
    }
  };

  const handlePlayPause = async (play) => {
    const { scriptUrl, videoUrl } = mediaList[currentMediaIndex];

    if (!scriptUrl) {
      console.error('No script set. Please upload a script first.');
      return;
    }

    const videoElement = document.getElementById('video-player');

    if (play) {
      try {
        await handy.setScript(scriptUrl);
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
    if (mediaList[index]?.scriptUrl) {
      await handy.setScript(mediaList[index].scriptUrl);
      console.log('Script set for selected media.');
    }
  };

  const addNewMedia = () => {
    setMediaList((prevMediaList) => [...prevMediaList, { script: '', video: '' }]);
    setCurrentMediaIndex(mediaList.length);
  };

  useEffect(() => {
    const videoElement = document.getElementById('video-player');
    if (videoElement) {
      const handleVideoEnd = async () => {
        const nextIndex = (currentMediaIndex + 1) % mediaList.length;
        setCurrentMediaIndex(nextIndex);
        if (mediaList[nextIndex]?.scriptUrl) {
          await handy.setScript(mediaList[nextIndex].scriptUrl);
          console.log('Script set for next media.');
          
          // Ensure the script is set before playing
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1000ms
          handlePlayPause(true); // Start playing the next video and script
        }
      };

      videoElement.addEventListener('ended', handleVideoEnd);

      return () => {
        videoElement.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [currentMediaIndex, mediaList, handy]);

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
        <input type="file" id="script-input" onChange={(e) => handleFileUpload(e, 'script')} accept="" />
        <label htmlFor="script-input">Choose Script</label>
      </div>

      <div className="file-input-wrapper">
        <input type="file" id="video-input" onChange={(e) => handleFileUpload(e, 'video')} accept="video/*" />
        <label htmlFor="video-input">Choose Video</label>
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

      <div className="media-selection">
        {mediaList.map((media, index) => (
          <button key={index} onClick={() => handleMediaSelection(index)}>
            Video {index + 1}
          </button>
        ))}
        <button onClick={addNewMedia}>Add New Media</button>
      </div>
      {/* <div>
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak"
      />
      <button onClick={handleSpeak}>Speak</button>
    </div> */}
    </div>
  );
}

export default HandyVideoSync;
