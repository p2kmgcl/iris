import { FC, useState, MouseEventHandler } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import Authentication from '../../utils/Authentication';
import Button from '../../atoms/Button';
import Spacer from '../../atoms/Spacer';
import SetupStep from '../../atoms/SetupStep';
import { Text } from '../../atoms/Text';
import { H1 } from '../../atoms/H1';

const LoginSetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      await Authentication.login();
      setLoading(false);
      stepReady();
    } catch (error) {
      setLoading(false);
      setLoginError(error.toString());
    }
  };

  return (
    <SetupStep>
      <header>
        <img src="/icons/favicon/192.png" alt="Iris logo" />

        <Spacer block axis="y" size={4} />

        <H1>
          <Text size={2.5}>Iris</Text>
        </H1>

        <Text variant="secondary" size={0.875}>
          The missing OneDrive gallery
          <br />
          you were waiting for.
        </Text>
      </header>

      <Spacer block axis="y" size={6} />

      <Button disabled={loading} type="button" onClick={handleClick}>
        <Spacer axis="y" size={5} />
        {loading ? 'Login in' : 'Login with Microsoft'}
      </Button>
      {loginError ? <p>{loginError}</p> : null}
    </SetupStep>
  );
};

export default LoginSetupStep;
