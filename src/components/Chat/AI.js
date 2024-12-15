import React, { useState } from "react";
import axios from "axios";
import { useAppContext } from "../../context/AppContext"; // Import the context
import ChatAndInput from "./ChatAndInput";
import CharacterManager from "../Character/CharacterManager";
import styles from "./ChatAppComponents.module.css";

const LLMConnector = ({ onCategorySelect }) => {
  const {
    characters,
    selectedCharacter,
    setSelectedCharacter,
    conversationHistories,
    addToConversationHistory,
    resetConversation,
    removeLastInteraction,
    apiKey,
    setApiKey,
  } = useAppContext(); // Use context

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (message) => {
    if (!apiKey) {
      setResponse("Please enter a valid API key.");
      return;
    }

    setLoading(true);

    // Get the selected character's details
    const character = characters[selectedCharacter];

    // Add the current user input to the conversation history of the selected character
    const updatedConversationHistory = [
      ...(conversationHistories[selectedCharacter] || []),
      { role: "user", content: message },
    ];

    // Combine the character's prompt and commands for the system message
    const systemMessage =
      selectedCharacter === "characterbuilder"
        ? `${character?.prompt || ""}` // Only include prompt if 'characterbuilder'
        : `${character?.prompt || ""}
           ${character?.commands || ""}`; // Include both prompt and commands for others

    // Prepare the payload for OpenAI API
    const payload = {
      model: "gpt-4o-mini", // Use GPT-4 if available
      messages: [
        { role: "system", content: systemMessage }, // Include the combined prompt and commands
        ...updatedConversationHistory, // Include the conversation history
      ],
    };

    try {
      const result = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (
        result?.data?.choices?.length > 0
      ) {
        const apiResponse = result.data.choices[0].message.content;
        setResponse(apiResponse);

        // Append the user's message and the AI's response to the conversation history
        addToConversationHistory(selectedCharacter, [
          {
            role: "user",
            content: message,
          },
          {
          role: "assistant",
          content: apiResponse,
          }
        ]);

        // Detect and handle the commands from the response
        const lowerCaseResponse = apiResponse.toLowerCase();
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
          console.error("No trigger word found in AI response.");
        }
      } else {
        setResponse("No response data available.");
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      setResponse(`Failed to fetch response: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className={styles["llm-connector"]}>
      <div className={styles["left-panel"]}>
        <ChatAndInput
          conversationHistory={conversationHistories[selectedCharacter] || []}
          onSendMessage={handleSend}
          onResetConversation={() => resetConversation(selectedCharacter)}
          onRemoveLastInteraction={() =>
            removeLastInteraction(selectedCharacter)
          }
          apiKey={apiKey}
          onApiKeyChange={(e) => setApiKey(e.target.value)}
          loading={loading}
        />
      </div>

      <div className={styles["right-panel"]}>
        <CharacterManager />
      </div>
    </div>
  );
};

export default LLMConnector;
