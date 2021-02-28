import { FC } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import Button from '../../atoms/Button';
import SetupStep from '../../atoms/SetupStep';

const WelcomePageSetupStep: FC<SetupStepProps> = ({ stepReady }) => (
  <SetupStep title="Iris">
    <p>The missing OneDrive gallery.</p>

    <Button type="button" onClick={() => stepReady()}>
      Start
    </Button>
  </SetupStep>
);

export default WelcomePageSetupStep;
