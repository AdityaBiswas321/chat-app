import React, { useState } from "react";
import LLMConnector from "../components/Uncensored/uncensored_ai"; // Core AI component
import HandyController from "../components/Chat/Hardcode"; // Secondary component

function UncensoredChatPage() {
  const [selectedKeyword, setSelectedKeyword] = useState(""); // Keyword passed from LLMConnector
  const [apiCallCount, setApiCallCount] = useState(0); // Track the number of API calls
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal for instructions/help

  // Handle keyword selection from LLMConnector
  const handleKeywordSelect = (keyword) => {
    setSelectedKeyword(keyword);
    setApiCallCount((prevCount) => prevCount + 1); // Increment API call counter
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen); // Toggle modal visibility

  return (
    <div className="App">
      <div className="header">
        <h1>Uncensored Handy Augmented Chat</h1>
        <span className="help-icon" onClick={toggleModal}>?</span>
      </div>

      {/* HandyController receives the selected keyword and API call count */}
      <HandyController
        selectedKeyword={selectedKeyword}
        apiCallCount={apiCallCount}
      />

      {/* LLMConnector handles the AI interaction and passes keywords */}
      <LLMConnector onKeywordSelect={handleKeywordSelect} />

      {/* Modal for Instructions */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>How to Use the App</h2>
            <p>Welcome to Uncensored Handy Augmented Chat! Here are some basic instructions:</p>
            <ul>
              <li>Generate an API key to enable communication with the LLM.</li>
              <li>Enter your message and interact with the AI.</li>
              <li>Watch for keywords returned by the AI to control devices or trigger actions.</li>
            </ul>
            <button onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UncensoredChatPage;
