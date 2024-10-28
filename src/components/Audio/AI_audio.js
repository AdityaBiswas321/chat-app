import React, { useState } from 'react';
import axios from 'axios';
import CharacterManager from '../Character/CharacterManager';
import { DEFAULT_CHARACTERS } from '../Character/CharacterPrompts';

const AI_Audio = ({ onCategorySelect }) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('mistress');
  const [characters, setCharacters] = useState({
    ...DEFAULT_CHARACTERS,
  });
  const [isListening, setIsListening] = useState(false);

  const handleApiKeyChange = (e) => setApiKey(e.target.value);

  // Process the audio input and send to LLM
  const handleAudioInput = async (audioText) => {
    if (!apiKey) {
      console.error("API key is missing.");
      return;
    }

    const character = characters[selectedCharacter];
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: 'system', content: character.prompt },
        { role: 'user', content: audioText },
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
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    }
  };

  // Detect and pass the command if present in the LLM response
  const detectCommand = (responseText) => {
    const lowerCaseResponse = responseText.toLowerCase();
    const commandMappings = {
      'gentlepat()': 'gentlePat',
      'gentlestroke()': 'gentleStroke',
      'firmgrip()': 'firmGrip',
      'deny()': 'deny',
      'stop()': 'stop',
      'rapidheadstroke()': 'rapidHeadStroke',
      'mouthcommand()': 'mouthCommand',
      'threateninggrip()': 'threateningGrip',
      'ultimatedrain()': 'ultimateDrain',
      'soothingtouch()': 'soothingTouch',
      'punishpulse()': 'punishPulse',
      'slowagonystroke()': 'slowAgonyStroke',
      'basegrip()': 'baseGrip',
      'initialseizure()': 'initialSeizure',
      'relentlessstroke()': 'relentlessStroke',
      'punishingsqueeze()': 'punishingSqueeze',
    };

    Object.entries(commandMappings).forEach(([trigger, command]) => {
      if (lowerCaseResponse.includes(trigger)) {
        console.log(`Trigger detected: ${command}`);
        onCategorySelect(command);
      }
    });
  };

  const handleStartListening = () => setIsListening(true);
  const handleStopListening = () => setIsListening(false);

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

      {/* CharacterManager manages the characters, selecting and updating */}
      <CharacterManager
        onCharacterChange={setSelectedCharacter}
        characters={characters}
        onAddNewCharacter={(newCharacter) => setCharacters({ ...characters, [newCharacter.name]: newCharacter })}
        onUpdateCharacter={(characterKey, updatedCharacter) =>
          setCharacters({ ...characters, [characterKey]: updatedCharacter })
        }
        onDeleteCharacter={(characterKey) => {
          const updatedCharacters = { ...characters };
          delete updatedCharacters[characterKey];
          setCharacters(updatedCharacters);
          setSelectedCharacter('mistress'); // Reset to default if deleted
        }}
      />

      {/* Button to start/stop listening */}
      <button onClick={isListening ? handleStopListening : handleStartListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  );
};

export default AI_Audio;
