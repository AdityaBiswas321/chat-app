// useAIInteraction.js
import { useState, useEffect } from 'react';

const useAIInteraction = ({
  isInSession,
  setIsInSession,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isInSession) {
      setIsListening(true);
    } else {
      setIsListening(false);
    }
  }, [isInSession]);

  const startInteraction = () => {
    console.log("Starting interaction in useAIInteraction...");
    setIsInSession(true);
  };

  const endInteraction = () => {
    console.log("Ending interaction in useAIInteraction...");
    setIsInSession(false);
  };

  const resetConversation = () => {
    console.log("Resetting conversation history...");
  };

  const removeLastInteraction = () => {
    console.log("Removing last interaction...");
  };

  return {
    isListening,
    isLoading,
    startInteraction,
    endInteraction,
    resetConversation,
    removeLastInteraction,
  };
};

export default useAIInteraction;
