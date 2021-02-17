import React, { FC, FormEventHandler, useEffect, useState } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import Database from '../../utils/Database';
import Authentication from '../../utils/Authentication';
import SetupStepTitle from '../../atoms/SetupStepTitle';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import { AiOutlineUser } from 'react-icons/ai';
import Spacer from '../../atoms/Spacer';

const LoginSetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true);

    const popupWindow = window.open() as Window;

    await Database.setConfiguration({ clientId });
    await Authentication.login(popupWindow);

    setLoading(false);
    stepReady();
  };

  useEffect(() => {
    Database.getConfiguration().then((configuration) => {
      if (
        configuration.clientId &&
        configuration.accessToken &&
        configuration.refreshToken
      ) {
        setClientId(configuration.clientId);
        setLoading(true);
        setTimeout(() => stepReady(), 2000);
      } else {
        setClientId(configuration.clientId);
      }
    });
  }, []);

  return (
    <>
      <SetupStepTitle>Account</SetupStepTitle>

      <form onSubmit={handleSubmit}>
        <Input
          disabled={loading}
          label="Client ID"
          value={clientId}
          onChange={(event) => setClientId(event.target.value)}
        />

        <Spacer block size={2} />

        <Button disabled={loading} type="submit">
          <AiOutlineUser />
          <Spacer size={0.5} />
          {loading ? 'Signing in' : 'Sign in'}
        </Button>
      </form>
    </>
  );
};

export default LoginSetupStep;
