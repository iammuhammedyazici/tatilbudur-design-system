import { useState } from 'react';
import type { InputProps } from './Input.types';

export function useInputState(props: InputProps) {
  const [internalValue, setInternalValue] = useState(props.defaultValue ?? '');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const value = props.value ?? internalValue;
  const isTc = props.type === 'tc';
  const isPassword = props.type === 'password';
  const error =
    props.error || (props.status === 'error' ? props.helperText : undefined);
  const hasError = !!props.error || props.status === 'error';

  function changeText(text: string) {
    const next = isTc ? text.replace(/[^0-9]/g, '').slice(0, 11) : text;
    if (props.value === undefined) setInternalValue(next);
    props.onChangeText?.(next);
    return next;
  }

  return {
    value,
    changeText,
    isTc,
    isPassword,
    passwordVisible,
    togglePassword: () => setPasswordVisible((visible) => !visible),
    showPasswordIcon: isPassword && value.length > 0,
    maxLength: isTc ? 11 : props.maxLength,
    hasError,
    error,
    message: error || props.helperText,
  };
}
