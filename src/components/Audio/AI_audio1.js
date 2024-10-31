// AI_Audio.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CharacterManager from '../Character/CharacterManager';
import { DEFAULT_CHARACTERS } from '../Character/CharacterPrompts';

const AI_Audio = ({ onCategorySelect }) => {
  const [apiKey, setApiKey] = useState('');
  const [characters, setCharacters] = useState(DEFAULT_CHARACTERS);
  const [selectedCharacter, setSelectedCharacter] = useState('mistress');
  const [conversationHistories, setConversationHistories] = useState({
    characterbuilder: [],
    mistress: [],
    teacher: [],
    therapist: [],
  });
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInSession, setIsInSession] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      newRecognition.lang = 'en-US';
      newRecognition.continuous = false;
      newRecognition.interimResults = false;
      setRecognition(newRecognition);
    }
  }, []);

  // Handle API Key Input
  const handleApiKeyChange = (e) => setApiKey(e.target.value);

  // Start Listening
  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("User said:", transcript);
        addToConversationLog('User', transcript);
        handleAudioInput(transcript);
      };
      recognition.onend = () => setIsListening(false);
    }
  };

  // Stop Listening
  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Handle User Input and Send to API
  const handleAudioInput = async (audioText) => {
    if (!apiKey) {
      console.error("API key is missing.");
      return;
    }

    // Prevent multiple API calls
    if (isLoading) return;

    setIsLoading(true);
    const character = characters[selectedCharacter];
    const systemMessage = selectedCharacter === 'characterbuilder'
      ? character.prompt
      : `${character.prompt}\n${character.commands || ''}`;

    const updatedHistory = [
      ...conversationHistories[selectedCharacter],
      { role: 'user', content: audioText },
    ];

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: 'system', content: systemMessage },
        ...updatedHistory,
      ],
    };

    try {
      const result = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (result.data && result.data.choices && result.data.choices.length > 0) {
        const apiResponse = result.data.choices[0].message.content;
        detectCommand(apiResponse);
        speakResponse(apiResponse);

        const newHistory = [
          ...updatedHistory,
          { role: 'assistant', content: apiResponse },
        ];
        
        setConversationHistories({
          ...conversationHistories,
          [selectedCharacter]: newHistory,
        });
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Detect Command in AI Response
  const detectCommand = (responseText) => {
    const lowerCaseResponse = responseText.toLowerCase();
    const commandMappings = {
      'gentlepat()': 'gentlePat',
      'gentlestroke()': 'gentleStroke',
      'firmgrip()': 'firmGrip',
    };

    Object.entries(commandMappings).forEach(([trigger, command]) => {
      if (lowerCaseResponse.includes(trigger)) {
        onCategorySelect(command);
      }
    });
  };

  // Speak AI Response and restart listening if in session
// AI_Audio.js (relevant parts only)

const speakResponse = (response) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Clear any ongoing speech
  
      const sentences = response.split('. ').map(sentence => sentence.trim()).filter(Boolean);
      let sentenceIndex = 0;
  
      const speakNextSentence = () => {
        if (sentenceIndex < sentences.length) {
          const utterance = new SpeechSynthesisUtterance(sentences[sentenceIndex]);
          
          // Increment the index after each sentence
          utterance.onend = () => {
            sentenceIndex += 1;
            speakNextSentence(); // Call the next sentence if there are more to read
          };
  
          // Handle any speech synthesis errors
          utterance.onerror = (error) => {
            console.error("Speech synthesis error:", error);
          };
  
          window.speechSynthesis.speak(utterance);
        } else {
          // After the last sentence, restart listening if in session
          if (isInSession) {
            setTimeout(startListening, 1000); // 1-second delay before restarting listening
          }
        }
      };
  
      // Start the chain of speaking sentences
      speakNextSentence();
    } else {
      console.error("SpeechSynthesis not supported in this browser.");
    }
  };
  

  // Add Message to Conversation Log
  const addToConversationLog = (speaker, message) => {
    setConversationHistories((prevHistories) => ({
      ...prevHistories,
      [selectedCharacter]: [
        ...prevHistories[selectedCharacter],
        { role: speaker.toLowerCase(), content: message },
      ],
    }));
  };

  // Reset conversation history for the selected character
  const resetConversation = () => {
    setConversationHistories((prevHistories) => ({
      ...prevHistories,
      [selectedCharacter]: [],
    }));
  };

  // Remove last user-AI interaction from conversation history
  const removeLastInteraction = () => {
    setConversationHistories((prevHistories) => {
      const updatedHistory = [...prevHistories[selectedCharacter]];
      if (updatedHistory.length >= 2) updatedHistory.splice(-2);
      return { ...prevHistories, [selectedCharacter]: updatedHistory };
    });
  };

  // Handle character change
  const handleCharacterChange = (characterKey) => {
    if (isInSession) endInteraction(); // End the session if switching characters
    setSelectedCharacter(characterKey);
  };

  // Add new character
  const handleAddNewCharacter = (newCharacter) => {
    const characterKey = newCharacter.name.toLowerCase();
    setCharacters((prevCharacters) => ({
      ...prevCharacters,
      [characterKey]: newCharacter,
    }));
    setConversationHistories((prevHistories) => ({
      ...prevHistories,
      [characterKey]: [],
    }));
    setSelectedCharacter(characterKey);
  };

  // Update character details
  const handleUpdateCharacter = (characterKey, updatedCharacter) => {
    setCharacters((prevCharacters) => ({
      ...prevCharacters,
      [characterKey]: updatedCharacter,
    }));
  };

  // Delete character
  const handleDeleteCharacter = (characterKey) => {
    const updatedCharacters = { ...characters };
    const updatedHistories = { ...conversationHistories };
    delete updatedCharacters[characterKey];
    delete updatedHistories[characterKey];
    setCharacters(updatedCharacters);
    setConversationHistories(updatedHistories);

    if (selectedCharacter === characterKey) {
      setSelectedCharacter('mistress');
    }
  };

  // Start Interaction
  const startInteraction = () => {
    setIsInSession(true);
    startListening();
  };

  // End Interaction
  const endInteraction = () => {
    setIsInSession(false);
    stopListening();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div>
      <div>
        <h1>Audio Interaction</h1>
        <input
          type="text"
          placeholder="Enter API Key"
          value={apiKey}
          onChange={handleApiKeyChange}
        />
      </div>

      {isLoading && <p>Loading...</p>}

      <div className="conversation-log">
        {conversationHistories[selectedCharacter]?.map((entry, index) => (
          <p key={index}>
            <strong>{entry.role === 'user' ? 'User' : 'AI'}:</strong> {entry.content}
          </p>
        ))}
      </div>

      <CharacterManager
        onCharacterChange={handleCharacterChange}
        onAddNewCharacter={handleAddNewCharacter}
        onUpdateCharacter={handleUpdateCharacter}
        onDeleteCharacter={handleDeleteCharacter}
        characters={characters}
        selectedCharacter={selectedCharacter}
      />

      {isInSession ? (
        <button onClick={endInteraction}>End Interaction</button>
      ) : (
        <button onClick={startInteraction}>Start Interaction</button>
      )}

      <button onClick={resetConversation}>Reset Conversation</button>
      <button onClick={removeLastInteraction}>Remove Last Interaction</button>

      {isListening && <p>Listening...</p>}
    </div>
  );
};

export default AI_Audio;
