import { FC, useCallback, useState } from 'react';
import SetupStepProps from '../../types/SetupStepProps';
import App from './App';
import LoginSetupStep from './setup-steps/LoginSetupStep';
import RootDirectorySetupStep from './setup-steps/RootDirectorySetupStep';
import PreRootDirectorySetupStep from './setup-steps/PreRootDirectorySetupStep';

const SetupSteps: Array<FC<SetupStepProps>> = [
  LoginSetupStep,
  PreRootDirectorySetupStep,
  RootDirectorySetupStep,
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
