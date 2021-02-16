import React, { FC } from 'react';
import { SetupStepProps } from '../../../types/SetupStepProps';
import { SetupStepTitle } from '../../atoms/SetupStepTitle';
import { Button } from '../../atoms/Button';

export const ReadySetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  return (
    <>
      <SetupStepTitle>You're ready to go!</SetupStepTitle>

      <Button type="button" onClick={() => stepReady()}>
        Start scanning photos
      </Button>
    </>
  );
};
