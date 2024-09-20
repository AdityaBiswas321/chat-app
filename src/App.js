import React, { useState } from 'react';
import HandyVideoSync from './components/HandyVideoSync.js';
import LLMConnector from './components/AI';
import './App.css'; // Add custom styling

function App() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [apiCallCount, setApiCallCount] = useState(0); // Counter to track AI API calls

  // Handle category selection and increment the API call counter
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setApiCallCount((prevCount) => prevCount + 1); // Increment the counter on every API call
  };

  return (
    <div className="App">
      <h1>Video-Script Player with AI</h1>

      {/* LLMConnector handles the AI interaction */}
      <LLMConnector onCategorySelect={handleCategorySelect} />

      {/* HandyVideoSync plays the videos based on the AI's selected category */}
      <HandyVideoSync selectedCategory={selectedCategory} apiCallCount={apiCallCount} />
    </div>
  );
}

export default App;
