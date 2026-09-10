import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
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

const keyboardMap: Record<NonNullable<InputProps['type']>, KeyboardTypeOptions> = {
  text: 'default',
  email: 'email-address',
  password: 'default',
  number: 'numeric',
  tel: 'phone-pad',
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

  const containerStyle: ViewStyle = {
    flexDirection: 'column',
    gap: spacing.xs,
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.6 : 1,
  };

  const wrapperStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
    borderWidth: 1.5,
    borderColor,
    borderRadius: radius.md,
    backgroundColor: disabled ? colors.neutral.bg : colors.white,
    minHeight: sizeTokens.minHeight,
    paddingVertical: sizeTokens.paddingV,
    paddingHorizontal: sizeTokens.paddingH,
  };

  const inputStyle: TextStyle = {
    flex: 1,
    fontSize: sizeTokens.fontSize,
    color: colors.neutral.text,
    padding: 0,
  };

  const labelStyle: TextStyle = {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as TextStyle['fontWeight'],
    color: colors.neutral.text,
  };

  const helperStyle: TextStyle = {
    fontSize: fontSize.xs,
    color: stateColors.helper,
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={labelStyle}>
          {label}
          {required && <Text style={{ color: colors.error.default }}> *</Text>}
        </Text>
      )}

      <View style={wrapperStyle}>
        {leftIcon && <View>{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral.placeholder}
          editable={isInteractive}
          secureTextEntry={type === 'password'}
          keyboardType={keyboardMap[type]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
          testID={testID}
        />

        {rightIcon && <View>{rightIcon}</View>}
      </View>

      {helperText && <Text style={helperStyle}>{helperText}</Text>}
    </View>
  );
};
