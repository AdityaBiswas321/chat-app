import * as Handy from "@ohdoki/handy-sdk";

// Generalized action handler for Handy functions
const executeHandyFunction = async (
  handy,
  isConnected,
  parameters,
  functionName
) => {
  if (!handy || !isConnected) {
    console.error(`${functionName} failed: Handy is not connected`);
    return;
  }

  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: parameters.min, max: parameters.max });
    await handy.setHampVelocity(parameters.velocity);
    console.log(
      `${functionName} action triggered on Handy with parameters:`,
      parameters
    );
  } catch (error) {
    console.error(`Error during ${functionName}:`, error);
  }
};
export const denyFunction = async (handy, isConnected, parameters, functionName) => {
  if (!handy || !isConnected) {
    console.error(`${functionName} failed: Handy is not connected`);
    return;
  }

  try {
    // Set the stroke zone to move to the top position
    await handy.setStrokeZone({ min: parameters.min, max: parameters.max });

    // Start the movement
    await handy.hampPlay();

    // Wait for the device to reach the top position
    await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust the delay as needed

    // Stop the movement
    await handy.hampStop();

    console.log(
      `${functionName} action triggered: Device moved to the highest position and stopped.`
    );
  } catch (error) {
    console.error(`Error during ${functionName}:`, error);
  }
};


// Export functions with parameters passed directly as arguments
export const gentlePat = async (handy, isConnected, parameters) => {
  await executeHandyFunction(handy, isConnected, parameters, "gentlePat");
};

export const gentleStroke = async (handy, isConnected, parameters) => {
  await executeHandyFunction(handy, isConnected, parameters, "gentleStroke");
};

export const firmGrip = async (handy, isConnected, parameters) => {
  await executeHandyFunction(handy, isConnected, parameters, "firmGrip");
};

export const rapidHeadStroke = async (handy, isConnected, parameters) => {
  await executeHandyFunction(handy, isConnected, parameters, "rapidHeadStroke");
};

export const mouthCommand = async (handy, isConnected, parameters) => {
  await executeHandyFunction(handy, isConnected, parameters, "mouthCommand");
};

export const threateningGrip = async (handy, isConnected, parameters) => {
  await executeHandyFunction(handy, isConnected, parameters, "threateningGrip");
};

export const ultimateDrain = async (handy, isConnected, parameters) => {
  await executeHandyFunction(handy, isConnected, parameters, "ultimateDrain");
};

export const soothingTouch = async (handy, isConnected, parameters) => {
  await executeHandyFunction(handy, isConnected, parameters, "soothingTouch");
};

export const punishPulse = async (handy, isConnected, parameters) => {
  await executeHandyFunction(handy, isConnected, parameters, "punishPulse");
};

export const slowAgonyStroke = async (handy, isConnected, parameters) => {
  await executeHandyFunction(handy, isConnected, parameters, "slowAgonyStroke");
};

export const baseGrip = async (handy, isConnected, parameters) => {
  await executeHandyFunction(handy, isConnected, parameters, "baseGrip");
};

export const initialSeizure = async (handy, isConnected, parameters) => {
  await executeHandyFunction(handy, isConnected, parameters, "initialSeizure");
};

export const relentlessStroke = async (handy, isConnected, parameters) => {
  await executeHandyFunction(
    handy,
    isConnected,
    parameters,
    "relentlessStroke"
  );
};

export const punishingSqueeze = async (handy, isConnected, parameters) => {
  await executeHandyFunction(
    handy,
    isConnected,
    parameters,
    "punishingSqueeze"
  );
};

export const handleDeny = async (handy, isConnected, parameters) => {
  await denyFunction(handy, isConnected, parameters, "handleDeny");
};

export const handleStop = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error("Handy is not connected");
    return;
  }
  console.log("Stop triggered: Stopping all motion.");
  await handy.hampStop(); // Stop the device's motion
};
