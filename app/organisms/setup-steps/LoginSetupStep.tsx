import React, { FC, FormEventHandler, useEffect, useState } from 'react';
import { CenteredLayout } from '../../atoms/CenteredLayout';
import { Heading } from '../../atoms/Heading';
import { SetupStepProps } from '../../../types/SetupStepProps';
import { Form, Input, SubmitButton } from '../../atoms/Form';
import { Database } from '../../utils/Database';
import { Authentication } from '../../utils/Authentication';

export const LoginSetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true);
    await Database.setConfiguration({ clientId });
    await Authentication.login();
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
    <CenteredLayout>
      <Heading level={1}>Login</Heading>

      <Form onSubmit={handleSubmit}>
        <Input
          label="ClientId"
          required
          readOnly={loading}
          value={clientId}
          onChange={(event) => setClientId(event.target.value)}
        />

        <SubmitButton loading={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </SubmitButton>
      </Form>
    </CenteredLayout>
  );
};
