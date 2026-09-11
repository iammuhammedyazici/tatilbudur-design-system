import { forwardRef, useId, useState } from 'react';
import type { CSSProperties, InputHTMLAttributes } from 'react';
import ErrorIcon from '../../icons/web/Warning';
import EyeIcon from '../../icons/web/Eye';
import EyeOffIcon from '../../icons/web/EyeOff';
import type { InputProps } from './Input.types';
import { inputHeights, inputTokens as tokens } from './Input.tokens';
import { useInputState } from './useInputState';

export interface WebInputProps
  extends InputProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      keyof InputProps | 'size' | 'type'
    > {
  containerStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  helperTextStyle?: CSSProperties;
}

export const Input = forwardRef<HTMLInputElement, WebInputProps>(function Input(
  {
    type = 'text',
    label,
    error,
    helperText,
    size = 'md',
    status = 'default',
    disabled = false,
    readOnly = false,
    editable = true,
    leftIcon,
    rightIcon,
    onRightIconPress,
    rightIconAccessibilityLabel,
    fullWidth = false,
    required = false,
    testID,
    value,
    defaultValue,
    onChangeText,
    maxLength,
    style,
    containerStyle,
    labelStyle,
    helperTextStyle,
    id,
    onChange,
    onFocus,
    onBlur,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const [focused, setFocused] = useState(false);
  const state = useInputState({
    type,
    value,
    defaultValue,
    onChangeText,
    maxLength,
    error,
    helperText,
    status,
  });
  const isReadOnly = readOnly || !editable;
  const icon =
    rightIcon ??
    (state.showPasswordIcon ? (
      state.passwordVisible ? (
        <EyeIcon />
      ) : (
        <EyeOffIcon />
      )
    ) : undefined);
  const iconAction =
    onRightIconPress ?? (state.isPassword ? state.togglePassword : undefined);
  const iconLabel =
    rightIconAccessibilityLabel ??
    (state.isPassword
      ? state.passwordVisible
        ? 'Şifreyi gizle'
        : 'Şifreyi göster'
      : 'Alan işlemi');
  const messageColor = state.hasError
    ? tokens.error
    : status === 'success'
    ? '#10B981'
    : tokens.placeholder;
  const iconStyle: CSSProperties = {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.gap,
        width: fullWidth ? '100%' : undefined,
        minWidth: 0,
        opacity: disabled ? 0.6 : 1,
        ...containerStyle,
      }}
    >
      <style>{`input[data-tb-input]::placeholder { color: ${tokens.placeholder}; opacity: 1; }`}</style>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: tokens.fontSize,
            fontFamily: tokens.fontWeb,
            fontWeight: 500,
            color: tokens.text,
            marginBottom: 2,
            ...labelStyle,
          }}
        >
          {label}
          {required && (
            <span aria-hidden="true" style={{ color: tokens.error }}>
              {' '}
              *
            </span>
          )}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: inputHeights[size],
          borderRadius: tokens.radius,
          border: `${tokens.borderWidth}px solid ${
            state.hasError
              ? tokens.error
              : status === 'success'
              ? '#10B981'
              : tokens.border
          }`,
          background: state.hasError
            ? tokens.errorBackground
            : tokens.background,
          padding: `0 ${tokens.paddingHorizontal}px`,
          gap: tokens.iconGap,
          boxSizing: 'border-box',
          outline: focused ? '2px solid #004CAA' : undefined,
          outlineOffset: 2,
        }}
      >
        {leftIcon && <span style={iconStyle}>{leftIcon}</span>}
        <input
          {...props}
          ref={ref}
          id={inputId}
          data-testid={testID}
          data-tb-input=""
          type={
            state.isTc
              ? 'text'
              : state.isPassword
              ? state.passwordVisible
                ? 'text'
                : 'password'
              : type
          }
          inputMode={state.isTc ? 'numeric' : props.inputMode}
          value={state.value}
          maxLength={state.maxLength}
          disabled={disabled}
          readOnly={isReadOnly}
          required={required}
          aria-invalid={state.hasError || props['aria-invalid']}
          aria-describedby={
            [props['aria-describedby'], state.message ? messageId : undefined]
              .filter(Boolean)
              .join(' ') || undefined
          }
          onChange={(event) => {
            event.currentTarget.value = state.changeText(
              event.currentTarget.value
            );
            onChange?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={{
            flex: 1,
            width: 0,
            minWidth: 0,
            height: '100%',
            border: 0,
            padding: 0,
            outline: 'none',
            background: 'transparent',
            fontFamily: tokens.fontWeb,
            fontSize: tokens.fontSize,
            color: tokens.text,
            boxSizing: 'border-box',
            ...style,
          }}
        />
        {icon &&
          (iconAction ? (
            <button
              type="button"
              onClick={iconAction}
              disabled={disabled || !editable}
              aria-label={iconLabel}
              aria-pressed={
                state.isPassword && !onRightIconPress
                  ? state.passwordVisible
                  : undefined
              }
              data-testid={testID && `${testID}-right-icon`}
              onMouseDown={(event) => event.preventDefault()}
              style={{
                ...iconStyle,
                border: 0,
                background: 'transparent',
                padding: 0,
                cursor: disabled || !editable ? 'default' : 'pointer',
              }}
            >
              {icon}
            </button>
          ) : (
            <span
              style={iconStyle}
              data-testid={testID && `${testID}-right-icon`}
            >
              {icon}
            </span>
          ))}
      </div>
      {state.message && (
        <div
          id={messageId}
          role={state.hasError ? 'alert' : undefined}
          data-testid={state.hasError && testID ? `${testID}-error` : undefined}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 4,
            marginTop: 4,
          }}
        >
          {state.hasError && (
            <ErrorIcon
              width={12}
              height={12}
              color={tokens.error}
              aria-hidden="true"
              style={{ marginTop: 2, flexShrink: 0 }}
            />
          )}
          <span
            style={{
              flex: 1,
              fontFamily: tokens.fontWeb,
              fontSize: tokens.helperFontSize,
              color: messageColor,
              ...helperTextStyle,
            }}
          >
            {state.message}
          </span>
        </div>
      )}
    </div>
  );
});
