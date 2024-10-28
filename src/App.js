// Main App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ChatPage from "./pages/ChatPage"; // Main chat component
import VideoScriptPlayer from "./pages/VideoScriptPlayer.js"; // Small app component
import AudioInteract from './pages/AudioInteract'; // Import the new AudioInteract page

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav>
          <ul>
            <li><Link to="/">Chat with Handy-LLM</Link></li>
            <li><Link to="/video-script">Video-Script Player with AI</Link></li>
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
    </Router>
  );
}

export default App;
