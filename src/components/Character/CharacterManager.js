import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext"; // Import context
import "../../CSS/CharacterManager.css"; // Import new CSS

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
    const [characterImage, setCharacterImage] = useState("");

    // Update fields when a character is selected or editing mode changes
    useEffect(() => {
        if (isEditing && selectedCharacter && characters[selectedCharacter]) {
            console.log("Updating selected character fields");
            const selected = characters[selectedCharacter] || {};
            setCustomPrompt(selected.prompt || "");
            setCustomCommands(selected.commands || "");
            setNewCharacterName(selected.name || "");
        }

        // Update the character image whenever the selected character changes
        if (characters[selectedCharacter]?.image) {
            setCharacterImage(characters[selectedCharacter].image);
        } else {
            setCharacterImage("default.jpg"); // Fallback to a default image if none exists
        }
    }, [selectedCharacter, characters, isEditing]);

    const handleCharacterSelect = (e) => {
        setSelectedCharacter(e.target.value); // Update context state
        setIsEditing(true); // Switch to edit mode after selecting a character
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
        console.log("Triggered Add/Update Character");
        if (isEditing) {
            // Update character if in edit mode
            console.log("Editing Mode");
            const updatedCharacter = {
                ...characters[selectedCharacter],
                prompt: customPrompt,
                commands: customCommands,
            };
            updateCharacter(selectedCharacter, updatedCharacter);
        } else {
            // Add new character
            console.log("Add Mode");
            const newCharacter = {
                name: newCharacterName,
                prompt: customPrompt,
                commands: customCommands,
                image: "default.jpg", // Add default image for new characters
            };
            addCharacter(newCharacter);
            setSelectedCharacter(newCharacterName);
            setIsEditing(true); // Switch to edit mode after adding the character
        }
    };

    const handleDeleteCharacter = () => {
        console.log("Triggered Delete Character");
        if (["characterbuilder", "mistress", "teacher", "therapist"].includes(selectedCharacter)) {
            alert("Default characters can't be deleted.");
            return;
        }
        deleteCharacter(selectedCharacter);
        setSelectedCharacter("mistress"); // Reset to default character after deletion
        setIsEditing(true);
    };

    const handleSwitchToAddMode = () => {
        console.log("Switching to Add Mode");
        // Clear fields and switch to Add Mode
        setNewCharacterName("");
        setCustomPrompt("");
        setCustomCommands("");
        setIsEditing(false); 
    };

    return (
        <div className="character-manager">
            {/* Display Character Image */}
            <div className="character-image-container">
                <img
                    src={characterImage}
                    alt={`${characters[selectedCharacter]?.name || "Default"} Image`}
                    className="character-manager-image"
                />
            </div>

            {/* Select Character Dropdown */}
            <h3>Select Character:</h3>
            <select
                className="character-dropdown"
                value={selectedCharacter}
                onChange={handleCharacterSelect}
            >
                {Object.keys(characters).map((key) => (
                    <option key={key} value={key}>
                        {characters[key].name}
                    </option>
                ))}
            </select>

            {/* Add New Character Button - always visible */}
            <div style={{ marginTop: "10px" }}>
                <button onClick={handleSwitchToAddMode}>Add New Character</button>
            </div>

            {/* Character Editor */}
            <h3>{isEditing ? `Edit Character: ${newCharacterName}` : "Add New Character"}</h3>
            <input
                type="text"
                placeholder="Character Name"
                value={newCharacterName}
                onChange={handleNewCharacterNameChange}
                disabled={isEditing}
                className="character-input"
            />
            <textarea
                placeholder="Custom Prompt"
                value={customPrompt}
                onChange={handleCustomPromptChange}
                rows="4"
                className="character-textarea"
            />
            <textarea
                placeholder="Custom Commands"
                value={customCommands}
                onChange={handleCustomCommandsChange}
                rows="4"
                className="character-textarea"
            />
            <div className="character-actions">
                <button onClick={handleAddOrUpdateCharacter}>
                    {isEditing ? "Update Character" : "Add Character"}
                </button>
            </div>

            {/* Delete Character */}
            {isEditing && (
                <div className="delete-container">
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
