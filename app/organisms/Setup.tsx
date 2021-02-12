import React, { FC, useState } from 'react';
import { WelcomePageSetupStep } from './setup-steps/WelcomePageSetupStep';
import { SetupStepProps } from '../../types/SetupStepProps';
import { App } from './App';
import { LoginSetupStep } from './setup-steps/LoginSetupStep';
import { RootDirectorySetupStep } from './setup-steps/RootDirectorySetupStep';
import { ReadySetupStep } from './setup-steps/ReadySetupStep';

const SetupSteps: Array<FC<SetupStepProps>> = [
  WelcomePageSetupStep,
  LoginSetupStep,
  RootDirectorySetupStep,
  ReadySetupStep,
];

export function Setup() {
  const [stepIndex, setStepIndex] = useState(0);
  const StepComponent = SetupSteps[stepIndex];

  if (stepIndex >= SetupSteps.length) {
    return <App />;
  }

  if (!StepComponent) {
    throw new Error('Setup not ready, but there is no StepComponent');
  }

  return <StepComponent stepReady={() => setStepIndex(stepIndex + 1)} />;
}
