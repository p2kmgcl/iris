import { EventHandler, FC, MouseEvent, ReactNode } from 'react';
import Button from './Button';
import Spacer from './Spacer';
import { Text } from './Text';

export const LandingPage: FC<{
  Banner: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  buttonLabel: string;
  onButtonClick: EventHandler<MouseEvent<HTMLButtonElement>>;
}> = ({ Banner, title, subtitle, buttonLabel, onButtonClick }) => {
  return (
    <article>
      <header>
        {Banner}
        <Spacer block size={2} />
        <Text TagName="h1" block size={2.5} lineHeight={1.1}>
          {title}
        </Text>
      </header>

      <Spacer block size={2} />

      <Text variant="secondary" block>
        {subtitle}
      </Text>

      <Spacer block size={3} />

      <Button large onClick={onButtonClick}>
        {buttonLabel}
      </Button>
    </article>
  );
};
