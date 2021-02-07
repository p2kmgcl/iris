import React, {
  FC,
  FormHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  useMemo,
} from 'react';
import style from './Form.css';
import classNames from 'classnames';
import { Button, ButtonProps } from './Button';

let nextInputId = 0;

export const Form: FC<
  Omit<FormHTMLAttributes<HTMLFormElement>, 'className'>
> = (props) => {
  return <form className={style.form} {...props} />;
};

export const Input: FC<
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'> & {
    label: string;
    labelProps?: Omit<
      LabelHTMLAttributes<HTMLLabelElement>,
      'className' | 'htmlFor'
    >;
  }
> = ({ label, labelProps = {}, ...props }) => {
  const inputId = useMemo(() => `input-id-${nextInputId++}`, []);

  return (
    <>
      <label
        className={classNames(style.formCell, style.label)}
        htmlFor={inputId}
        {...labelProps}
      >
        {label}
      </label>

      <input
        className={classNames(style.formCell, style.input)}
        id={inputId}
        {...props}
      />
    </>
  );
};

export const SubmitButton: FC<
  Omit<ButtonProps, 'type' | 'className' | 'variant'>
> = (props) => (
  <>
    <span className={style.formCell} />
    <span className={style.formCell}>
      <Button {...props} type="submit" variant="primary" />
    </span>
  </>
);
