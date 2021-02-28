import { FC } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import Button from '../../atoms/Button';
import SetupStep from '../../atoms/SetupStep';

const ReadySetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  return (
    <SetupStep title="You're ready to go!">
      <Button type="button" onClick={() => stepReady()}>
        Start scanning photos
      </Button>
    </SetupStep>
  );
};

export default ReadySetupStep;
