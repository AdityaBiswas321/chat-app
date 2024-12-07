import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import AvailableCharacters from "../components/Character/AvailableCharacters"; // Import new component
import "../CSS/characterimport.css";

function CharacterImport() {
  const { characters, deleteCharacter, setSelectedCharacter } = useAppContext();
  const navigate = useNavigate();
  const [expandedCharacter, setExpandedCharacter] = useState(null); // Track expanded description

  const nonDeletableCharacters = ["characterbuilder", "mistress", "teacher", "therapist"]; // Characters that can't be deleted

  const handleCharacterSelect = (characterKey, type) => {
    setSelectedCharacter(characterKey);
    const path = type === "chat" ? `/chat/${characterKey}` : `/audio/${characterKey}`;
    navigate(path);
  };

  const handleDeleteCharacter = (characterKey) => {
    if (nonDeletableCharacters.includes(characterKey)) {
      alert("This character cannot be deleted.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this character?")) {
      deleteCharacter(characterKey);
    }
  };

  const toggleReadMore = (characterKey) => {
    setExpandedCharacter((prev) => (prev === characterKey ? null : characterKey));
  };

  const handleCharacterClick = (characterKey) => {
    navigate(`/character-details/${characterKey}`);
  };

  return (
    <div className="App">
      <div className="character-import-page">
        <header className="character-import-header">
          <h1>Character Management</h1>
          <p>Manage default characters and import new ones for interaction.</p>
        </header>

        {/* Default Characters */}
        <h2>Default Characters</h2>
        <div className="character-list">
          {Object.entries(characters).map(([key, character]) => (
            <div
              key={key}
              className="character-card"
              onClick={() => handleCharacterClick(key)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={character.image || "default.jpg"} // Use default image if none provided
                alt={`${character.name} image`}
                className="character-image"
              />
              <h3 className="character-name">{character.name}</h3>
              <p className="character-personality">
                <strong>Traits:</strong> {character.personalityTraits?.join(", ") || "N/A"}
              </p>
              <p className="character-background">
                {expandedCharacter === key
                  ? (
                    <>
                      <strong>Background:</strong> {character.backgroundStory || "N/A"}<br />
                      <strong>Interaction Type:</strong> {character.interactionType || "N/A"}<br />
                      <strong>Goals:</strong> {character.goals || "N/A"}<br />
                      <strong>Reaction Style:</strong> {character.reactionStyle || "N/A"}
                    </>
                  )
                  : `${character.backgroundStory.substring(0, 100)}...`}
                <span
                  className="read-more"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReadMore(key);
                  }}
                >
                  {expandedCharacter === key ? " Show Less" : " Read More"}
                </span>
              </p>
              <div className="character-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCharacterSelect(key, "chat");
                  }}
                >
                  Chat
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCharacterSelect(key, "audio");
                  }}
                >
                  Audio
                </button>
                {!nonDeletableCharacters.includes(key) && (
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCharacter(key);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Available Characters */}
        <AvailableCharacters
          expandedCharacter={expandedCharacter}
          toggleReadMore={toggleReadMore}
        />
      </div>
    </div>
  );
}

export default CharacterImport;
