import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, radius, fontSize, fontWeight } from '../../theme/spacing';
import type { ButtonProps, ButtonStyle, ButtonVariant, ButtonSize } from './Button.types';

// ============ SIZE TOKENS ============
const sizeMap: Record<ButtonSize, {
  height: number;
  minWidth: number;
  paddingV: number;
  paddingH: number;
  gap: number;
  fontSize: number;
  iconOnlyWidth: number;
}> = {
  sm: {
    height: 32,
    minWidth: 80,
    paddingV: spacing.default,
    paddingH: spacing.default,
    gap: spacing.default,
    fontSize: fontSize.sm,
    iconOnlyWidth: 32,
  },
  md: {
    height: 40,
    minWidth: 100,
    paddingV: spacing.default,
    paddingH: spacing.default,
    gap: spacing.default,
    fontSize: fontSize.base,
    iconOnlyWidth: 40,
  },
  lg: {
    height: 48,
    minWidth: 120,
    paddingV: spacing.medium,
    paddingH: spacing.large,
    gap: spacing.default,
    fontSize: fontSize.base,
    iconOnlyWidth: 48,
  },
};

// ============ STYLE × VARIANT MATRIX ============
type StateColors = { bg: string; text: string; border: string };
type VariantStateMap = {
  default: StateColors;
  pressed: StateColors;
  disabled: StateColors;
};

const styleVariantMap: Record<ButtonStyle, Record<ButtonVariant, VariantStateMap>> = {
  filled: {
    primary: {
      default: { bg: colors.primary.default, text: colors.white, border: 'transparent' },
      pressed: { bg: colors.primary.pressed, text: colors.white, border: 'transparent' },
      disabled: { bg: colors.disable, text: colors.white, border: 'transparent' },
    },
    secondary: {
      default: { bg: colors.secondary.default, text: colors.white, border: 'transparent' },
      pressed: { bg: colors.secondary.pressed, text: colors.white, border: 'transparent' },
      disabled: { bg: colors.disable, text: colors.white, border: 'transparent' },
    },
    tertiary: {
      default: { bg: colors.tertiary.bgDefault, text: colors.tertiary.default, border: colors.tertiary.default },
      pressed: { bg: colors.tertiary.pressed, text: colors.white, border: colors.tertiary.pressed },
      disabled: { bg: colors.disable, text: colors.white, border: 'transparent' },
    },
  },
  outline: {
    primary: {
      default: { bg: 'transparent', text: colors.primary.default, border: colors.primary.default },
      pressed: { bg: colors.primary.pressedBg, text: colors.primary.pressed, border: colors.primary.pressed },
      disabled: { bg: 'transparent', text: colors.disable, border: colors.disable },
    },
    secondary: {
      default: { bg: 'transparent', text: colors.secondary.default, border: colors.secondary.default },
      pressed: { bg: colors.secondary.pressedBg, text: colors.secondary.pressed, border: colors.secondary.pressed },
      disabled: { bg: 'transparent', text: colors.disable, border: colors.disable },
    },
    tertiary: {
      default: { bg: 'transparent', text: colors.tertiary.default, border: colors.tertiary.default },
      pressed: { bg: colors.tertiary.pressed, text: colors.white, border: colors.tertiary.pressed },
      disabled: { bg: 'transparent', text: colors.disable, border: colors.disable },
    },
  },
  ghost: {
    primary: {
      default: { bg: 'transparent', text: colors.primary.default, border: 'transparent' },
      pressed: { bg: colors.primary.hover, text: colors.primary.pressed, border: 'transparent' },
      disabled: { bg: 'transparent', text: colors.disable, border: 'transparent' },
    },
    secondary: {
      default: { bg: 'transparent', text: colors.secondary.default, border: 'transparent' },
      pressed: { bg: colors.secondary.pressedBg, text: colors.secondary.pressed, border: 'transparent' },
      disabled: { bg: 'transparent', text: colors.disable, border: 'transparent' },
    },
    tertiary: {
      default: { bg: 'transparent', text: colors.tertiary.default, border: 'transparent' },
      pressed: { bg: colors.tertiary.pressed, text: colors.white, border: 'transparent' },
      disabled: { bg: 'transparent', text: colors.disable, border: 'transparent' },
    },
  },
  link: {
    primary: {
      default: { bg: 'transparent', text: colors.primary.default, border: 'transparent' },
      pressed: { bg: colors.primary.pressedBg, text: colors.primary.default, border: 'transparent' },
      disabled: { bg: 'transparent', text: colors.disable, border: 'transparent' },
    },
    secondary: {
      default: { bg: 'transparent', text: colors.secondary.default, border: 'transparent' },
      pressed: { bg: colors.secondary.pressedBg, text: colors.secondary.default, border: 'transparent' },
      disabled: { bg: 'transparent', text: colors.disable, border: 'transparent' },
    },
    tertiary: {
      default: { bg: 'transparent', text: colors.tertiary.default, border: 'transparent' },
      pressed: { bg: colors.tertiary.pressed, text: colors.white, border: 'transparent' },
      disabled: { bg: 'transparent', text: colors.disable, border: 'transparent' },
    },
  },
};

// ============ BUTTON ============
export const Button: React.FC<ButtonProps> = ({
  children,
  buttonStyle = 'filled',
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  testID,
}) => {
  const isDisabled = disabled || loading;
  const [isPressed, setIsPressed] = useState(false);

  const stateKey: keyof VariantStateMap = isDisabled
    ? 'disabled'
    : isPressed
    ? 'pressed'
    : 'default';

  const stateColors = styleVariantMap[buttonStyle][variant][stateKey];
  const sizeTokens = sizeMap[size];
  const isLink = buttonStyle === 'link';

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizeTokens.gap,
    height: sizeTokens.height,
    minWidth: iconOnly ? undefined : sizeTokens.minWidth,
    width: iconOnly ? sizeTokens.iconOnlyWidth : fullWidth ? '100%' : undefined,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    paddingVertical: sizeTokens.paddingV,
    paddingHorizontal: iconOnly ? 0 : sizeTokens.paddingH,
    backgroundColor: stateColors.bg,
    borderWidth: 1.5,
    borderColor: stateColors.border,
    borderRadius: isLink ? radius.sm : radius.md,
  };

  const textStyle: TextStyle = {
    color: stateColors.text,
    fontSize: sizeTokens.fontSize,
    fontWeight: fontWeight.medium as TextStyle['fontWeight'],
    textDecorationLine: isLink ? 'underline' : 'none',
  };

  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);
  const handlePress = (_e: GestureResponderEvent) => {
    onPress?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={containerStyle}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator size="small" color={stateColors.text} />
      ) : iconOnly ? (
        <View>{leftIcon || rightIcon}</View>
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          {children && (
            typeof children === 'string' ? (
              <Text style={textStyle}>{children}</Text>
            ) : (
              children
            )
          )}
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};
