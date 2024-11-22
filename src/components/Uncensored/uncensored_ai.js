import React, { useState } from 'react';


const LLMConnector = ({ apiKey }) => {
    const [inputText, setInputText] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationHistories, setConversationHistories] = useState({
      default: [], // Maintain a default conversation history
    });
  
    const handleSend = async (message) => {
      if (!apiKey) {
        setResponse("No API key provided. Please try again.");
        return;
      }
  
      setLoading(true);
  
      const updatedConversationHistory = [
        ...conversationHistories.default,
        { role: "user", content: message },
      ];
  
      try {
        const result = await fetch("http://localhost:3000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey, // Pass the API key in the headers
          },
          body: JSON.stringify({
            message,
            history: updatedConversationHistory,
          }),
        });
  
        if (result.ok) {
          const data = await result.json();
          const aiResponse = data.response;
          setResponse(aiResponse);
  
          // Append AI response to conversation history
          const newConversationHistory = [
            ...updatedConversationHistory,
            { role: "assistant", content: aiResponse },
          ];
  
          setConversationHistories({ default: newConversationHistory });
        } else {
          const errorData = await result.json();
          setResponse(errorData.error || "Failed to fetch response.");
        }
      } catch (error) {
        console.error("Error fetching chat response:", error);
        setResponse("Failed to communicate with the server.");
      }
  
      setLoading(false);
      setInputText(""); // Clear the input field
    };
  
    return (
      <div className="chat-container">
        <div className="chat-history">
          {conversationHistories.default.map((entry, index) => (
            <div
              key={index}
              className={
                entry.role === "user" ? "user-message" : "assistant-message"
              }
            >
              <strong>{entry.role === "user" ? "You" : "AI"}:</strong>{" "}
              {entry.content}
            </div>
          ))}
        </div>
  
        <div className="input-section">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message here"
          />
          <button onClick={() => handleSend(inputText)} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    );
  };
  
  export default LLMConnector;
  