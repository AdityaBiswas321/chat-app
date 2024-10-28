import React, { useState } from "react";
import AI_Audio from "../components/Audio/AI_audio";
import HandyController from "../components/Chat/Hardcode";
import "../App.css"; // Import App.css for styling

function HandsFreeChatApp() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // Command keyword for HandyController
  const [responseText, setResponseText] = useState(""); // Store LLM response text
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle listening state
  const toggleListening = () => setIsListening(!isListening);

  // Handle LLM response and convert to audio
  const handleLLMResponse = (response) => {
    setResponseText(response);
    setIsSpeaking(true); // Trigger speaking mode after receiving response
    setSelectedCategory(response);

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
        selectedCategory={selectedCategory} // Command passed from LLM response
      />

      {/* LLMConnector: Handles audio and LLM response */}
      <AI_Audio
        onLLMResponse={handleLLMResponse} // Process LLM response and detect commands
        isSpeaking={isSpeaking}
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
