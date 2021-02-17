import React, { FC } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import SetupStepTitle from '../../atoms/SetupStepTitle';
import Button from '../../atoms/Button';

const WelcomePageSetupStep: FC<SetupStepProps> = ({ stepReady }) => (
  <>
    <SetupStepTitle>Iris</SetupStepTitle>
    <p>The missing OneDrive gallery.</p>

    <Button type="button" onClick={() => stepReady()}>
      Start
    </Button>
  </>
);

export default WelcomePageSetupStep;
