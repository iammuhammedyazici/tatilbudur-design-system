import React, { useState } from 'react';
import { colors } from '../../theme/colors';
import { spacing, radius, fontSize, fontWeight } from '../../theme/spacing';
import type { InputProps, InputSize, InputStatus } from './Input.types';

// ============ SIZE TOKENS (mobile-first touch targets) ============
const sizeMap: Record<InputSize, { minHeight: number; fontSize: number; paddingV: number; paddingH: number }> = {
  sm: { minHeight: 36, fontSize: fontSize.sm, paddingV: spacing.small, paddingH: spacing.default },
  md: { minHeight: 44, fontSize: fontSize.base, paddingV: spacing.default, paddingH: spacing.medium },
  lg: { minHeight: 52, fontSize: fontSize.base, paddingV: spacing.medium, paddingH: spacing.large },
};

const statusColors: Record<InputStatus, { border: string; focus: string; helper: string }> = {
  default: {
    border: colors.neutral.border,
    focus: colors.primary.default,
    helper: colors.neutral.textMuted,
  },
  error: {
    border: colors.error.default,
    focus: colors.error.default,
    helper: colors.error.default,
  },
  success: {
    border: colors.success.default,
    focus: colors.success.default,
    helper: colors.success.default,
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
  const stateColors = statusColors[status];
  const sizeTokens = sizeMap[size];
  const isInteractive = !disabled && !readOnly;

  const borderColor = focused && isInteractive ? stateColors.focus : stateColors.border;

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: spacing.xs,
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.small,
    border: `1.5px solid ${borderColor}`,
    borderRadius: radius.md,
    backgroundColor: disabled ? colors.neutral.bg : colors.white,
    transition: 'border-color 0.15s',
    minHeight: sizeTokens.minHeight,
    paddingTop: sizeTokens.paddingV,
    paddingBottom: sizeTokens.paddingV,
    paddingLeft: sizeTokens.paddingH,
    paddingRight: sizeTokens.paddingH,
    boxSizing: 'border-box',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: sizeTokens.fontSize,
    color: colors.neutral.text,
    fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
    minWidth: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as React.CSSProperties['fontWeight'],
    color: colors.neutral.text,
  };

  const helperStyle: React.CSSProperties = {
    fontSize: fontSize.xs,
    color: stateColors.helper,
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: colors.error.default }}> *</span>}
        </label>
      )}

      <div style={wrapperStyle}>
        {leftIcon && (
          <span style={{ display: 'inline-flex', color: colors.neutral.placeholder }}>
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
          <span style={{ display: 'inline-flex', color: colors.neutral.placeholder }}>
            {rightIcon}
          </span>
        )}
      </div>

      {helperText && <span style={helperStyle}>{helperText}</span>}
    </div>
  );
};
