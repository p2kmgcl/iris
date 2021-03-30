import { FC, useState, MouseEventHandler } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import Authentication from '../../utils/Authentication';
import Button from '../../atoms/Button';
import { AiOutlineUser } from 'react-icons/ai';
import Spacer from '../../atoms/Spacer';
import SetupStep from '../../atoms/SetupStep';
import { SrOnly } from '../../atoms/SrOnly';
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
        <H1>
          <Text variant="secondary">Welcome to</Text>
          <SrOnly> </SrOnly>
          <Text block size={2.5}>
            Iris
          </Text>
          <SrOnly>, </SrOnly>
          <Text variant="secondary">
            The missing OneDrive gallery
            <br />
            you were waiting for.
          </Text>
        </H1>
      </header>

      <Spacer axis="y" size={10} />

      <Button disabled={loading} type="button" onClick={handleClick}>
        <Spacer axis="y" size={5} />
        <AiOutlineUser />
        <Spacer size={0.5} />
        {loading ? 'Signing in' : 'Login with Microsoft'}
      </Button>
      {loginError ? <p>{loginError}</p> : null}
    </SetupStep>
  );
};

export default LoginSetupStep;
