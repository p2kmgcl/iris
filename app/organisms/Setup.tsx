import React, { FC, useState } from 'react';
import { WelcomePageSetupStep } from './setup-steps/WelcomePageSetupStep';
import { SetupStepProps } from '../../types/SetupStepProps';
import { App } from './App';
import { LoginSetupStep } from './setup-steps/LoginSetupStep';
import { RootDirectorySetupStep } from './setup-steps/RootDirectorySetupStep';
import { ReadySetupStep } from './setup-steps/ReadySetupStep';
import { Box } from '@material-ui/core';

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

  const handleStepReady = () => {
    setTimeout(() => {
      setStepIndex((prevStepIndex) => prevStepIndex + 1);
    }, 100);
  };

  return (
    <Box
      style={{
        backgroundImage: 'url(/icons/favicon/512.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        height: '100vh',
      }}
    >
      <Box
        style={{
          backgroundImage:
            "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpaItHdpBxCFDdbIgKuKoVShChVIrtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APEzc1J0UVK/F9SaBHjwXE/3t173L0DhGaVqWbPOKBqlpFJJsRcflUMvEJACGFEMCAxU59Lp1PwHF/38PH1Ls6zvM/9OUJKwWSATySeZbphEW8QT29aOud94igrSwrxOfGYQRckfuS67PIb55LDAs+MGtnMPHGUWCx1sdzFrGyoxFPEMUXVKF/Iuaxw3uKsVuusfU/+wmBBW1nmOs1hJLGIJaQhQkYdFVRhIU6rRoqJDO0nPPxDjj9NLplcFTByLKAGFZLjB/+D392axckJNymYAHpfbPtjBAjsAq2GbX8f23brBPA/A1dax19rAjOfpDc6WuwICG8DF9cdTd4DLneAwSddMiRH8tMUikXg/Yy+KQ9EboH+Nbe39j5OH4AsdZW6AQ4OgdESZa97vLuvu7d/z7T7+wECsnJ6LXw7GgAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UCDQ8fMgwmsw8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAMUlEQVQI123LQREAEBRAwUUX0ggohzY/gBwOnIw9vpmXMBwdE7KPhPXGgopAu3t89w0aFwU9lFT/XwAAAABJRU5ErkJggg==')",
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <StepComponent stepReady={handleStepReady} />
      </Box>
    </Box>
  );
}
