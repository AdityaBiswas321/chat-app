// Main App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage"; // Main chat component
import VideoScriptPlayer from "./pages/VideoScriptPlayer.js"; // Small app component
import AudioInteract from './pages/AudioInteract'; // Import the new AudioInteract page

import "./App.css";

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  const navigate = useNavigate();

  const handleChatClick = () => {
    if (clickTimer) {
      clearTimeout(clickTimer); // Reset the timer if clicked within the time frame
    }

    setClickCount(prevCount => {
      const newCount = prevCount + 1;
      if (newCount === 3) {
        navigate("/video-script"); // Redirect after 3 clicks within time frame
        setClickCount(0); // Reset click count after redirection
      }
      return newCount;
    });

    // Set a 5-second timer to reset click count if there are no clicks within this period
    setClickTimer(setTimeout(() => {
      setClickCount(0);
    }, 5000));
  };

  useEffect(() => {
    return () => clearTimeout(clickTimer); // Cleanup timer on component unmount
  }, [clickTimer]);

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav>
        <ul>
          <li><Link to="/" onClick={handleChatClick}>Chat with Handy-LLM</Link></li>
          {/* The VideoScriptPlayer link is hidden from the UI */}
          <li><Link to="/audio-interact">Hands-Free Audio Interaction</Link></li> {/* New link for AudioInteract */}
        </ul>
      </nav>

      {/* Routes for each page */}
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/video-script" element={<VideoScriptPlayer />} />
        <Route path="/audio-interact" element={<AudioInteract />} /> {/* New route for AudioInteract */}
      </Routes>
    </div>
  );
}

export default App;
