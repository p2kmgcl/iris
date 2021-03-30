import { FC, useCallback, useState } from 'react';
import SetupStepProps from '../../types/SetupStepProps';
import App from './App';
import LoginSetupStep from './setup-steps/LoginSetupStep';
import RootDirectorySetupStep from './setup-steps/RootDirectorySetupStep';
import ReadySetupStep from './setup-steps/ReadySetupStep';

const SetupSteps: Array<FC<SetupStepProps>> = [
  LoginSetupStep,
  RootDirectorySetupStep,
  ReadySetupStep,
];

export default function Setup() {
  const [stepIndex, setStepIndex] = useState(0);
  const StepComponent = SetupSteps[stepIndex];

  const handleStepReady = useCallback(() => {
    setStepIndex((prevStepIndex) => prevStepIndex + 1);
  }, []);

  if (stepIndex >= SetupSteps.length) {
    return <App />;
  }

  if (!StepComponent) {
    throw new Error('Setup not ready, but there is no StepComponent');
  }

  return <StepComponent stepReady={handleStepReady} />;
}
