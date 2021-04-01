import { FC, MouseEventHandler } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import Authentication from '../../utils/Authentication';
import { View } from '../../atoms/View';
import { Title } from '../../atoms/Title';
import { Paragraph } from '../../atoms/Paragraph';
import Button from '../../atoms/Button';
import Spacer from '../../atoms/Spacer';
import styles from './LoginSetupStep.module.css';

const LoginSetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    await Authentication.login();
    stepReady();
  };

  return (
    <View centered>
      <header>
        <img className={styles.image} src="/icons/favicon/192.png" alt="" />
        <Spacer height="small" />
        <Title>Iris</Title>
      </header>

      <Spacer height="regular" />

      <Paragraph>
        The missing OneDrive gallery
        <br />
        you were waiting for
      </Paragraph>

      <Spacer height="large" />

      <Button large onClick={handleClick}>
        Login with Microsoft
      </Button>
    </View>
  );
};

export default LoginSetupStep;
