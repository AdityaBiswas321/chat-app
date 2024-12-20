import React, { useState } from "react";

const LLMConnector = ({ onKeywordSelect }) => {
  const [apiKey, setApiKey] = useState(""); // API key input
  const [message, setMessage] = useState(""); // User's input message
  const [response, setResponse] = useState(""); // AI's response
  const [loadingMessage, setLoadingMessage] = useState(false); // Loading state for sending messages
  const [loadingKey, setLoadingKey] = useState(false); // Loading state for generating API key
  const [serverMessage, setServerMessage] = useState(""); // Server messages or errors

  // Function to generate an API key
  const generateApiKey = async () => {
    setLoadingKey(true); // Set loading state for the "Generate API Key" button
    setServerMessage(""); // Clear previous server messages
    try {
      const response = await fetch("http://localhost:3000/generate-key", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setApiKey(data.apiKey);
        setServerMessage(`API Key generated! Expires at: ${data.expiry}`);
      } else {
        setServerMessage("Failed to generate API key.");
      }
    } catch (error) {
      console.error("Error generating API key:", error);
      setServerMessage("An error occurred while generating the API key.");
    } finally {
      setLoadingKey(false); // Reset loading state
    }
  };

  // Function to send a message to the AI with POST request
  const sendMessage = async () => {
    if (!apiKey) {
      setServerMessage("Please generate or enter an API key first.");
      return;
    }
    if (!message) {
      setServerMessage("Please enter a message.");
      return;
    }

    setLoadingMessage(true); // Set loading state for the "Send" button
    setServerMessage(""); // Clear previous server messages
    setResponse(""); // Clear the response before starting a new request

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setServerMessage(errorData.error || "Failed to fetch response.");
        setLoadingMessage(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullResponse = "";

      // Read the streaming response body
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const cleanedChunk = chunk
          .replace(/^data:\s*/gm, "") // Remove "data:" prefix
          .replace(/\[DONE\]/g, "") // Remove "[DONE]"
          .trim(); // Trim any leading/trailing whitespace

        fullResponse += cleanedChunk;

        // Process the chunk (append it to the response)
        setResponse((prev) => prev + cleanedChunk);
      }

      setResponse(fullResponse.trim()); // Finalize the full response
    } catch (error) {
      console.error("Error communicating with the AI:", error);
      setServerMessage("An error occurred while communicating with the AI.");
    } finally {
      setLoadingMessage(false); // Reset loading state
    }
  };

  return (
    <div className="ai-connector">
      {/* Generate API Key Button */}
      <div className="api-key-section">
        <button onClick={generateApiKey} disabled={loadingKey}>
          {loadingKey ? "Generating Key..." : "Generate API Key"}
        </button>
        {apiKey && (
          <p>
            <strong>Generated API Key:</strong> {apiKey}
          </p>
        )}
      </div>

      {/* API Key Input */}
      <div className="api-key-input">
        <input
          type="text"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      {/* Message Input */}
      <div className="message-section">
        <textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} disabled={loadingMessage}>
          {loadingMessage ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Display Response */}
      <div className="response-section">
        <strong>AI Response:</strong>
        <p>{response}</p>
      </div>

      {/* Server Messages */}
      {serverMessage && <p className="server-message">{serverMessage}</p>}
    </div>
  );
};

export default LLMConnector;
