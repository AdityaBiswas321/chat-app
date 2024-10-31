import React, { useState } from "react";
import AI_Audio from "../components/Audio/AI_audio";
import HandyController from "../components/Chat/Hardcode";
import "../App.css"; // Import App.css for styling

function HandsFreeChatApp() {
  const [selectedCategory, setSelectedCategory] = useState(""); // Command keyword for HandyController
  const [responseText, setResponseText] = useState(""); // Store LLM response text
  const [apiCallCount, setApiCallCount] = useState(0); // Counter to track API calls
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle detected commands from AI_Audio component
  const handleCommandDetection = (command) => {
    console.log("Command detected:", command);
    setSelectedCategory(command); // Update the command for HandyController
    setApiCallCount((prevCount) => prevCount + 1); // Increment the API call counter
  };

  // Handle LLM response text from AI_Audio
  const handleLLMResponse = (response) => {
    setResponseText(response); // Update response text to display on UI
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="App">
      <div className="header">
        <h1>Hands-Free LLM Chat</h1>
        <span className="help-icon" onClick={toggleModal}>?</span>
      </div>

      {/* Handy Controller to activate commands */}
      <HandyController
        selectedCategory={selectedCategory} // Command passed from detected command in AI_Audio
        apiCallCount={apiCallCount} // Track number of API calls
      />

      {/* AI_Audio: Handles audio input and response */}
      <AI_Audio
        onCategorySelect={handleCommandDetection} // Process detected commands
        onLLMResponse={handleLLMResponse} // Process LLM response text
      />

      {/* Display LLM Response */}
      <div className="response-section">
        {responseText && <p>LLM Response: {responseText}</p>}
      </div>

      {/* Modal for Instructions */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>How to Use the Hands-Free LLM Chat</h2>
            <p>Instructions for hands-free interaction:</p>
            <ul>
              <li>Click the "Listen" button to start listening for your voice commands.</li>
              <li>Speak your question or command to the LLM, and it will respond audibly.</li>
              <li>The app will automatically listen again after responding, for continuous hands-free interaction.</li>
              <li>Click the "Listen" button again to stop listening mode.</li>
            </ul>
            <button onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HandsFreeChatApp;
