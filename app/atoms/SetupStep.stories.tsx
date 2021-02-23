import React from 'react';
import SetupStep from './SetupStep';

export default {
  title: 'atoms/SetupStep',
  component: SetupStep,
};

export const Default = () => (
  <SetupStep title="First step">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam numquam
      voluptas rem eaque inventore cum odio harum, sapiente non aspernatur
      tempora at ex? Esse perferendis facere ducimus, dolorum facilis
      accusantium!
    </p>
  </SetupStep>
);

export const Iris = () => (
  <SetupStep title="Iris">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam numquam
      voluptas rem eaque inventore cum odio harum, sapiente non aspernatur
      tempora at ex? Esse perferendis facere ducimus, dolorum facilis
      accusantium!
    </p>
  </SetupStep>
);

export const LongStepTitle = () => (
  <SetupStep title="You are ready to go!">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam numquam
      voluptas rem eaque inventore cum odio harum, sapiente non aspernatur
      tempora at ex? Esse perferendis facere ducimus, dolorum facilis
      accusantium!
    </p>
  </SetupStep>
);
