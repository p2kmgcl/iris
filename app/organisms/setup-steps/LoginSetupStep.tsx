import { FC, useState, MouseEventHandler, useEffect } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import Authentication from '../../utils/Authentication';
import Button from '../../atoms/Button';
import { AiOutlineUser } from 'react-icons/ai';
import Spacer from '../../atoms/Spacer';
import SetupStep from '../../atoms/SetupStep';

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

  useEffect(() => {
    Authentication.isAuthenticated().then((isAuthenticated) => {
      if (isAuthenticated) {
        setLoading(true);
        stepReady();
      }
    });
  }, [stepReady]);

  return (
    <SetupStep title="Account">
      <Button disabled={loading} type="button" onClick={handleClick}>
        <AiOutlineUser />
        <Spacer size={0.5} />
        {loading ? 'Signing in' : 'Sign in'}
      </Button>
      {loginError ? <p>{loginError}</p> : null}
    </SetupStep>
  );
};

export default LoginSetupStep;
