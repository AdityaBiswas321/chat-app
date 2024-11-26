import React, { useState } from "react";
import LLMConnector from "../components/Chat/AI";
import HandyController from "../components/Chat/Hardcode";
// import "../App.css"; // Import App.css for styling

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
        <h1>Handy Augmented LLM Chat</h1>
        <span className="help-icon" onClick={toggleModal}>?</span>
      </div>

      <HandyController
        selectedCategory={selectedCategory}
        apiCallCount={apiCallCount}
      />

      <LLMConnector onCategorySelect={handleCategorySelect} />

      {/* Modal for Instructions */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>How to Use the App</h2>
            <p>Welcome to Handy Augmented LLM Chat! Here are some basic instructions to get you started:</p>
            <ul>
            <li>Enter your OpenAI API key to enable LLM functionality.</li>
            <li>Enter your Handy Connection Key to allow the LLM to interact with the Handy device.</li>
            <li>Choose a default character or create a new one.</li>
            <li>Start chatting and watch how the device responds.</li>
            </ul>
            <button onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
