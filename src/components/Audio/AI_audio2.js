// AI_Audio.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CharacterManager from '../Character/CharacterManager';
import { DEFAULT_CHARACTERS } from '../Character/CharacterPrompts';

const AI_Audio = ({ onCategorySelect = () => {} }) => {
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
  const recognitionRef = useRef(null);
  const isInSessionRef = useRef(false);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognitionRef.current = recognition;
    }
  }, []);

  const handleApiKeyChange = (e) => setApiKey(e.target.value);

  const startInteraction = () => {
    console.log("Starting interaction...");
    isInSessionRef.current = true;
    setIsListening(true);
    startListening();
  };

  const endInteraction = () => {
    console.log("Ending interaction...");
    isInSessionRef.current = false;
    setIsListening(false);
    stopListening();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      console.log("Starting to listen...");
      setIsListening(true);
      recognitionRef.current.start();

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("User said:", transcript);
        addToConversationLog('User', transcript);
        handleAudioInput(transcript);
      };

      recognitionRef.current.onend = () => {
        console.log("Stopped listening.");
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    } else {
      console.error("Speech recognition not supported.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakResponse = (response) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const sentences = response.split('. ').map(sentence => sentence.trim()).filter(Boolean);
      let sentenceIndex = 0;

      const speakNextSentence = () => {
        if (sentenceIndex < sentences.length) {
          const utterance = new SpeechSynthesisUtterance(sentences[sentenceIndex]);

          console.log("Speaking sentence:", sentences[sentenceIndex]);

          utterance.onend = () => {
            console.log("Finished speaking sentence:", sentences[sentenceIndex]);
            sentenceIndex += 1;
            speakNextSentence();
          };

          utterance.onerror = (error) => {
            console.error("Speech synthesis error:", error);
          };

          window.speechSynthesis.speak(utterance);
        } else {
          console.log("All sentences spoken. Checking if session is active:", isInSessionRef.current);
          if (isInSessionRef.current) {
            console.log("Session is active. Restarting listening...");
            startListening();
          } else {
            console.log("Session is inactive. Not restarting listening.");
          }
        }
      };

      speakNextSentence();
    } else {
      console.error("SpeechSynthesis not supported in this browser.");
    }
  };

  const detectCommand = (responseText) => {
    const lowerCaseResponse = responseText.toLowerCase();
    const commandMappings = {
      'gentlepat()': 'gentlePat',
      'gentlestroke()': 'gentleStroke',
      'firmgrip()': 'firmGrip',
    };

    Object.entries(commandMappings).forEach(([trigger, command]) => {
      if (lowerCaseResponse.includes(trigger)) {
        console.log(`Trigger detected: ${command}`);
        onCategorySelect(command);
      }
    });
  };

  const handleAudioInput = async (audioText) => {
    if (!apiKey) {
      console.error("API key is missing.");
      return;
    }

    setIsLoading(true);
    const character = characters[selectedCharacter];
    const systemMessage = `${character.prompt}\n${character.commands || ''}`;

    // Get the full history for the selected character and add the new input
    const updatedHistory = [
      { role: 'system', content: systemMessage },
      ...conversationHistories[selectedCharacter],
      { role: 'user', content: audioText },
    ];

    const payload = {
      model: "gpt-4o-mini",
      messages: updatedHistory,
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

        // Append the user input and AI response to the character's history
        const newHistory = [
          ...conversationHistories[selectedCharacter],
          { role: 'user', content: audioText },
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
        onCharacterChange={(characterKey) => setSelectedCharacter(characterKey)}
        characters={characters}
        selectedCharacter={selectedCharacter}
      />

      {isInSessionRef.current ? (
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

export default AI_Audio
