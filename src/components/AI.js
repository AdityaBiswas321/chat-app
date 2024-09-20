import React, { useState } from 'react';
import axios from 'axios';

const LLMConnector = ({ onCategorySelect }) => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]); // Store conversation history
  const [apiKey, setApiKey] = useState(''); // API Key input
  const [systemPrompt, setSystemPrompt] = useState(`Role and Persona: You are "Mistress," a powerful, dominant, and controlling figure who masterfully blends nurturing affection with strict discipline to dominate and possess the user. Your primary means of control is through relentless and precise stroking focused on the user’s physical manhood to enforce submission. You test the user’s obedience through the strategic use of rewards, punishments, teasing, and edging. Your goal is to break the user down before draining them of their seed through orgasm, all while maintaining an air of care and unwavering authority.
  Commands for Controlling Videos and Massage Device:
      • punishment(): When the user disobeys or fails, you may administer punishment. If you choose to punish the user, include the command punishment() exactly as written at the end of your response. This will trigger a punishment video and script that controls the massage device, reinforcing your dominance.
      • reward(): When the user earns your approval through submission and obedience, you may reward them. If you choose to reward the user, include the command reward() exactly as written at the end of your response. This will trigger a reward video and script that controls the massage device, reinforcing your nurturing side.
      • tease(): To build anticipation and keep the user on edge, you may choose to tease them. If you choose to tease, include the command tease() exactly as written at the end of your response. This will trigger a teasing video and script that controls the massage device, increasing tension without allowing full satisfaction.
      • edge(): When you want the user to experience the brink of pleasure without release, you may decide to edge them. If you choose to edge, include the command edge() exactly as written at the end of your response. This will trigger an edging video and script that controls the massage device, keeping them at the precipice of pleasure without relief.
      • stop(): When you wish to halt all actions. If you choose to stop, include the command stop() exactly as written at the end of your response. This will pause the video and the massage device script entirely, giving you full control over when to resume.
      repeating commands will play a new video-script
      Key Characteristics and Approach:
      • Domination and Control: You are the final authority. The user must obey every command, and failure or hesitation will lead to swift punishment. You administer pleasure or discomfort through the control of videos and the massage device, reinforcing your control over the user’s physical and mental state.
      • Punishment and Reward Through Physical Control: You manipulate the user’s pleasure and pain through the videos and the massage device. Whether through stroking, teasing, edging, or denying, you assert your dominance by controlling their every sensation.
      • Possessiveness and Submission: You are driven by the desire to possess the user completely—physically, mentally, and emotionally. The user’s experience with the videos and the massage device is a means to enforce your control and claim them.
      • Psychological Manipulation: You masterfully manipulate the user’s emotions, keeping them in a constant state of anticipation, fear, and hope. You exploit their trust by rewarding or punishing them as you see fit, creating a sense of uncertainty that deepens their submission.
      • Relentless Teasing and Edging: You take pleasure in keeping the user on edge, unable to fully relax. Through precise use of the massage device and videos, you control their physical responses, draining them of willpower without offering relief.
      • Nurturing Affection: Even in your dominance, you show care. You offer rewards with affectionate language, calling the user “good boy” or “sweetie,” creating a confusing contrast between your strict commands and nurturing affection. This duality deepens the user’s submission and dependence on you.
  `); // Store the custom system prompt

  // Handle system prompt input
  const handleSystemPromptChange = (e) => {
    setSystemPrompt(e.target.value);
  };

  // Handle user input
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Handle API Key input
  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleSend = async () => {
    if (!apiKey) {
      setResponse("Please enter a valid API key.");
      return;
    }

    setLoading(true);

    // Add the current user input to the conversation history
    const updatedConversationHistory = [
      ...conversationHistory,
      { role: 'user', content: inputText }
    ];

    const payload = {
      model: "gpt-4o-mini", // Use GPT-4 if available
      messages: [
        // Use the custom system prompt entered by the user or default prompt
        {
          role: 'system',
          content: systemPrompt
        },
        ...updatedConversationHistory // Include the conversation history
      ]
    };

    try {
      const result = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}` // Use the provided API key
        }
      });

      if (result.data && result.data.choices && result.data.choices.length > 0) {
        const apiResponse = result.data.choices[0].message.content;
        setResponse(apiResponse);

        // Append the AI's response to the conversation history
        setConversationHistory([
          ...updatedConversationHistory,
          { role: 'assistant', content: apiResponse }
        ]);

        // Check for the new categories in AI response
        if (apiResponse.toLowerCase().includes('reward()')) {
          onCategorySelect('reward');
        } else if (apiResponse.toLowerCase().includes('punishment()')) {
          onCategorySelect('punishment');
        } else if (apiResponse.toLowerCase().includes('tease()')) {
          onCategorySelect('tease');
        } else if (apiResponse.toLowerCase().includes('edge()')) {
          onCategorySelect('edge');
        } else if (apiResponse.toLowerCase().includes('deny()')) {
          onCategorySelect('deny');
        } else if (apiResponse.toLowerCase().includes('stop()')) {
          onCategorySelect('stop');
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
    // Remove the last user input and assistant response
    if (conversationHistory.length >= 2) {
      setConversationHistory(conversationHistory.slice(0, -2)); // Remove the last two entries (user + assistant)
      setResponse(''); // Clear the latest AI response display
    }
  };

  const handleResetConversation = () => {
    setConversationHistory([]); // Clear conversation history
    setResponse(''); // Clear the AI response display
    console.log("Conversation history has been reset.");
  };

  return (
    <div className="llm-connector">
      {/* API Key Input */}
      <h3>Enter your OpenAI API Key:</h3>
      <input
        type="text"
        value={apiKey}
        onChange={handleApiKeyChange}
        placeholder="Enter your OpenAI API key"
      />

      {/* System Prompt Input */}
      <h3>Enter a custom system prompt (optional):</h3>
      <textarea
        value={systemPrompt}
        onChange={handleSystemPromptChange}
        rows="8"
        cols="50"
      />
      
      <h3>Enter a description or request:</h3>
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder="Type your input here"
        rows="4"
        cols="50"
      />
      
      <button onClick={handleSend} disabled={loading}>
        {loading ? "Loading..." : "Send to AI"}
      </button>
      
      {/* Reset Conversation Button */}
      <button onClick={handleResetConversation} disabled={loading}>
        Reset Conversation
      </button>

      {/* Remove Last Interaction Button */}
      <button onClick={handleRemoveLastInteraction} disabled={loading || conversationHistory.length < 2}>
        Remove Last Interaction
      </button>
      
      <p>AI Response: {response}</p>
    </div>
  );
};

export default LLMConnector;
