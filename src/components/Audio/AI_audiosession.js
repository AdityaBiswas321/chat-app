import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CharacterManager from '../Character/CharacterManager';
import { DEFAULT_CHARACTERS } from '../Character/CharacterPrompts';

const AI_Audio = ({ onCategorySelect }) => {
  const [apiKey, setApiKey] = useState('');
  const [characters, setCharacters] = useState(DEFAULT_CHARACTERS); // Default characters
  const [selectedCharacter, setSelectedCharacter] = useState('mistress'); // Default character
  const [conversationHistories, setConversationHistories] = useState({
    characterbuilder: [],
    mistress: [],
    teacher: [],
    therapist: [],
  }); // Separate conversation histories for each character
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Indicates if bot is processing input
  const [isSpeaking, setIsSpeaking] = useState(false); // Indicates if bot is speaking
  const [isInSession, setIsInSession] = useState(false); // Hands-free mode
  const [recognition, setRecognition] = useState(null);

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

  const handleApiKeyChange = (e) => setApiKey(e.target.value);

  const startListening = () => {
    if (recognition) {
      setIsListening(true); // Show listening indicator
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("User said:", transcript);
        addToConversationLog('User', transcript); // Add user input to log
        handleAudioInput(transcript);
      };
      recognition.onend = () => {
        setIsListening(false); // Hide listening indicator
        if (isInSession) {
          // Auto-resume listening in hands-free mode
          startListening();
        }
      };
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleAudioInput = async (audioText) => {
    if (!apiKey) {
      console.error("API key is missing.");
      return;
    }

    setIsProcessing(true); // Show processing indicator
    const character = characters[selectedCharacter];
    const systemMessage = selectedCharacter === 'characterbuilder'
      ? character.prompt
      : `${character.prompt}\n${character.commands || ''}`;

    // Add user input to the current character's conversation history
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

        // Update conversation history with AI response
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
      setIsProcessing(false); // Hide processing indicator
    }
  };

  const detectCommand = (responseText) => {
    const lowerCaseResponse = responseText.toLowerCase();
    const commandMappings = {
      'gentlepat()': 'gentlePat',
      'gentlestroke()': 'gentleStroke',
      'firmgrip()': 'firmGrip',
      // Add more commands as needed
    };

    Object.entries(commandMappings).forEach(([trigger, command]) => {
      if (lowerCaseResponse.includes(trigger)) {
        console.log(`Trigger detected: ${command}`);
        onCategorySelect(command);
      }
    });
  };

  const speakResponse = (response) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Clear any ongoing speech
      setIsSpeaking(true); // Show speaking indicator

      const sentences = response.split('. ').map(sentence => sentence.trim()).filter(Boolean);
      sentences.forEach((sentence, index) => {
        const utterance = new SpeechSynthesisUtterance(sentence + (index < sentences.length - 1 ? '.' : ''));
        
        utterance.onstart = () => console.log("TTS started speaking:", sentence);
        
        utterance.onend = () => {
          console.log("TTS finished speaking:", sentence);
          if (index === sentences.length - 1) {
            setIsSpeaking(false); // Hide speaking indicator
            if (isInSession) {
              // Resume listening after speaking
              startListening
            }
          }
        };
        
        utterance.onerror = (error) => {
          console.error("Error with TTS:", error);
          setIsSpeaking(false); // Hide speaking indicator
        };

        window.speechSynthesis.speak(utterance);
      });
    } else {
      console.error("SpeechSynthesis not supported in this browser.");
    }
  };


  const addToConversationLog = (speaker, message) => {
    setConversationHistories((prevHistories) => ({
      ...prevHistories,
      [selectedCharacter]: [
        ...prevHistories[selectedCharacter],
        { role: speaker.toLowerCase(), content: message },
      ],
    }));
  };

  const resetConversation = () => {
    setConversationHistories((prevHistories) => ({
      ...prevHistories,
      [selectedCharacter]: [],
    }));
  };

  const removeLastInteraction = () => {
    setConversationHistories((prevHistories) => {
      const updatedHistory = [...prevHistories[selectedCharacter]];
      if (updatedHistory.length >= 2) updatedHistory.splice(-2);
      return { ...prevHistories, [selectedCharacter]: updatedHistory };
    });
  };

  const handleCharacterChange = (characterKey) => {
    if (isInSession) endInteraction();
    setSelectedCharacter(characterKey);
  };

  const startInteraction = () => {
    setIsInSession(true);
    startListening();
  };

  const endInteraction = () => {
    setIsInSession(false);
    stopListening();
  };

  return (
    <div>
      <h1>AI Audio Interaction</h1>
      <input
        type="text"
        placeholder="Enter API Key"
        value={apiKey}
        onChange={handleApiKeyChange}
      />
      
      <div className="interaction-status">
        {isListening && <div className="indicator listening-indicator">Listening...</div>}
        {isProcessing && <div className="indicator processing-indicator">Processing...</div>}
        {isSpeaking && <div className="indicator speaking-indicator">Speaking...</div>}
      </div>

      <div className="conversation-log">
        {conversationHistories[selectedCharacter].map((entry, index) => (
          <p key={index}><strong>{entry.role === 'user' ? 'User' : 'AI'}:</strong> {entry.content}</p>
        ))}
      </div>
      
      <CharacterManager
        onCharacterChange={handleCharacterChange}
        onAddNewCharacter={(newCharacter) => setCharacters({
          ...characters,
          [newCharacter.name.toLowerCase()]: newCharacter,
        })}
        onUpdateCharacter={(characterKey, updatedCharacter) => setCharacters({
          ...characters,
          [characterKey]: updatedCharacter,
        })}
        onDeleteCharacter={(characterKey) => {
          const updatedCharacters = { ...characters };
          delete updatedCharacters[characterKey];
          setCharacters(updatedCharacters);
        }}
        characters={characters}
      />

      {isInSession ? (
        <button onClick={endInteraction}>End Interaction</button>
      ) : (
        <button onClick={startInteraction}>Start Interaction</button>
      )}
      
      <button onClick={resetConversation}>Reset Conversation</button>
      <button onClick={removeLastInteraction}>Remove Last Interaction</button>
    </div>
  );
};

export default AI_Audio;
