// Main App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ChatPage from "./pages/ChatPage"; // Main chat component
import VideoScriptPlayer from "./pages/VideoScriptPlayer.js"; // Small app component
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
          </ul>
        </nav>

        {/* Routes for each page */}
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/video-script" element={<VideoScriptPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
