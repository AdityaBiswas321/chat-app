import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext"; // Import context
import styles from "../Chat/ChatAppComponents.module.css";
import { HANDY_COMMANDS } from "../Character/CharacterPrompts"; // Import default commands

const CharacterManager = () => {
  const {
    characters,
    selectedCharacter,
    setSelectedCharacter,
    addCharacter,
    updateCharacter,
    deleteCharacter,
  } = useAppContext(); // Use context

  const [newCharacterName, setNewCharacterName] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [customCommands, setCustomCommands] = useState("");
  const [isEditing, setIsEditing] = useState(true);

  // Update fields when a character is selected
  useEffect(() => {
    if (isEditing) {
      const selected = characters[selectedCharacter] || {};
      setCustomPrompt(selected.prompt || "");
      setCustomCommands(selected.commands || "");
      setNewCharacterName(selected.name || "");
    }
  }, [selectedCharacter, characters, isEditing]);

  const handleCharacterSelect = (e) => {
    setSelectedCharacter(e.target.value); // Update context state
    setIsEditing(true); // Reset to edit mode
  };

  const handleNewCharacterNameChange = (e) => {
    setNewCharacterName(e.target.value);
  };

  const handleCustomPromptChange = (e) => {
    setCustomPrompt(e.target.value);
  };

  const handleCustomCommandsChange = (e) => {
    setCustomCommands(e.target.value);
  };

  const handleAddOrUpdateCharacter = () => {
    if (isEditing) {
      // Update character if in edit mode
      const updatedCharacter = {
        ...characters[selectedCharacter],
        prompt: customPrompt,
        commands: customCommands,
      };
      updateCharacter(selectedCharacter, updatedCharacter);
    } else {
      // Add new character
      const newCharacter = {
        name: newCharacterName,
        prompt: customPrompt,
        commands: customCommands,
      };
      addCharacter(newCharacter);
      setSelectedCharacter(newCharacterName); // Set the newly added character as selected
      setIsEditing(true); // Switch to edit mode after adding the character
    }
  };

  const handleDeleteCharacter = () => {
    if (selectedCharacter === "mistress") {
      alert("Default characters can't be deleted.");
      return;
    }
    deleteCharacter(selectedCharacter);
    setSelectedCharacter("mistress"); // Reset to default character after deletion
  };

  const handleSwitchToAddMode = () => {
    // Clear fields and switch to Add Mode
    setNewCharacterName("");
    setCustomPrompt("");
    setCustomCommands(HANDY_COMMANDS); // Prepopulate with default commands
    setIsEditing(false); // Switch to Add Mode
  };

  return (
    <div className={styles["character-manager"]}>
      <h3>Select Character:</h3>
      <select value={selectedCharacter} onChange={handleCharacterSelect}>
        {Object.keys(characters).map((key) => (
          <option key={key} value={key}>
            {characters[key].name}
          </option>
        ))}
      </select>

      <h3>{isEditing ? `Edit Character: ${newCharacterName}` : "Add New Character"}</h3>
      <input
        type="text"
        placeholder="Character Name"
        value={newCharacterName}
        onChange={handleNewCharacterNameChange}
        disabled={isEditing}
      />
      <textarea
        placeholder="Custom Prompt"
        value={customPrompt}
        onChange={handleCustomPromptChange}
        rows="4"
      />
      <textarea
        placeholder="Custom Commands"
        value={customCommands}
        onChange={handleCustomCommandsChange}
        rows="4"
      />
      <button onClick={handleAddOrUpdateCharacter}>
        {isEditing ? "Update Character" : "Add Character"}
      </button>
      <button onClick={handleSwitchToAddMode}>Add New Character</button>

      {isEditing && (
        <div>
          <h3>Delete Character</h3>
          <button onClick={handleDeleteCharacter}>
            Delete {characters[selectedCharacter]?.name}
          </button>
        </div>
      )}
    </div>
  );
};

export default CharacterManager;
