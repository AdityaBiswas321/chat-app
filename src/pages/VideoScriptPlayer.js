import React, { useState } from "react";
import LLMConnectorVideo from "../components/Video/AI_Video";
import HandyVideoSync from "../components/Video/HandyVideoSync"; // The new HandyController component
// import "../App.css"; // All styling is in App.css

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [apiCallCount, setApiCallCount] = useState(0); // Counter to track AI API calls
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Handle category selection and increment the API call counter
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setApiCallCount((prevCount) => prevCount + 1); // Increment the counter on every API call
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen); // Toggle modal visibility

  return (
    <div className="App">
      <div className="header">
        <h1>Video-Script Player with AI</h1>
        <span className="help-icon" onClick={toggleModal}>?</span>
      </div>

      <div className="main-layout">
        {/* Left Panel */}
        <div className="left-panel">
          <LLMConnectorVideo onCategorySelect={handleCategorySelect} />
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <HandyVideoSync
            selectedCategory={selectedCategory}
            apiCallCount={apiCallCount}
          />
        </div>
      </div>

      {/* Modal for Instructions */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>How to Use the Video-Script Player</h2>
            <p>Here are some basic instructions to get you started with the Video-Script Player:</p>
            <ul>
              <li>AI activates video/scripts based on chat</li>
              <li>Select videos folder and corresponding scripts folder</li>
              <li>Ensure the video and script names match</li>
              <li>Categorize the videos to allow the LLM to activate them</li>
              <li>Play/Pause only works with green button</li>
            </ul>
            <button className="modal-button" onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
