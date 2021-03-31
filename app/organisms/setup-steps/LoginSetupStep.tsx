import { FC, MouseEventHandler } from 'react';
import SetupStepProps from '../../../types/SetupStepProps';
import Authentication from '../../utils/Authentication';
import SetupStep from '../../atoms/SetupStep';
import { LandingPage } from '../../atoms/LandingPage';

const LoginSetupStep: FC<SetupStepProps> = ({ stepReady }) => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    await Authentication.login();
    stepReady();
  };

  return (
    <SetupStep>
      <LandingPage
        Banner={<img src="/icons/favicon/192.png" alt="" />}
        title="Iris"
        subtitle={
          <>
            The missing OneDrive gallery
            <br />
            you were waiting for
          </>
        }
        buttonLabel="Login with Microsoft"
        onButtonClick={handleClick}
      />
    </SetupStep>
  );
};

export default LoginSetupStep;
