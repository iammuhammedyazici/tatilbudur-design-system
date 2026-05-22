import React, { useState } from 'react';
import { colors, spacing, radius, fontSize } from '../../theme';
import type { InputProps, InputSize, InputStatus } from './Input.types';

const sizeStyles: Record<InputSize, { minHeight: number; fontSize: number; padding: string }> = {
  sm: { minHeight: 36, fontSize: fontSize.sm, padding: `${spacing[2]}px ${spacing[3]}px` },
  md: { minHeight: 44, fontSize: fontSize.base, padding: `${spacing[3]}px ${spacing[4]}px` },
  lg: { minHeight: 52, fontSize: fontSize.lg, padding: `${spacing[4]}px ${spacing[5]}px` },
};

const statusColors: Record<InputStatus, { border: string; focus: string; helper: string }> = {
  default: {
    border: colors.gray[300],
    focus: colors.primary[500],
    helper: colors.gray[500],
  },
  error: {
    border: colors.danger[500],
    focus: colors.danger[600],
    helper: colors.danger[600],
  },
  success: {
    border: colors.success[500],
    focus: colors.success[600],
    helper: colors.success[600],
  },
};

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  helperText,
  size = 'md',
  status = 'default',
  disabled = false,
  readOnly = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  required = false,
  type = 'text',
  testID,
}) => {
  const [focused, setFocused] = useState(false);
  const colors_ = statusColors[status];
  const isInteractive = !disabled && !readOnly;

  const borderColor = focused && isInteractive ? colors_.focus : colors_.border;

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: spacing[1],
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    border: `1.5px solid ${borderColor}`,
    borderRadius: radius.md,
    backgroundColor: disabled ? colors.gray[50] : colors.white,
    transition: 'border-color 0.15s',
    minHeight: sizeStyles[size].minHeight,
    padding: sizeStyles[size].padding,
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: sizeStyles[size].fontSize,
    color: colors.gray[900],
    fontFamily: 'inherit',
    minWidth: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: fontSize.sm,
    fontWeight: 500,
    color: colors.gray[700],
  };

  const helperStyle: React.CSSProperties = {
    fontSize: fontSize.xs,
    color: colors_.helper,
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: colors.danger[500] }}> *</span>}
        </label>
      )}

      <div style={wrapperStyle}>
        {leftIcon && (
          <span style={{ display: 'inline-flex', color: colors.gray[400] }}>
            {leftIcon}
          </span>
        )}

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          onChange={(e) => onChangeText?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
          data-testid={testID}
        />

        {rightIcon && (
          <span style={{ display: 'inline-flex', color: colors.gray[400] }}>
            {rightIcon}
          </span>
        )}
      </div>

      {helperText && <span style={helperStyle}>{helperText}</span>}
    </div>
  );
};
