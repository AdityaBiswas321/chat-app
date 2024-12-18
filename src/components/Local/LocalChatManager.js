import React, { useState } from "react";
import styles from "../Chat/ChatAppComponents.module.css";


const LocalChatManager = ({
  conversationHistory,
  onSendMessage,
  onResetConversation,
  onRemoveLastInteraction,
  apiKey,
  onApiKeyChange,
  loading,
  temporaryResponse, // Streaming response
}) => {
  const [inputText, setInputText] = useState("");

  const handleSendClick = () => {
    if (inputText.trim() !== "") {
      onSendMessage(inputText); // Send the input to the parent
      setInputText(""); // Clear input
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className={styles["chat-and-input"]}>
      {/* Conversation History */}
      <div className={styles["chat-history"]}>
        {conversationHistory.map((entry, index) => (
          <div
            key={index}
            className={
              entry.role === "user"
                ? styles["user-message"]
                : styles["assistant-message"]
            }
          >
            <strong>{entry.role === "user" ? "You" : "AI"}:</strong> {entry.content}
          </div>
        ))}
        {/* Streamed response displayed dynamically */}
        {loading && (
          <div className={styles["assistant-message"]}>
            <strong>AI (Streaming):</strong> {temporaryResponse}
          </div>
        )}
      </div>

      {/* Input and Controls */}
      <div className={styles["input-section"]}>
        <h3>Enter your OpenAI API Key:</h3>
        <input
          type="text"
          value={apiKey}
          onChange={onApiKeyChange}
          placeholder="Enter your OpenAI API key"
        />
        <h3>Enter a description or request:</h3>
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message here"
          rows="4"
        />
        <button onClick={handleSendClick} disabled={loading}>
          {loading ? "Loading..." : "Send to AI"}
        </button>
        <button onClick={onResetConversation} disabled={loading}>
          Reset Conversation
        </button>
        <button
          onClick={onRemoveLastInteraction}
          disabled={loading || conversationHistory.length < 2}
        >
          Remove Last Interaction
        </button>
      </div>
    </div>
  );
};

export default LocalChatManager;
