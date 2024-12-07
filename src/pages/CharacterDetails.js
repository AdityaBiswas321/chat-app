import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "../CSS/characterdetails.css"; // Make sure to import the CSS

function CharacterDetails() {
  const { characterKey } = useParams();
  const { characters } = useAppContext();
  const location = useLocation();
  const character = characters[characterKey] || location.state?.character;

  // Dynamically change the background of div.App
  useEffect(() => {
    const appDiv = document.querySelector("div.App");
    if (appDiv) {
      appDiv.style.backgroundImage = `url(${character?.image || "default.jpg"})`;
      appDiv.style.backgroundSize = "cover";
      appDiv.style.backgroundPosition = "center";
      appDiv.style.filter = "blur(0px)"; // Reduced blur
      appDiv.style.opacity = "0.95"; // Adjusted opacity for better visibility
    }

    // Cleanup on unmount
    return () => {
      if (appDiv) {
        appDiv.style.backgroundImage = "";
        appDiv.style.backgroundSize = "";
        appDiv.style.backgroundPosition = "";
        appDiv.style.filter = "";
        appDiv.style.opacity = "";
      }
    };
  }, [character]);

  // Helper function to parse commands into structured data
  const parseCommands = (commands) => {
    if (!commands) return [];
    const commandLines = commands.split("\n").filter((line) => line.includes(":"));
    return commandLines.map((line) => {
      const [name, description] = line.split(":").map((str) => str.trim());
      return { name, description };
    });
  };

  // Parse the character's commands into a structured array
  const parsedCommands = parseCommands(character?.commands);

  if (!character) {
    return <div>Import To See Details!</div>;
  }

  return (
    <div className="character-details-page">
      {/* Blurred background image */}
      <div
        className="character-details-background"
        style={{
          backgroundImage: `url(${character.image || "default.jpg"})`,
        }}
      ></div>

      <header className="character-details-header">
        <h1>{character.name}</h1>
        <img
          src={character.image || "default.jpg"}
          alt={`${character.name} image`}
          className="character-details-image"
        />
      </header>

      <section className="character-details-content">
        <p>
          <strong>Traits:</strong> {character.personalityTraits?.join(", ") || "N/A"}
        </p>
        <p>
          <strong>Background:</strong> {character.backgroundStory || "N/A"}
        </p>
        <p>
          <strong>Interaction Type:</strong> {character.interactionType || "N/A"}
        </p>
        <p>
          <strong>Goals:</strong> {character.goals || "N/A"}
        </p>
        <p>
          <strong>Reaction Style:</strong> {character.reactionStyle || "N/A"}
        </p>
        <div className="character-details-prompt">
          <h3>Prompt</h3>
          <pre>{character.prompt?.trim() || "N/A"}</pre>
        </div>
        <div className="character-details-commands">
          <h3>Commands</h3>
          {parsedCommands.length > 0 ? (
            <div className="command-cards">
              {parsedCommands.map((command, index) => (
                <div key={index} className="command-card">
                  <h4>{command.name}</h4>
                  <p>{command.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>N/A</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default CharacterDetails;
