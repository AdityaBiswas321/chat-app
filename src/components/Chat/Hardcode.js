// HandyController.js
import React, { useState, useEffect } from 'react';
import * as Handy from '@ohdoki/handy-sdk';
import { gentlePat, gentleStroke, firmGrip, handleDeny, handleStop, rapidHeadStroke, mouthCommand, threateningGrip, ultimateDrain, soothingTouch, punishPulse, slowAgonyStroke, baseGrip, initialSeizure, relentlessStroke, punishingSqueeze } from './HandyFunctions';
import styles from './ChatAppComponents.module.css';



function HandyController({ selectedCategory, apiCallCount }) {
  const [connectionKey, setConnectionKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [handy, setHandy] = useState(null);

  // Function to initialize Handy and reconnect if disconnected
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
  }, [apiCallCount, isConnected]);  // Trigger the appropriate action whenever apiCallCount or connection status changes

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
      <button onClick={handleConnectClick}>Connect</button>
      <button onClick={handleDisconnect}>Disconnect & Reset</button>
      <span className={`${styles["connection-status-icon"]} ${isConnected ? styles.connected : styles.disconnected}`}>
        {isConnected ? '✅' : '❌'}
      </span>
    </div>
  </div>

  );
}

export default HandyController;
