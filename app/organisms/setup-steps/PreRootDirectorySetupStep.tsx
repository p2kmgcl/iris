import { FC } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import { View } from '../../atoms/View';
import { Title } from '../../atoms/Title';
import Spacer from '../../atoms/Spacer';
import { Paragraph } from '../../atoms/Paragraph';
import Button from '../../atoms/Button';
import styles from './PreRootDirectorySetupStep.module.css';
import { Search } from 'react-feather';

const PreRootDirectorySetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  return (
    <View centered>
      <header>
        <span className={styles.icon} role="image">
          <Search size={72} />
        </span>

        <Spacer height="small" />

        <Title>
          Select where
          <br />
          your photos are
        </Title>
      </header>

      <Spacer height="regular" />

      <Paragraph>
        Iris will scan this folder
        <br />
        periodically and show you
        <br />
        all your photos.
      </Paragraph>

      <Spacer height="large" />

      <Button large onClick={stepReady}>
        Select folder
      </Button>
    </View>
  );
};

export default PreRootDirectorySetupStep;
