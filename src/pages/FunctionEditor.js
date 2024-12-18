import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
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
} from "../components/Chat/HandyFunctions";
import * as Handy from "@ohdoki/handy-sdk";
import "../CSS/FunctionEditor.css";

const FunctionEditor = () => {
  const {
    functionParameters,
    updateFunctionParameters,
    connectionKey,
    setConnectionKey,
  } = useAppContext();
  const [selectedFunction, setSelectedFunction] = useState("");
  const [parameters, setParameters] = useState({ min: 0, max: 100, velocity: 10 });
  const [handy, setHandy] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  // Initialize Handy connection
  const initHandy = async () => {
    if (!handy) {
      const newHandy = Handy.init();
      setHandy(newHandy);
    }

    try {
      if (handy && connectionKey) {
        setIsConnecting(true);
        setConnectionError("");

        const storedKey = await handy.getStoredKey();
        if (!isConnected || (storedKey && storedKey !== connectionKey)) {
          await handy.connect(connectionKey);
          setIsConnected(true);
          console.log("Handy connected!");
        }
      }
    } catch (error) {
      console.error("Failed to connect Handy:", error);
      setConnectionError("Could not connect to Handy. Please check your connection key.");
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    initHandy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionKey, handy]);

  const handleConnectClick = () => {
    if (connectionKey && !isConnected) {
      initHandy();
    }
  };

  const handleDisconnect = async () => {
    if (handy && isConnected) {
      try {
        await handy.hampStop();
        await handy.setStrokeZone({ min: 0, max: 100 });
        await handy.setHampVelocity(50);
        await handy.disconnect(true);
        setIsConnected(false);
        console.log("Handy disconnected");
      } catch (error) {
        console.error("Failed to disconnect Handy:", error);
      }
    }
  };

  // Handle function selection
  const handleFunctionSelect = (e) => {
    const selected = e.target.value;
    setSelectedFunction(selected);
    setParameters(functionParameters[selected]); // Load parameters for selected function
  };

  // Handle slider changes for parameters
  const handleParameterChange = (e) => {
    const { name, value } = e.target;

    setParameters((prev) => {
      const newParams = { ...prev, [name]: Number(value) };

      // Ensure Min cannot exceed Max and vice versa
      if (name === "min" && newParams.min > newParams.max) {
        newParams.max = newParams.min;
      } else if (name === "max" && newParams.max < newParams.min) {
        newParams.min = newParams.max;
      }

      return newParams;
    });
  };

  // Update function parameters in context and local storage
  const handleUpdateFunction = () => {
    if (selectedFunction) {
      updateFunctionParameters(selectedFunction, parameters);
      alert(`Parameters for ${selectedFunction} updated successfully!`);
    }
  };

  // Test a specific function
  const handleTestFunction = async (funcName) => {
    if (!handy || !isConnected) {
      console.error("Handy is not connected. Cannot test function.");
      return;
    }

    const currentParameters = functionParameters[funcName];
    if (!currentParameters) {
      console.error(`Parameters for ${funcName} not found.`);
      return;
    }

    // Dynamically call the respective function
    switch (funcName) {
      case "gentlePat":
        await gentlePat(handy, isConnected, currentParameters);
        break;
      case "gentleStroke":
        await gentleStroke(handy, isConnected, currentParameters);
        break;
      case "firmGrip":
        await firmGrip(handy, isConnected, currentParameters);
        break;
      case "rapidHeadStroke":
        await rapidHeadStroke(handy, isConnected, currentParameters);
        break;
      case "mouthCommand":
        await mouthCommand(handy, isConnected, currentParameters);
        break;
      case "threateningGrip":
        await threateningGrip(handy, isConnected, currentParameters);
        break;
      case "ultimateDrain":
        await ultimateDrain(handy, isConnected, currentParameters);
        break;
      case "soothingTouch":
        await soothingTouch(handy, isConnected, currentParameters);
        break;
      case "punishPulse":
        await punishPulse(handy, isConnected, currentParameters);
        break;
      case "slowAgonyStroke":
        await slowAgonyStroke(handy, isConnected, currentParameters);
        break;
      case "baseGrip":
        await baseGrip(handy, isConnected, currentParameters);
        break;
      case "initialSeizure":
        await initialSeizure(handy, isConnected, currentParameters);
        break;
      case "relentlessStroke":
        await relentlessStroke(handy, isConnected, currentParameters);
        break;
      case "punishingSqueeze":
        await punishingSqueeze(handy, isConnected, currentParameters);
        break;
      default:
        console.error("Unknown function:", funcName);
    }
  };

  // Stop Handy motion
  const handleStopFunction = () => {
    if (!handy || !isConnected) {
      console.error("Handy is not connected. Cannot stop function.");
      return;
    }
    handleStop(handy, isConnected);
  };

  // Reset everything to defaults
  const handleResetToDefaults = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="function-editor-container">
      {/* Function List */}
      <div className="function-list">
        <h2>Function List</h2>
        <ul>
          {Object.entries(functionParameters).map(([funcName, params]) => (
            <li key={funcName}>
              <strong>{funcName}</strong>
              <span>Min: {params.min}</span>
              <span>Max: {params.max}</span>
              <span>Velocity: {params.velocity}</span>
              <button onClick={() => handleTestFunction(funcName)}>Test</button>
              <button onClick={handleStopFunction}>Stop</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Function Editor */}
      <div className="function-editor">
        {/* Connection Management */}
        <div className="connection-management">
          <input
            type="text"
            value={connectionKey}
            onChange={(e) => setConnectionKey(e.target.value)}
            placeholder="Enter Handy Connection Key"
          />
          <button onClick={handleConnectClick} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect"}
          </button>
          <button onClick={handleDisconnect} disabled={!isConnected}>
            Disconnect
          </button>
          <span
            className={`connection-status ${isConnected ? "connected" : "disconnected"}`}
          >
            {isConnected ? "✅ Connected" : "❌ Disconnected"}
          </span>
          {connectionError && <p className="error">{connectionError}</p>}
        </div>
        <h1>Function Editor</h1>
        <label htmlFor="function-select">Select a Function:</label>
        <select
          id="function-select"
          onChange={handleFunctionSelect}
          value={selectedFunction}
        >
          <option value="" disabled>
            Select a function
          </option>
          {Object.keys(functionParameters).map((funcName) => (
            <option key={funcName} value={funcName}>
              {funcName}
            </option>
          ))}
        </select>

        {selectedFunction && (
          <div className="parameter-editor">
            <h2>Edit Parameters for {selectedFunction}</h2>
            <div className="range-slider">
              <label className="slider-label">
                Min - Max: {parameters.min} - {parameters.max}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={parameters.min}
                name="min"
                onChange={handleParameterChange}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={parameters.max}
                name="max"
                onChange={handleParameterChange}
              />
              <div
                className="range-track"
                style={{
                  left: `${parameters.min}%`,
                  right: `${100 - parameters.max}%`,
                }}
              />
            </div>
            <div>
              <label>
                Velocity: {parameters.velocity}
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={parameters.velocity}
                name="velocity"
                onChange={handleParameterChange}
              />
            </div>
            <button onClick={handleUpdateFunction}>Update Function</button>
            
          </div>
        )}
      </div>
      <button
              onClick={handleResetToDefaults}
              style={{
                marginTop: "10px",
                backgroundColor: "#f44336",
                color: "#fff",
              }}
            >
              Reset App
            </button>
    </div>
  );
};

export default FunctionEditor;
