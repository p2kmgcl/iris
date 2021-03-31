import { FC } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import SetupStep from '../../atoms/SetupStep';
import { LandingPage } from '../../atoms/LandingPage';
import { Circle } from '../../atoms/Circle';
import { AiOutlineSearch } from 'react-icons/ai';
import { Text } from '../../atoms/Text';

const PreRootDirectorySetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  return (
    <SetupStep>
      <LandingPage
        Banner={
          <Text size={8}>
            <Circle>
              <AiOutlineSearch />
            </Circle>
          </Text>
        }
        title={
          <>
            Select where
            <br />
            your photos are
          </>
        }
        subtitle={
          <>
            Iris will scan this folder
            <br />
            periodically and show you
            <br />
            all your photos.
          </>
        }
        buttonLabel="Select folder"
        onButtonClick={stepReady}
      />
    </SetupStep>
  );
};

export default PreRootDirectorySetupStep;
