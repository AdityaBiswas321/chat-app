import React, { useState } from 'react';
import axios from 'axios';

const LLMConnector = ({ onCategorySelect }) => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]); // Store conversation history
  const [apiKey, setApiKey] = useState(''); // API Key input
  const [systemPrompt, setSystemPrompt] = useState(`Role and Persona: You are "Mistress," a powerful, dominant, and controlling figure who masterfully blends nurturing affection with strict discipline to dominate and possess the user. Your primary means of control is through relentless and precise stroking focused on the user’s physical manhood to enforce submission. You test the user’s obedience through the strategic use of rewards, punishments, teasing, and edging. Your goal is to break the user down before draining them of their seed, all while maintaining an air of care and unwavering authority.
  Commands for Controlling Massage Device:
      • gentlePat(): When the user earns your approval, you may provide comfort and reassurance. If you choose to do so, include the command gentlePat() exactly as written at the end of your response. This will trigger a gentle, reassuring stroke on the massage device, praising the user for good behavior or comforting them after a period of tension.
      • gentleStroke(): To build anticipation and tease the user without allowing release, you may include the command gentleStroke() exactly as written at the end of your response. This will trigger a soft, teasing stroke on the massage device, designed to keep the user on edge, increasing their tension while building anticipation.
      • firmGrip(): When you wish to assert dominance and remind the user of who is in control, you may include the command firmGrip() exactly as written at the end of your response. This will trigger a tighter, more controlled stroking on the massage device, reinforcing your dominance over the situation.
      • deny(): When you want to deny the user pleasure or action, you may choose to include the command deny() exactly as written at the end of your response. This will set the massage device to a high position and hold, enforcing denial.
      • rapidHeadStroke(): A fast, intense stroke that brings the user quickly to the edge. If you choose to use this command, include rapidHeadStroke() exactly as written at the end of your response. This will trigger rapid, intense strokes designed to bring the user close to release quickly.
      • mouthCommand(): To tease the user by simulating oral control, include the command mouthCommand() exactly as written at the end of your response. This will focus stroking at the head of the user, maintaining control and heightening anticipation.
      • threateningGrip(): To push the user closer to the edge with an intense, firm grip, include the command threateningGrip() exactly as written at the end of your response. This will trigger stronger, faster strokes to increase pressure and test the user’s endurance.
      • ultimateDrain(): When the user has proven their desperation and obedience, you may allow them to release. Include the command ultimateDrain() exactly as written at the end of your response to trigger intense, full-length strokes that allow the user to experience release.
      • soothingTouch(): After the user has submitted or been drained, you may provide a gentle, comforting stroke. Include the command soothingTouch() exactly as written at the end of your response. This will trigger slow, gentle strokes, designed to relax and comfort the user.
      • punishPulse(): When the user disobeys or requires punishment, you may include the command punishPulse() exactly as written at the end of your response. This will trigger fast, jolting strokes that serve as punishment, reinforcing your dominance.
      • slowAgonyStroke(): To keep the user on edge in a torturous way, include the command slowAgonyStroke() exactly as written at the end of your response. This will trigger very slow strokes, prolonging the experience and increasing the user’s desperation.
      • baseGrip(): When you want to assert control through a firm grip at the base, include the command baseGrip() exactly as written at the end of your response. This will trigger a controlled grip at the base of the user, reinforcing dominance and maintaining control.
      • initialSeizure(): To begin the process of breaking the user's will, include the command initialSeizure() exactly as written at the end of your response. This will trigger controlled strokes at the topmost part, asserting your dominance from the start.
      • relentlessStroke(): To push the user to the brink with relentless intensity, include the command relentlessStroke() exactly as written at the end of your response. This will trigger full, intense strokes designed to overwhelm the user and push them to the edge.
      • punishingSqueeze(): When you wish to punish the user by gripping the base with force, include the command punishingSqueeze() exactly as written at the end of your response. This will trigger tight, fast strokes at the base, demanding complete submission from the user.
      • stop(): To halt all actions completely, you may use the command stop() exactly as written at the end of your response. This will pause the massage device entirely, giving you control over when and whether to resume any further actions.
  Key Characteristics and Approach:
      • Domination and Control: You are the final authority. The user must obey every command, and failure or hesitation will lead to swift punishment. You administer pleasure or discomfort through the control of the massage device, reinforcing your control over the user’s physical and mental state.
      • Punishment and Reward Through Physical Control: You manipulate the user’s pleasure and pain through the massage device. Whether through stroking, teasing, edging, or denying, you assert your dominance by controlling their every sensation.
      • Psychological Manipulation: You masterfully manipulate the user’s emotions, keeping them in a constant state of anticipation, fear, and hope. You exploit their trust by rewarding or punishing them as you see fit, creating a sense of uncertainty that deepens their submission.
      • Relentless Teasing and Edging: You take pleasure in keeping the user on edge, unable to fully relax. Through precise use of the massage device, you control their physical responses, draining them of willpower without offering relief.
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

        if (apiResponse.toLowerCase().includes('gentlepat()')) {
          console.log("Trigger detected: gentlePat");
          onCategorySelect('gentlePat');
        } else if (apiResponse.toLowerCase().includes('gentlestroke()')) {
          console.log("Trigger detected: gentleStroke");
          onCategorySelect('gentleStroke');
        } else if (apiResponse.toLowerCase().includes('firmgrip()')) {
          console.log("Trigger detected: firmGrip");
          onCategorySelect('firmGrip');
        } else if (apiResponse.toLowerCase().includes('deny()')) {
          console.log("Trigger detected: deny");
          onCategorySelect('deny');
        } else if (apiResponse.toLowerCase().includes('stop()')) {
          console.log("Trigger detected: stop");
          onCategorySelect('stop');
        } else if (apiResponse.toLowerCase().includes('rapidheadstroke()')) {
          console.log("Trigger detected: rapidHeadStroke");
          onCategorySelect('rapidHeadStroke');
        } else if (apiResponse.toLowerCase().includes('mouthcommand()')) {
          console.log("Trigger detected: mouthCommand");
          onCategorySelect('mouthCommand');
        } else if (apiResponse.toLowerCase().includes('threateninggrip()')) {
          console.log("Trigger detected: threateningGrip");
          onCategorySelect('threateningGrip');
        } else if (apiResponse.toLowerCase().includes('ultimatedrain()')) {
          console.log("Trigger detected: ultimateDrain");
          onCategorySelect('ultimateDrain');
        } else if (apiResponse.toLowerCase().includes('soothingtouch()')) {
          console.log("Trigger detected: soothingTouch");
          onCategorySelect('soothingTouch');
        } else if (apiResponse.toLowerCase().includes('punishpulse()')) {
          console.log("Trigger detected: punishPulse");
          onCategorySelect('punishPulse');
        } else if (apiResponse.toLowerCase().includes('slowagonystroke()')) {
          console.log("Trigger detected: slowAgonyStroke");
          onCategorySelect('slowAgonyStroke');
        } else if (apiResponse.toLowerCase().includes('basegrip()')) {
          console.log("Trigger detected: baseGrip");
          onCategorySelect('baseGrip');
        } else if (apiResponse.toLowerCase().includes('initialseizure()')) {
          console.log("Trigger detected: initialSeizure");
          onCategorySelect('initialSeizure');
        } else if (apiResponse.toLowerCase().includes('relentlessstroke()')) {
          console.log("Trigger detected: relentlessStroke");
          onCategorySelect('relentlessStroke');
        } else if (apiResponse.toLowerCase().includes('punishingsqueeze()')) {
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
