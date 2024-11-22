import React, { useState } from "react";
import "../App.css";

function CharacterImport() {
  const [apiKey, setApiKey] = useState(""); // State for storing the API key
  const [isKeyValid, setIsKeyValid] = useState(false); // Tracks if the API key is valid
  const [serverMessage, setServerMessage] = useState(""); // Error messages from the server



  return (
    <div className="App">
      <div className="header">
        <h1>Import Pre-made characters</h1>
      </div>
      <h1>Underdevelopment</h1>

    </div>
  );
}

export default CharacterImport;
