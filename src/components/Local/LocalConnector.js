import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import LocalChatManager from "./LocalChatManager";
import CharacterManager from "../Character/CharacterManager";
import styles from "../Chat/ChatAppComponents.module.css";

const LocalConnector = ({ onCategorySelect }) => {
  const {
    characters,
    selectedCharacter,
    conversationHistories,
    addToConversationHistory,
    resetConversation,
    removeLastInteraction,
    apiKey,
    setApiKey,
    baseUrl,
    setBaseUrl,
    baseModel,
    setBaseModel,
  } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (conversationHistories[selectedCharacter]?.length === 0) {
      setResponse("");
    }
  }, [conversationHistories, selectedCharacter]);

  const handleSend = async (message) => {
    if (!baseUrl || !baseModel) {
      setResponse("Please enter a valid BASE URL and BASE MODEL.");
      return;
    }
    setResponse("");
    setLoading(true);

    const character = characters[selectedCharacter];
    const updatedConversationHistory = [
      ...(conversationHistories[selectedCharacter] || []),
      { role: "user", content: message },
    ];

    const payload = {
      model: baseModel,
      messages: [
        { role: "system", content: `${character.prompt}\n${character.commands || ""}` },
        ...updatedConversationHistory,
      ],
      stream: true,
    };

    console.log("Sending payload:", payload);

    try {
      const responseStream = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: baseUrl.includes("openai.com")
          ? {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            }
          : {
              "Content-Type": "application/json",
            },
        body: JSON.stringify(payload),
      });

      if (!responseStream.body) throw new Error("No response stream received.");

      const reader = responseStream.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true }).trim();
        if (chunk === "[DONE]") break;

        const parsedChunks = chunk
          .split("data:")
          .map((chunk) => chunk.trim())
          .filter(Boolean)
          .map((chunk) => {
            try {
              return JSON.parse(chunk);
            } catch {
              console.error("Invalid JSON chunk:", chunk);
              return null;
            }
          })
          .filter(Boolean);

        for (const parsedChunk of parsedChunks) {
          const content = parsedChunk?.choices?.[0]?.delta?.content;
          if (content) {
            accumulatedResponse += content;
            setResponse((prev) => prev + content);
          }
        }
      }

      // Update conversation history
      addToConversationHistory(selectedCharacter, [
        { role: "user", content: message },
        { role: "assistant", content: accumulatedResponse },
      ]);

      // Detect and handle commands AFTER reading the entire response
      const lowerCaseResponse = accumulatedResponse.toLowerCase();
      if (lowerCaseResponse.includes("gentlepat()")) {
        console.log("Trigger detected: gentlePat");
        onCategorySelect("gentlePat");
      } else if (lowerCaseResponse.includes("gentlestroke()")) {
        console.log("Trigger detected: gentleStroke");
        onCategorySelect("gentleStroke");
      } else if (lowerCaseResponse.includes("firmgrip()")) {
        console.log("Trigger detected: firmGrip");
        onCategorySelect("firmGrip");
      } else if (lowerCaseResponse.includes("deny()")) {
        console.log("Trigger detected: deny");
        onCategorySelect("deny");
      } else if (lowerCaseResponse.includes("stop()")) {
        console.log("Trigger detected: stop");
        onCategorySelect("stop");
      } else if (lowerCaseResponse.includes("rapidheadstroke()")) {
        console.log("Trigger detected: rapidHeadStroke");
        onCategorySelect("rapidHeadStroke");
      } else if (lowerCaseResponse.includes("mouthcommand()")) {
        console.log("Trigger detected: mouthCommand");
        onCategorySelect("mouthCommand");
      } else if (lowerCaseResponse.includes("threateninggrip()")) {
        console.log("Trigger detected: threateningGrip");
        onCategorySelect("threateningGrip");
      } else if (lowerCaseResponse.includes("ultimatedrain()")) {
        console.log("Trigger detected: ultimateDrain");
        onCategorySelect("ultimateDrain");
      } else if (lowerCaseResponse.includes("soothingtouch()")) {
        console.log("Trigger detected: soothingTouch");
        onCategorySelect("soothingTouch");
      } else if (lowerCaseResponse.includes("punishpulse()")) {
        console.log("Trigger detected: punishPulse");
        onCategorySelect("punishPulse");
      } else if (lowerCaseResponse.includes("slowagonystroke()")) {
        console.log("Trigger detected: slowAgonyStroke");
        onCategorySelect("slowAgonyStroke");
      } else if (lowerCaseResponse.includes("basegrip()")) {
        console.log("Trigger detected: baseGrip");
        onCategorySelect("baseGrip");
      } else if (lowerCaseResponse.includes("initialseizure()")) {
        console.log("Trigger detected: initialSeizure");
        onCategorySelect("initialSeizure");
      } else if (lowerCaseResponse.includes("relentlessstroke()")) {
        console.log("Trigger detected: relentlessStroke");
        onCategorySelect("relentlessStroke");
      } else if (lowerCaseResponse.includes("punishingsqueeze()")) {
        console.log("Trigger detected: punishingSqueeze");
        onCategorySelect("punishingSqueeze");
      } else {
        console.log("No trigger word found in AI response.");
      }

    } catch (error) {
      console.error("Error connecting to model:", error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["llm-connector"]}>
      <div className={styles["settings-container"]}>
        <label>
          Base URL:
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://localhost:10001"
          />
        </label>
        <label>
          Base Model:
          <input
            type="text"
            value={baseModel}
            onChange={(e) => setBaseModel(e.target.value)}
            placeholder="ollama/llama2"
          />
        </label>
      </div>

      <div className={styles["left-panel"]}>
        <LocalChatManager
          conversationHistory={conversationHistories[selectedCharacter] || []}
          onSendMessage={handleSend}
          onResetConversation={() => resetConversation(selectedCharacter)}
          onRemoveLastInteraction={() => removeLastInteraction(selectedCharacter)}
          apiKey={apiKey}
          onApiKeyChange={(e) => setApiKey(e.target.value)}
          loading={loading}
          temporaryResponse={response}
        />
      </div>

      <div className={styles["right-panel"]}>
        <CharacterManager />
      </div>
    </div>
  );
};

export default LocalConnector;
