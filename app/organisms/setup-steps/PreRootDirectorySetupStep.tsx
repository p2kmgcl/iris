import { FC } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import Button from '../../atoms/Button';
import SetupStep from '../../atoms/SetupStep';
import Spacer from '../../atoms/Spacer';
import { H1 } from '../../atoms/H1';
import { Text } from '../../atoms/Text';
import { AiOutlineSearch } from 'react-icons/all';
import { Circle } from '../../atoms/Circle';

const PreRootDirectorySetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  return (
    <SetupStep>
      <header>
        <Text size={6} lineHeight={0.9}>
          <Circle>
            <AiOutlineSearch />
          </Circle>
        </Text>

        <Spacer block size={2} />

        <H1>
          <Text align="left" size={2.25} lineHeight={1.2}>
            Select where
            <br />
            your photos are
          </Text>
        </H1>
      </header>

      <Spacer block size={3} />

      <Text align="left" variant="secondary" block>
        Iris will scan this folder
        <br />
        periodically and show you
        <br />
        all your photos.
      </Text>

      <Spacer block size={3} />

      <Button type="button" onClick={() => stepReady()}>
        <Spacer axis="y" size={5} />
        Select folder
      </Button>
    </SetupStep>
  );
};

export default PreRootDirectorySetupStep;
