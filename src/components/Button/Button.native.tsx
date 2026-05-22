import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors, spacing, radius, fontSize } from "../../theme";
import type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";

const variantStyles: Record<
  ButtonVariant,
  { container: ViewStyle; text: TextStyle }
> = {
  primary: {
    container: { backgroundColor: colors.primary[500] },
    text: { color: colors.white },
  },
  secondary: {
    container: { backgroundColor: colors.gray[100] },
    text: { color: colors.gray[900] },
  },
  outline: {
    container: {
      backgroundColor: colors.white,
      borderWidth: 1.5,
      borderColor: colors.primary[500],
    },
    text: { color: colors.primary[500] },
  },
  ghost: {
    container: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: colors.gray[200],
    },
    text: { color: colors.primary[500] },
  },
  danger: {
    container: { backgroundColor: colors.danger[500] },
    text: { color: colors.white },
  },
};

const sizeStyles: Record<
  ButtonSize,
  { container: ViewStyle; text: TextStyle }
> = {
  sm: {
    container: {
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[3],
      minHeight: 32,
    },
    text: { fontSize: fontSize.sm },
  },
  md: {
    container: {
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[5],
      minHeight: 40,
    },
    text: { fontSize: fontSize.base },
  },
  lg: {
    container: {
      paddingVertical: spacing[4],
      paddingHorizontal: spacing[6],
      minHeight: 48,
    },
    text: { fontSize: fontSize.lg },
  },
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  testID,
}) => {
  const isDisabled = disabled || loading;
  const spinnerColor =
    variant === "outline" || variant === "ghost"
      ? colors.primary[500]
      : colors.white;

  const containerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    borderRadius: radius.full,
    opacity: isDisabled ? 0.5 : 1,
    width: fullWidth ? "100%" : undefined,
    alignSelf: fullWidth ? "stretch" : "flex-start",
    ...variantStyles[variant].container,
    ...sizeStyles[size].container,
  };

  const textStyle: TextStyle = {
    fontWeight: "600",
    ...variantStyles[variant].text,
    ...sizeStyles[size].text,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={containerStyle}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          {typeof children === "string" ? (
            <Text style={textStyle}>{children}</Text>
          ) : (
            children
          )}
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};
