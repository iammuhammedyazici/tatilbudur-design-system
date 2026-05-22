import React from "react";
import { colors, spacing, radius, fontSize } from "../../theme";
import type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: colors.primary[500],
    color: colors.white,
    border: "none",
  },
  secondary: {
    backgroundColor: colors.gray[100],
    color: colors.gray[900],
    border: "none",
  },
  outline: {
    backgroundColor: colors.white,
    color: colors.primary[500],
    border: `1.5px solid ${colors.primary[500]}`,
  },
  ghost: {
    backgroundColor: colors.transparent,
    color: colors.primary[500],
    border: `1.5px solid ${colors.gray[200]}`,
  },
  danger: {
    backgroundColor: colors.danger[500],
    color: colors.white,
    border: "none",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: `${spacing[2]}px ${spacing[3]}px`,
    fontSize: fontSize.sm,
    minHeight: 32,
  },
  md: {
    padding: `${spacing[3]}px ${spacing[5]}px`,
    fontSize: fontSize.base,
    minHeight: 40,
  },
  lg: {
    padding: `${spacing[4]}px ${spacing[6]}px`,
    fontSize: fontSize.lg,
    minHeight: 48,
  },
};

const Spinner: React.FC<{ color: string; size: number }> = ({
  color,
  size,
}) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      border: `2px solid ${color}`,
      borderTopColor: "transparent",
      borderRadius: "50%",
      animation: "tb-spin 0.6s linear infinite",
    }}
  />
);

const SpinnerKeyframes = () => (
  <style>{`
    @keyframes tb-spin {
      to { transform: rotate(360deg); }
    }
  `}</style>
);

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
  const spinnerSize = size === "sm" ? 12 : size === "md" ? 16 : 20;
  const spinnerColor =
    variant === "outline" || variant === "ghost"
      ? colors.primary[500]
      : colors.white;

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    borderRadius: radius.full,
    fontWeight: 600,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.5 : 1,
    transition: "opacity 0.15s, transform 0.05s",
    fontFamily: "inherit",
    width: fullWidth ? "100%" : "auto",
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  return (
    <>
      <SpinnerKeyframes />
      <button
        type="button"
        style={baseStyle}
        disabled={isDisabled}
        onClick={onPress}
        data-testid={testID}
      >
        {loading ? (
          <Spinner color={spinnerColor} size={spinnerSize} />
        ) : (
          <>
            {leftIcon && (
              <span style={{ display: "inline-flex" }}>{leftIcon}</span>
            )}
            <span>{children}</span>
            {rightIcon && (
              <span style={{ display: "inline-flex" }}>{rightIcon}</span>
            )}
          </>
        )}
      </button>
    </>
  );
};
