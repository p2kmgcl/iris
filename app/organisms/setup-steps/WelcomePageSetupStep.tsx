import React, { FC } from 'react';
import { CenteredLayout } from '../../atoms/CenteredLayout';
import { Button } from '../../atoms/Button';
import { Heading } from '../../atoms/Heading';
import { SetupStepProps } from '../../../types/SetupStepProps';

export const WelcomePageSetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  return (
    <CenteredLayout>
      <Heading level={1}>Iris</Heading>
      <Button variant="primary" onClick={() => stepReady()}>
        Welcome
      </Button>
    </CenteredLayout>
  );
};
