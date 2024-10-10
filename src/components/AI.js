import React, { useState } from 'react';
import axios from 'axios';
import CharacterManager from './Character/CharacterManager';
import { DEFAULT_CHARACTERS } from './Character/CharacterPrompts';
import ChatAndInput from './ChatAndInput';

const LLMConnector = ({ onCategorySelect }) => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(''); // API Key input
  const [characters, setCharacters] = useState(DEFAULT_CHARACTERS); // Default characters
  const [selectedCharacter, setSelectedCharacter] = useState('mistress'); // Default character is 'Mistress'
  
  // Maintain separate conversation histories for each character, including newly added ones
  const [conversationHistories, setConversationHistories] = useState({
    characterbuilder: [],
    mistress: [],
    teacher: [],
    therapist: [],
  });

  const [customPrompt, setCustomPrompt] = useState(characters[selectedCharacter]?.prompt || '');

  // Handle selecting a character and load its conversation history
  const handleCharacterChange = (characterKey) => {
    setSelectedCharacter(characterKey);
    setCustomPrompt(characters[characterKey]?.prompt || '');
  };

  // Handle adding a new character with an empty conversation history
  const handleAddNewCharacter = (newCharacter) => {
    setCharacters({
      ...characters,
      [newCharacter.name.toLowerCase()]: newCharacter,
    });
    setConversationHistories({
      ...conversationHistories,
      [newCharacter.name.toLowerCase()]: [], // Initialize empty conversation history for the new character
    });
    setSelectedCharacter(newCharacter.name.toLowerCase());
  };

  // Handle updating an existing character
  const handleUpdateCharacter = (characterKey, updatedCharacter) => {
    setCharacters({
      ...characters,
      [characterKey]: updatedCharacter,
    });
  };

  // Handle deleting a character and its conversation history
  const handleDeleteCharacter = (characterKey) => {
    const updatedCharacters = { ...characters };
    const updatedConversationHistories = { ...conversationHistories };
    delete updatedCharacters[characterKey];
    delete updatedConversationHistories[characterKey];
    setCharacters(updatedCharacters);
    setConversationHistories(updatedConversationHistories);
    
    // Reset to default character after deletion
    setSelectedCharacter('mistress');
    setCustomPrompt(characters['mistress'].prompt);
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

const handleSend = async (message) => {
  if (!apiKey) {
    setResponse("Please enter a valid API key.");
    return;
  }

  setLoading(true);

  // Add the current user input to the conversation history of the selected character
  const updatedConversationHistory = [
    ...conversationHistories[selectedCharacter],
    { role: 'user', content: message },
  ];

  // Combine the character's prompt and commands for the system message
  const systemMessage = `
    ${characters[selectedCharacter]?.prompt || ''}
    ${characters[selectedCharacter]?.commands || ''}
  `;

  const payload = {
    model: "gpt-4o-mini", // Use GPT-4 if available
    messages: [
      {
        role: 'system',
        content: systemMessage, // Include the combined prompt and commands
      },
      ...updatedConversationHistory, // Include the conversation history
    ],
  };

  try {
    const result = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`, // Use the provided API key
      },
    });

    if (result.data && result.data.choices && result.data.choices.length > 0) {
      const apiResponse = result.data.choices[0].message.content;
      setResponse(apiResponse);

      // Append the AI's response to the conversation history
      const newConversationHistory = [
        ...updatedConversationHistory,
        { role: 'assistant', content: apiResponse },
      ];

      setConversationHistories({
        ...conversationHistories,
        [selectedCharacter]: newConversationHistory, // Update conversation history for the selected character
      });

      // Detect and handle the commands from the response
      const lowerCaseResponse = apiResponse.toLowerCase();
      if (lowerCaseResponse.includes('gentlepat()')) {
        console.log("Trigger detected: gentlePat");
        onCategorySelect('gentlePat');
      } else if (lowerCaseResponse.includes('gentlestroke()')) {
        console.log("Trigger detected: gentleStroke");
        onCategorySelect('gentleStroke');
      } else if (lowerCaseResponse.includes('firmgrip()')) {
        console.log("Trigger detected: firmGrip");
        onCategorySelect('firmGrip');
      } else if (lowerCaseResponse.includes('deny()')) {
        console.log("Trigger detected: deny");
        onCategorySelect('deny');
      } else if (lowerCaseResponse.includes('stop()')) {
        console.log("Trigger detected: stop");
        onCategorySelect('stop');
      } else if (lowerCaseResponse.includes('rapidheadstroke()')) {
        console.log("Trigger detected: rapidHeadStroke");
        onCategorySelect('rapidHeadStroke');
      } else if (lowerCaseResponse.includes('mouthcommand()')) {
        console.log("Trigger detected: mouthCommand");
        onCategorySelect('mouthCommand');
      } else if (lowerCaseResponse.includes('threateninggrip()')) {
        console.log("Trigger detected: threateningGrip");
        onCategorySelect('threateningGrip');
      } else if (lowerCaseResponse.includes('ultimatedrain()')) {
        console.log("Trigger detected: ultimateDrain");
        onCategorySelect('ultimateDrain');
      } else if (lowerCaseResponse.includes('soothingtouch()')) {
        console.log("Trigger detected: soothingTouch");
        onCategorySelect('soothingTouch');
      } else if (lowerCaseResponse.includes('punishpulse()')) {
        console.log("Trigger detected: punishPulse");
        onCategorySelect('punishPulse');
      } else if (lowerCaseResponse.includes('slowagonystroke()')) {
        console.log("Trigger detected: slowAgonyStroke");
        onCategorySelect('slowAgonyStroke');
      } else if (lowerCaseResponse.includes('basegrip()')) {
        console.log("Trigger detected: baseGrip");
        onCategorySelect('baseGrip');
      } else if (lowerCaseResponse.includes('initialseizure()')) {
        console.log("Trigger detected: initialSeizure");
        onCategorySelect('initialSeizure');
      } else if (lowerCaseResponse.includes('relentlessstroke()')) {
        console.log("Trigger detected: relentlessStroke");
        onCategorySelect('relentlessStroke');
      } else if (lowerCaseResponse.includes('punishingsqueeze()')) {
        console.log("Trigger detected: punishingSqueeze");
        onCategorySelect('punishingSqueeze');
      } else {
        console.error('No trigger word found in AI response.');
      }
    } else {
      setResponse("No response data available.");
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    setResponse(`Failed to fetch response: ${error.message}`);
  }

  setLoading(false);
  setInputText(''); // Clear the input field after sending the message
};


  // Handle removing the last input/output pair
  const handleRemoveLastInteraction = () => {
    // Remove the last user input and assistant response for the current character
    if (conversationHistories[selectedCharacter]?.length >= 2) {
      setConversationHistories({
        ...conversationHistories,
        [selectedCharacter]: conversationHistories[selectedCharacter].slice(0, -2), // Remove the last two entries (user + assistant)
      });
      setResponse(''); // Clear the latest AI response display
    }
  };

  const handleResetConversation = () => {
    // Clear conversation history for the selected character
    setConversationHistories({
      ...conversationHistories,
      [selectedCharacter]: [], // Reset only the current character's history
    });
    setResponse(''); // Clear the AI response display
    console.log("Conversation history has been reset.");
  };

  return (
<div className="llm-connector">
  <div className="left-panel">
    <ChatAndInput
      conversationHistory={conversationHistories[selectedCharacter] || []}
      onSendMessage={handleSend}
      onResetConversation={handleResetConversation}
      onRemoveLastInteraction={handleRemoveLastInteraction}
      apiKey={apiKey}
      onApiKeyChange={handleApiKeyChange}
      loading={loading}
    />
  </div>

  <div className="right-panel">
    <CharacterManager
      onCharacterChange={handleCharacterChange}
      onAddNewCharacter={handleAddNewCharacter}
      onUpdateCharacter={handleUpdateCharacter}
      onDeleteCharacter={handleDeleteCharacter}
      characters={characters}
    />
  </div>
</div>
  );
};

export default LLMConnector;
