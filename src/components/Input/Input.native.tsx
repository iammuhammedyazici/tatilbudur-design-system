import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { colors, spacing, radius, fontSize } from '../../theme';
import type { InputProps, InputSize, InputStatus } from './Input.types';

const sizeStyles: Record<InputSize, { minHeight: number; fontSize: number; paddingV: number; paddingH: number }> = {
  sm: { minHeight: 36, fontSize: fontSize.sm, paddingV: spacing[2], paddingH: spacing[3] },
  md: { minHeight: 44, fontSize: fontSize.base, paddingV: spacing[3], paddingH: spacing[4] },
  lg: { minHeight: 52, fontSize: fontSize.lg, paddingV: spacing[4], paddingH: spacing[5] },
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
  const colors_ = statusColors[status];
  const isInteractive = !disabled && !readOnly;

  const borderColor = focused && isInteractive ? colors_.focus : colors_.border;

  const containerStyle: ViewStyle = {
    flexDirection: 'column',
    gap: spacing[1],
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.6 : 1,
  };

  const wrapperStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    borderWidth: 1.5,
    borderColor,
    borderRadius: radius.md,
    backgroundColor: disabled ? colors.gray[50] : colors.white,
    minHeight: sizeStyles[size].minHeight,
    paddingVertical: sizeStyles[size].paddingV,
    paddingHorizontal: sizeStyles[size].paddingH,
  };

  const inputStyle: TextStyle = {
    flex: 1,
    fontSize: sizeStyles[size].fontSize,
    color: colors.gray[900],
    padding: 0,
  };

  const labelStyle: TextStyle = {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.gray[700],
  };

  const helperStyle: TextStyle = {
    fontSize: fontSize.xs,
    color: colors_.helper,
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={labelStyle}>
          {label}
          {required && <Text style={{ color: colors.danger[500] }}> *</Text>}
        </Text>
      )}

      <View style={wrapperStyle}>
        {leftIcon && <View>{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
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
