import React, { useState } from "react";
import LLMConnector from "../components/Uncensored/uncensored_ai.js"; // Reusing the AI component
// import "../App.css";

function UncensoredChatPage() {
  const [apiKey, setApiKey] = useState(""); // State for storing the API key
  const [isKeyValid, setIsKeyValid] = useState(false); // Tracks if the API key is valid
  const [serverMessage, setServerMessage] = useState(""); // Error messages from the server

  // Function to validate the API key
  const validateKey = async () => {
    if (!apiKey) {
      setServerMessage("Please enter an API key.");
      return;
    }
    try {
      // Validate key with backend
      const response = await fetch("http://localhost:3000/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        setIsKeyValid(true);
        setServerMessage("");
      } else {
        const data = await response.json();
        setServerMessage(data.error || "Invalid API key.");
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      setServerMessage("Failed to validate API key. Please try again.");
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Uncensored Handy Augmented Chat - Underdevelopment</h1>
      </div>

      {/* {!isKeyValid ? (
        // Display API key input screen
        <div className="api-key-input">
          <h3>Enter Your Uncensored API Key</h3>
          <input
            type="text"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button onClick={validateKey}>Validate Key</button>
          {serverMessage && <p className="error-message">{serverMessage}</p>}
        </div>
      ) : (
        // Once validated, load the chat component
        <LLMConnector apiKey={apiKey} />
      )} */}
    </div>
  );
}

export default UncensoredChatPage;
