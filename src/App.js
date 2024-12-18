import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import VideoScriptPlayer from "./pages/VideoScriptPlayer";
import AudioInteract from "./pages/AudioInteract";
import UncensoredChatPage from "./pages/Uncensoredchatpage";
import CharacterImport from "./pages/CharacterImport";
import FunctionEditor from "./pages/FunctionEditor";
import CharacterDetails from "./pages/CharacterDetails.js";
import { AppProvider } from "./context/AppContext";
import LocalConnector from "./pages/LocalPage";
import "./CSS/App.css";
import "./CSS/navbar.css";

function App() {
  return (
    <AppProvider>
      <Router>
        <MainApp />
      </Router>
    </AppProvider>
  );
}

function MainApp() {
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle "Chat with Handy-LLM" triple click logic
  const handleChatClick = () => {
    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    setClickCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 3) {
        navigate("/video-script");
        setClickCount(0);
      }
      return newCount;
    });

    setClickTimer(
      setTimeout(() => {
        setClickCount(0);
      }, 5000)
    );
  };

  useEffect(() => {
    return () => clearTimeout(clickTimer);
  }, [clickTimer]);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Close the menu when a link is clicked
  };

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav>
        {/* Hamburger Menu */}
        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <li>
            <Link
              to="/"
              onClick={() => {
                handleChatClick();
                closeMenu();
              }}
            >
              Chat with Handy-LLM
            </Link>
          </li>
          <li>
            <Link to="/audio-interact" onClick={closeMenu}>
              Hands-Free Audio LLM
            </Link>
          </li>
          <li>
            <Link to="/character-import" onClick={closeMenu}>
              Character Import
            </Link>
          </li>
          <li>
            <Link to="/uncensored-chat" onClick={closeMenu}>
              Uncensored Chat
            </Link>
          </li>
        </ul>

        {/* Settings Dropdown */}
        <div
          className={`settings-dropdown ${isDropdownVisible ? "open" : ""}`}
          onClick={toggleDropdown}
        >
          <div className="settings-icon" title="Settings">
            ⚙️
          </div>
          <ul className="dropdown-menu">
            <li>
              <Link to="/function-editor" onClick={closeMenu}>
                Edit Functions
              </Link>
            </li>
            <li>
              <Link to="/local-connector" onClick={closeMenu}>
                Local Connector
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Routes for each page */}
      <div className="content-container">
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/video-script" element={<VideoScriptPlayer />} />
          <Route path="/audio-interact" element={<AudioInteract />} />
          <Route path="/uncensored-chat" element={<UncensoredChatPage />} />
          <Route path="/character-import" element={<CharacterImport />} />
          <Route path="/function-editor" element={<FunctionEditor />} />
          <Route path="/chat/:characterKey" element={<ChatPage />} />
          <Route path="/audio/:characterKey" element={<AudioInteract />} />
          <Route
            path="/character-details/:characterKey"
            element={<CharacterDetails />}
          />
          <Route path="/local-connector" element={<LocalConnector />} />
          {/* New Route */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
