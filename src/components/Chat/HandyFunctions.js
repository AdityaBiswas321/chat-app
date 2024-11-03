import * as Handy from '@ohdoki/handy-sdk';

export const gentlePat = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: 10, max: 20 }); // Small, gentle movement
    await handy.setHampVelocity(10); // Slow, gentle speed
    console.log('gentlePat action triggered on Handy');
  } catch (error) {
    console.error('Error during gentlePat:', error);
  }
};

export const gentleStroke = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: 20, max: 50 }); // Medium stroke range
    await handy.setHampVelocity(10); // Moderate speed
    console.log('gentleStroke action triggered on Handy');
  } catch (error) {
    console.error('Error during gentleStroke:', error);
  }
};

export const firmGrip = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: 10, max: 30 }); // Larger stroke range
    await handy.setHampVelocity(20); // Stronger, faster strokes
    console.log('firmGrip action triggered on Handy');
  } catch (error) {
    console.error('Error during firmGrip:', error);
  }
};

export const rapidHeadStroke = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.setStrokeZone({ min: 100, max: 100 }); // Move to the topmost position
    await handy.hampPlay(); // Start the movement to reach the top

    // Wait for the device to reach the top before starting the rapid stroke
    setTimeout(async () => {
      await handy.setStrokeZone({ min: 90, max: 100 }); // Rapid short strokes
      await handy.setHampVelocity(10); // High speed for intense strokes
      console.log('RapidHeadStroke action triggered: Intense strokes near the top.');
    }, 500); // Adjust the delay to allow time to reach the top

  } catch (error) {
    console.error('Error during rapidHeadStroke:', error);
  }
};

export const mouthCommand = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: 40, max: 100 }); // Focus on the topmost area
    await handy.setHampVelocity(10); // Slow, teasing speed
    console.log('MouthCommand action triggered: Teasing at the tip.');
  } catch (error) {
    console.error('Error during mouthCommand:', error);
  }
};

export const threateningGrip = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: 10, max: 20 }); // Middle to upper area strokes for intensity
    await handy.setHampVelocity(25); // Faster strokes for intense pressure
    console.log('ThreateningGrip action triggered: Intense strokes.');
  } catch (error) {
    console.error('Error during threateningGrip:', error);
  }
};

export const ultimateDrain = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: 10, max: 100 }); // Full strokes for final release
    await handy.setHampVelocity(35); // Maximum speed to trigger release
    console.log('UltimateDrain action triggered: Full release triggered.');
  } catch (error) {
    console.error('Error during ultimateDrain:', error);
  }
};

export const soothingTouch = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: 10, max: 60 }); // Gentle, slow strokes
    await handy.setHampVelocity(5); // Very slow, comforting speed
    console.log('SoothingTouch action triggered: Gentle and relaxing strokes.');
  } catch (error) {
    console.error('Error during soothingTouch:', error);
  }
};

export const punishPulse = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: 80, max: 100 }); // Quick, sharp movements at the top
    await handy.setHampVelocity(25); // High velocity for intense pulses
    console.log('PunishPulse action triggered: Jolting intense strokes.');
  } catch (error) {
    console.error('Error during punishPulse:', error);
  }
};

export const slowAgonyStroke = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: 20, max: 80 }); // Middle area strokes to prolong anticipation
    await handy.setHampVelocity(5); // Extremely slow speed for maximum torture
    console.log('SlowAgonyStroke action triggered: Slow, torturous strokes.');
  } catch (error) {
    console.error('Error during slowAgonyStroke:', error);
  }
};

export const baseGrip = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: 0, max: 5 }); // Small movements near the base
    await handy.setHampVelocity(15); // Moderate speed for a firm, controlling grip
    console.log('BaseGrip action triggered: Firm grip at the base.');
  } catch (error) {
    console.error('Error during baseGrip:', error);
  }
};

export const initialSeizure = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: 10, max: 40 }); // Focus on the head (near the top)
    await handy.setHampVelocity(10); // Slow and controlled speed
    console.log('InitialSeizure action triggered: Control at the head.');
  } catch (error) {
    console.error('Error during initialSeizure:', error);
  }
};

export const relentlessStroke = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: 5, max: 60 }); // Full strokes to simulate relentless intensity
    await handy.setHampVelocity(20); // Maximum speed for relentless strokes
    console.log('RelentlessStroke action triggered: Maximum intensity strokes.');
  } catch (error) {
    console.error('Error during relentlessStroke:', error);
  }
};

export const punishingSqueeze = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.hampPlay(); // Start the movement
    await handy.setStrokeZone({ min: 0, max: 10 }); // Very small, tight movements at the base
    await handy.setHampVelocity(30); // Faster speed for a punishing squeeze
    console.log('PunishingSqueeze action triggered: Tight grip at the base.');
  } catch (error) {
    console.error('Error during punishingSqueeze:', error);
  }
};

export const handleDeny = async (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  try {
    await handy.setStrokeZone({ min: 100, max: 100 }); // Set to 100% (topmost position)
    await handy.hampPlay(); // Start the movement to go to the top

    setTimeout(async () => {
      await handy.hampStop(); // Stop all movement once the top is reached
      console.log('Deny action triggered: Device moved to the highest position and stopped.');
    }, 500); // Adjust timeout to ensure the device reaches the top

  } catch (error) {
    console.error('Error during deny action:', error);
  }
};

export const handleStop = (handy, isConnected) => {
  if (!handy || !isConnected) {
    console.error('Handy is not connected');
    return;
  }
  console.log('Stop triggered: Stopping all motion.');
  handy.hampStop(); // Stop the device's motion
};
