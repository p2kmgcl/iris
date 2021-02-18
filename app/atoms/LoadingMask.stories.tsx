import React from 'react';
import LoadingMask from './LoadingMask';

export default {
  title: 'atoms/LoadingMask',
  component: LoadingMask,
};

export const Default = () => (
  <LoadingMask loading>
    <article
      style={{
        fontSize: 30,
        textAlign: 'center',
        padding: '1em',
      }}
    >
      <p style={{ margin: 0 }}>¡Mamá! ¡mira!</p>
      <p style={{ margin: 0 }}>¡Estoy cargando!</p>
    </article>
  </LoadingMask>
);

export const DarkBackground = () => (
  <LoadingMask loading>
    <article
      style={{
        color: 'var(--primary-l1)',
        backgroundColor: 'var(--black)',
        fontSize: 30,
        textAlign: 'center',
        padding: '1em',
      }}
    >
      <p style={{ margin: 0 }}>¡Mamá! ¡mira!</p>
      <p style={{ margin: 0 }}>¡Estoy cargando!</p>
    </article>
  </LoadingMask>
);

export const LightBackground = () => (
  <LoadingMask loading>
    <article
      style={{
        color: 'var(--dark)',
        backgroundColor: 'var(--white)',
        fontSize: 30,
        textAlign: 'center',
        padding: '1em',
      }}
    >
      <p style={{ margin: 0 }}>¡Mamá! ¡mira!</p>
      <p style={{ margin: 0 }}>¡Estoy cargando!</p>
    </article>
  </LoadingMask>
);
