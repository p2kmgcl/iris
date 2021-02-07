import React, { FC } from 'react';
import { CenteredLayout } from '../../atoms/CenteredLayout';
import { Button } from '../../atoms/Button';
import { Heading } from '../../atoms/Heading';
import { SetupStepProps } from '../../../types/SetupStepProps';

export const ReadySetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  return (
    <CenteredLayout>
      <Heading level={1}>You're ready to go!</Heading>
      <Button variant="primary" onClick={() => stepReady()}>
        Start scanning photos
      </Button>
    </CenteredLayout>
  );
};
