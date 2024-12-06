import React, { useEffect, useState } from "react";
import * as Handy from "@ohdoki/handy-sdk";
import {
  gentlePat,
  gentleStroke,
  firmGrip,
  handleDeny,
  handleStop,
  rapidHeadStroke,
  mouthCommand,
  threateningGrip,
  ultimateDrain,
  soothingTouch,
  punishPulse,
  slowAgonyStroke,
  baseGrip,
  initialSeizure,
  relentlessStroke,
  punishingSqueeze,
} from "./HandyFunctions";
import { useAppContext } from "../../context/AppContext";
import styles from "./ChatAppComponents.module.css";

function HandyController({ selectedCategory, apiCallCount }) {
  const { connectionKey, setConnectionKey, functionParameters } =
    useAppContext();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [handy, setHandy] = useState(null);
  const [intensity, setIntensity] = useState(50); // Default intensity set to 50%
  const [baselineVelocity, setBaselineVelocity] = useState(50); // Baseline velocity for current function

  const MIN_INTENSITY = 1; // Minimum velocity
  const MAX_INTENSITY = 90; // Maximum velocity
  const INTENSITY_STEP = 2.5; // Increment/Decrement step size

  // Reset intensity and baseline velocity when a new function is triggered
  useEffect(() => {
    if (selectedCategory) {
      const initialVelocity =
        functionParameters[selectedCategory]?.velocity || 50; // Use function's velocity or default to 50
      setBaselineVelocity(initialVelocity);
      setIntensity(initialVelocity); // Reset intensity to match the baseline
      console.log(
        `Intensity reset to ${initialVelocity}% for new function: ${selectedCategory}`
      );
    }
  }, [selectedCategory, functionParameters]);

  // Function to initialize Handy and reconnect if disconnected
  const initHandy = async () => {
    if (!handy) {
      const newHandy = Handy.init();
      setHandy(newHandy);
    }

    try {
      if (handy && connectionKey) {
        setIsConnecting(true);
        setConnectionError(""); // Clear previous errors

        const storedKey = await handy.getStoredKey();
        if (!isConnected || (storedKey && storedKey !== connectionKey)) {
          await handy.connect(connectionKey);
          await handy.setMode(2); // Ensure HAMP mode is enabled
          setIsConnected(true);
          console.log("Handy connected and set to HAMP mode!");
        }
      }
    } catch (error) {
      console.error("Failed to initialize or connect Handy:", error);
      setConnectionError(
        "Could not connect to Handy. Please check your connection key."
      );
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
        // Stop motion and reset Handy settings
        await handy.hampStop();
        await new Promise((resolve) => setTimeout(resolve, 300));
        await handy.setStrokeZone({ min: 0, max: 100 });
        await handy.setHampVelocity(50); // Reset to 50% velocity
        await handy.hdsp(0, 10, "percent", "percent", true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await handy.disconnect(true); // Clear all states on disconnect
        setIsConnected(false);
        console.log("Handy disconnected and reset");
      } catch (error) {
        console.error("Failed to reset settings or disconnect:", error);
      }
    }
  };

  // Handle LLM category selection
  useEffect(() => {
    if (!handy || !isConnected) {
      console.error("Handy is not connected. Skipping action.");
      return;
    }

    const actionsWithoutParameters = ["stop"];

    if (
      !actionsWithoutParameters.includes(selectedCategory) &&
      (!functionParameters || !functionParameters[selectedCategory])
    ) {
      console.error(
        `Error: Missing parameters for ${selectedCategory}. Cannot trigger function.`
      );
      return;
    }

    switch (selectedCategory) {
      case "gentlePat":
        gentlePat(handy, isConnected, functionParameters.gentlePat);
        break;
      case "gentleStroke":
        gentleStroke(handy, isConnected, functionParameters.gentleStroke);
        break;
      case "firmGrip":
        firmGrip(handy, isConnected, functionParameters.firmGrip);
        break;
      case "deny":
        handleDeny(handy, isConnected, functionParameters.deny);
        break;
      case "stop":
        handleStop(handy, isConnected);
        break;
      case "rapidHeadStroke":
        rapidHeadStroke(handy, isConnected, functionParameters.rapidHeadStroke);
        break;
      case "mouthCommand":
        mouthCommand(handy, isConnected, functionParameters.mouthCommand);
        break;
      case "threateningGrip":
        threateningGrip(handy, isConnected, functionParameters.threateningGrip);
        break;
      case "ultimateDrain":
        ultimateDrain(handy, isConnected, functionParameters.ultimateDrain);
        break;
      case "soothingTouch":
        soothingTouch(handy, isConnected, functionParameters.soothingTouch);
        break;
      case "punishPulse":
        punishPulse(handy, isConnected, functionParameters.punishPulse);
        break;
      case "slowAgonyStroke":
        slowAgonyStroke(handy, isConnected, functionParameters.slowAgonyStroke);
        break;
      case "baseGrip":
        baseGrip(handy, isConnected, functionParameters.baseGrip);
        break;
      case "initialSeizure":
        initialSeizure(handy, isConnected, functionParameters.initialSeizure);
        break;
      case "relentlessStroke":
        relentlessStroke(
          handy,
          isConnected,
          functionParameters.relentlessStroke
        );
        break;
      case "punishingSqueeze":
        punishingSqueeze(
          handy,
          isConnected,
          functionParameters.punishingSqueeze
        );
        break;
      default:
        console.error("Unknown action:", selectedCategory);
    }
  }, [selectedCategory, apiCallCount, isConnected, functionParameters]);

  // Adjust intensity based on the baseline velocity
  const adjustIntensity = async (step) => {
    const newIntensity = Math.max(
      MIN_INTENSITY,
      Math.min(MAX_INTENSITY, intensity + step) // Use current intensity as baseline
    );
    setIntensity(newIntensity); // Update intensity state
    setBaselineVelocity(newIntensity); // Update baseline velocity

    if (handy && isConnected) {
      try {
        await handy.setHampVelocity(newIntensity);
        console.log(`Handy velocity adjusted to ${newIntensity}%`);
      } catch (error) {
        console.error("Error adjusting intensity:", error);
      }
    } else {
      console.warn("Handy is not connected. Cannot adjust intensity.");
    }
  };

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
          {isConnecting ? "Connecting..." : "Connect"}
        </button>
        <button onClick={handleDisconnect} disabled={isConnecting}>
          Disconnect & Reset
        </button>
        <span
          className={`${styles["connection-status-icon"]} ${
            isConnected ? styles.connected : styles.disconnected
          }`}
        >
          {isConnected ? "✅" : "❌"}
        </span>
        {connectionError && (
          <p className={styles["error-message"]}>{connectionError}</p>
        )}
      </div>
      <div style={{ textAlign: "center", margin: "1rem 0" }}>
        <h3>Adjust Device Intensity</h3>
        <button
          onClick={() => adjustIntensity(-INTENSITY_STEP)} // Decrease by 2.5%
          style={{ marginRight: "1rem", fontSize: "20px" }}
        >
          ↓
        </button>
        <span style={{ fontSize: "1.5rem" }}>{intensity}%</span>
        <button
          onClick={() => adjustIntensity(INTENSITY_STEP)} // Increase by 2.5%
          style={{ marginLeft: "1rem", fontSize: "20px" }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}

export default HandyController;
