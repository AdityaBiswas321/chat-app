import React, { createContext, useState, useContext } from "react";
import { DEFAULT_CHARACTERS } from "../components/Character/CharacterPrompts"; // Import default characters

// Create the Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [characters, setCharacters] = useState(DEFAULT_CHARACTERS);
  const [conversationHistories, setConversationHistories] = useState({
    characterbuilder: [],
    mistress: [],
    teacher: [],
    therapist: [],
  });
  const [selectedCharacter, setSelectedCharacter] = useState("mistress"); // Add selectedCharacter state
  const [apiKey, setApiKey] = useState("");
  const [connectionKey, setConnectionKey] = useState("");

  const addCharacter = (newCharacter) => {
    setCharacters((prev) => ({
      ...prev,
      [newCharacter.name.toLowerCase()]: newCharacter,
    }));
    setConversationHistories((prev) => ({
      ...prev,
      [newCharacter.name.toLowerCase()]: [],
    }));
  };

  const updateCharacter = (characterKey, updatedCharacter) => {
    setCharacters((prev) => ({
      ...prev,
      [characterKey]: updatedCharacter,
    }));
  };

  const deleteCharacter = (characterKey) => {
    const updatedCharacters = { ...characters };
    const updatedConversationHistories = { ...conversationHistories };
    delete updatedCharacters[characterKey];
    delete updatedConversationHistories[characterKey];
    setCharacters(updatedCharacters);
    setConversationHistories(updatedConversationHistories);

    if (selectedCharacter === characterKey) {
      setSelectedCharacter("mistress"); // Reset to default if deleted
    }
  };

  const addToConversationHistory = (characterKey, message) => {
    setConversationHistories((prev) => ({
      ...prev,
      [characterKey]: [...(prev[characterKey] || []), message],
    }));
  };

  const resetConversation = (characterKey) => {
    setConversationHistories((prev) => ({
      ...prev,
      [characterKey]: [],
    }));
  };

  const removeLastInteraction = (characterKey) => {
    setConversationHistories((prev) => {
      const history = prev[characterKey] || [];
      return {
        ...prev,
        [characterKey]: history.slice(0, -2), // Remove last user + assistant messages
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        characters,
        conversationHistories,
        selectedCharacter,
        setSelectedCharacter, // Expose setSelectedCharacter to context consumers
        addCharacter,
        updateCharacter,
        deleteCharacter,
        addToConversationHistory,
        resetConversation,
        removeLastInteraction,
        apiKey,
        setApiKey,
        connectionKey,
        setConnectionKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook to Use the Context
export const useAppContext = () => useContext(AppContext);
