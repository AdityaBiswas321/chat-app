import React, { createContext, useState, useContext } from "react";
import { DEFAULT_CHARACTERS } from "../components/Character/CharacterPrompts"; // Import default characters
import { useLocalStorage } from "@uidotdev/usehooks";

// Create the Context
const AppContext = createContext();

// Default parameters for functions
const DEFAULT_FUNCTION_PARAMETERS = {
  gentlePat: { min: 10, max: 20, velocity: 10 },
  gentleStroke: { min: 20, max: 50, velocity: 10 },
  firmGrip: { min: 10, max: 30, velocity: 20 },
  rapidHeadStroke: { min: 90, max: 100, velocity: 10 },
  mouthCommand: { min: 40, max: 100, velocity: 10 },
  threateningGrip: { min: 10, max: 20, velocity: 25 },
  ultimateDrain: { min: 10, max: 100, velocity: 35 },
  soothingTouch: { min: 10, max: 60, velocity: 5 },
  punishPulse: { min: 80, max: 100, velocity: 25 },
  slowAgonyStroke: { min: 20, max: 80, velocity: 5 },
  baseGrip: { min: 0, max: 5, velocity: 15 },
  initialSeizure: { min: 10, max: 40, velocity: 10 },
  relentlessStroke: { min: 5, max: 60, velocity: 20 },
  punishingSqueeze: { min: 0, max: 10, velocity: 30 },
  deny: { min: 100, max: 100 }, // Ensure this exists
};

// Provider Component
export const AppProvider = ({ children }) => {
  const [characters, setCharacters] = useLocalStorage("characters", DEFAULT_CHARACTERS);
  const [conversationHistories, setConversationHistories] = useLocalStorage("conversationHistories", {
    characterbuilder: [],
    mistress: [],
    teacher: [],
    therapist: [],
  });
  const [selectedCharacter, setSelectedCharacter] = useLocalStorage("selectedCharacter", "mistress");
  const [apiKey, setApiKey] = useLocalStorage("apiKey", "");
  const [connectionKey, setConnectionKey] = useLocalStorage("connectionKey", "");
  const [functionParameters, setFunctionParameters] = useLocalStorage("functionParameters", DEFAULT_FUNCTION_PARAMETERS);

  // New Local LLM Configuration
  const [baseUrl, setBaseUrl] = useLocalStorage("baseUrl", "https://api.openai.com");
  const [baseModel, setBaseModel] = useLocalStorage("baseModel", "gpt-4o-mini");

  // Update function parameters strictly
  const updateFunctionParameters = (functionName, updatedParameters) => {
    setFunctionParameters((prev) => {
      if (!prev[functionName]) {
        console.error(`Error: Attempting to update non-existent function: ${functionName}`);
        return prev;
      }

      return {
        ...prev,
        [functionName]: {
          ...prev[functionName],
          ...updatedParameters,
        },
      };
    });
  };

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

  const importCharacter = (characterKey, characterData) => {
    // Ensure character is not already added
    if (!characters[characterKey]) {
      setCharacters((prev) => ({
        ...prev,
        [characterKey]: characterData,
      }));
      setConversationHistories((prev) => ({
        ...prev,
        [characterKey]: [],
      }));
    }
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

  const addToConversationHistory = (characterKey, messages) => {
    setConversationHistories((prev) => ({
      ...prev,
      [characterKey]: [
        ...(prev[characterKey] || []),
        ...(Array.isArray(messages) ? messages : [messages])
      ],
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
        setSelectedCharacter,
        addCharacter,
        importCharacter,
        updateCharacter,
        deleteCharacter,
        addToConversationHistory,
        resetConversation,
        removeLastInteraction,
        apiKey,
        setApiKey,
        connectionKey,
        setConnectionKey,
        functionParameters,
        updateFunctionParameters, // Expose function parameter management,
        baseUrl, // Persisted and shared baseUrl
        setBaseUrl,
        baseModel, // Persisted and shared baseModel
        setBaseModel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook to Use the Context
export const useAppContext = () => useContext(AppContext);
