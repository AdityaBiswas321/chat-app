// HandyController.js
import React, { useState, useEffect } from 'react';
import * as Handy from '@ohdoki/handy-sdk';
import { gentlePat, gentleStroke, firmGrip, handleDeny, handleStop, rapidHeadStroke, mouthCommand, threateningGrip, ultimateDrain, soothingTouch, punishPulse, slowAgonyStroke, baseGrip, initialSeizure, relentlessStroke, punishingSqueeze } from './HandyFunctions';
import styles from './ChatAppComponents.module.css';

function HandyController({ selectedCategory, apiCallCount }) {
  const [connectionKey, setConnectionKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [handy, setHandy] = useState(null);

  // Function to initialize Handy and reconnect if disconnected
  const initHandy = async () => {
    if (!handy) {
      const newHandy = Handy.init();
      setHandy(newHandy);
    }

    try {
      if (handy && connectionKey) {
        setIsConnecting(true);
        setConnectionError(''); // Clear previous errors

        const storedKey = await handy.getStoredKey();
        if (!isConnected || (storedKey && storedKey !== connectionKey)) {
          await handy.connect(connectionKey);
          setIsConnected(true);
          console.log('Handy connected!');
        }
      }
    } catch (error) {
      console.error('Failed to initialize or connect Handy:', error);
      setConnectionError('Could not connect to Handy. Please check your connection key.');
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  // Auto-reconnect mechanism, checking connection status periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isConnected && connectionKey && !isConnecting) {
        initHandy(); // Attempt to reconnect if disconnected
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, [isConnected, connectionKey, handy, isConnecting]);

  const handleConnectClick = () => {
    if (connectionKey && !isConnected) {
      initHandy();
    }
  };

  const handleDisconnect = async () => {
    if (handy && isConnected) {
      try {
        // Stop any ongoing motion
        await handy.hampStop();
  
        // Wait briefly to ensure motion stops
        await new Promise((resolve) => setTimeout(resolve, 300));
  
        // Reset stroke zone to full range (min to max)
        await handy.setStrokeZone({ min: 0, max: 100 });
  
        // Set a neutral velocity for comfort
        await handy.setHampVelocity(50);
  
        // Use `hdsp` to move the device to position 0% with a gentle speed, allowing a smooth transition
        await handy.hdsp(0, 10, 'percent', 'percent', true); // Set position to 0% with low speed
  
        // Wait briefly to ensure the position command takes effect
        await new Promise((resolve) => setTimeout(resolve, 500));
  
        console.log('Handy settings reset to default position and zone');
  
        // Disconnect Handy and clear stored states
        await handy.disconnect(true); // true to clear all states on disconnect
        setIsConnected(false);
        console.log('Handy disconnected');
      } catch (error) {
        console.error('Failed to reset settings or disconnect:', error);
      }
    } else {
      console.error('Handy is not connected or instance is invalid');
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

  // Handle LLM category selection (gentlePat/gentleStroke/firmGrip)
  useEffect(() => {
    if (!handy || !isConnected) {
      console.error('Handy is not connected. Skipping action.');
      return;
    }

    if (selectedCategory === 'gentlePat') {
      gentlePat(handy, isConnected);
    } else if (selectedCategory === 'gentleStroke') {
      gentleStroke(handy, isConnected);
    } else if (selectedCategory === 'firmGrip') {
      firmGrip(handy, isConnected);
    } else if (selectedCategory === 'deny') {
      handleDeny(handy, isConnected);
    } else if (selectedCategory === 'stop') {
      handleStop(handy, isConnected);
    } else if (selectedCategory === 'rapidHeadStroke') {
      rapidHeadStroke(handy, isConnected);
    } else if (selectedCategory === 'mouthCommand') {
      mouthCommand(handy, isConnected);
    } else if (selectedCategory === 'threateningGrip') {
      threateningGrip(handy, isConnected);
    } else if (selectedCategory === 'ultimateDrain') {
      ultimateDrain(handy, isConnected);
    } else if (selectedCategory === 'soothingTouch') {
      soothingTouch(handy, isConnected);
    } else if (selectedCategory === 'punishPulse') {
      punishPulse(handy, isConnected);
    } else if (selectedCategory === 'slowAgonyStroke') {
      slowAgonyStroke(handy, isConnected);
    } else if (selectedCategory === 'baseGrip') {
      baseGrip(handy, isConnected);
    } else if (selectedCategory === 'initialSeizure') {
      initialSeizure(handy, isConnected);
    } else if (selectedCategory === 'relentlessStroke') {
      relentlessStroke(handy, isConnected);
    } else if (selectedCategory === 'punishingSqueeze') {
      punishingSqueeze(handy, isConnected);
    }
  }, [apiCallCount, isConnected]); // Trigger the appropriate action whenever apiCallCount or connection status changes

  return (
    <div className={styles["handy-controller"]}>
      <div className={styles["connection-input-wrapper"]}>
        <input
          type="text"
          className={styles["connection-key-input"]}
          value={connectionKey}
          onChange={(e) => setConnectionKey(e.target.value)}
          placeholder="Enter Handy Connection Key"
        />
        <button onClick={handleConnectClick} disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect'}
        </button>
        <button onClick={handleDisconnect} disabled={isConnecting}>Disconnect & Reset</button>
        <span className={`${styles["connection-status-icon"]} ${isConnected ? styles.connected : styles.disconnected}`}>
          {isConnected ? '✅' : '❌'}
        </span>
        {connectionError && <p className={styles["error-message"]}>{connectionError}</p>}
      </div>
    </div>
  );
}

export default HandyController;
