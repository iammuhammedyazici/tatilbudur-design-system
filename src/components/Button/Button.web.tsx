import React from "react";
import { colors } from "../../theme/colors";
import { spacing, radius, fontSize, fontWeight } from "../../theme/spacing";
import type {
  ButtonProps,
  ButtonStyle,
  ButtonVariant,
  ButtonSize,
} from "./Button.types";

// ============ SIZE TOKENS ============
const sizeMap: Record<
  ButtonSize,
  {
    height: number;
    minWidth: number;
    paddingV: number;
    paddingH: number;
    gap: number;
    fontSize: number;
    iconOnlyWidth: number;
  }
> = {
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
type StateColors = {
  bg: string;
  text: string;
  border: string;
};
type VariantStateMap = {
  default: StateColors;
  hover: StateColors;
  pressed: StateColors;
  disabled: StateColors;
};

const styleVariantMap: Record<
  ButtonStyle,
  Record<ButtonVariant, VariantStateMap>
> = {
  filled: {
    primary: {
      default: {
        bg: colors.primary.default,
        text: colors.white,
        border: "transparent",
      },
      hover: {
        bg: colors.primary.hover,
        text: colors.white,
        border: "transparent",
      },
      pressed: {
        bg: colors.primary.pressed,
        text: colors.white,
        border: "transparent",
      },
      disabled: {
        bg: colors.disable,
        text: colors.white,
        border: "transparent",
      },
    },
    secondary: {
      default: {
        bg: colors.secondary.default,
        text: colors.white,
        border: "transparent",
      },
      hover: {
        bg: colors.secondary.hover,
        text: colors.white,
        border: "transparent",
      },
      pressed: {
        bg: colors.secondary.pressed,
        text: colors.white,
        border: "transparent",
      },
      disabled: {
        bg: colors.disable,
        text: colors.white,
        border: "transparent",
      },
    },
    tertiary: {
      default: {
        bg: colors.tertiary.bgDefault,
        text: colors.tertiary.default,
        border: colors.tertiary.default,
      },
      hover: {
        bg: colors.tertiary.bgHover,
        text: colors.tertiary.default,
        border: colors.tertiary.default,
      },
      pressed: {
        bg: colors.tertiary.pressed,
        text: colors.white,
        border: colors.tertiary.pressed,
      },
      disabled: {
        bg: colors.disable,
        text: colors.white,
        border: "transparent",
      },
    },
  },
  outline: {
    primary: {
      default: {
        bg: "transparent",
        text: colors.primary.default,
        border: colors.primary.default,
      },
      hover: {
        bg: "transparent",
        text: colors.primary.hover,
        border: colors.primary.hover,
      },
      pressed: {
        bg: colors.primary.pressedBg,
        text: colors.primary.pressed,
        border: colors.primary.pressed,
      },
      disabled: {
        bg: "transparent",
        text: colors.disable,
        border: colors.disable,
      },
    },
    secondary: {
      default: {
        bg: "transparent",
        text: colors.secondary.default,
        border: colors.secondary.default,
      },
      hover: {
        bg: "transparent",
        text: colors.secondary.hover,
        border: colors.secondary.hover,
      },
      pressed: {
        bg: colors.secondary.pressedBg,
        text: colors.secondary.pressed,
        border: colors.secondary.pressed,
      },
      disabled: {
        bg: "transparent",
        text: colors.disable,
        border: colors.disable,
      },
    },
    tertiary: {
      default: {
        bg: "transparent",
        text: colors.tertiary.default,
        border: colors.tertiary.default,
      },
      hover: {
        bg: "transparent",
        text: colors.tertiary.default,
        border: colors.tertiary.default,
      },
      pressed: {
        bg: colors.tertiary.pressed,
        text: colors.white,
        border: colors.tertiary.pressed,
      },
      disabled: {
        bg: "transparent",
        text: colors.disable,
        border: colors.disable,
      },
    },
  },
  ghost: {
    primary: {
      default: {
        bg: "transparent",
        text: colors.primary.default,
        border: "transparent",
      },
      hover: {
        bg: "transparent",
        text: colors.primary.hover,
        border: "transparent",
      },
      pressed: {
        bg: colors.primary.hover,
        text: colors.primary.pressed,
        border: "transparent",
      },
      disabled: {
        bg: "transparent",
        text: colors.disable,
        border: "transparent",
      },
    },
    secondary: {
      default: {
        bg: "transparent",
        text: colors.secondary.default,
        border: "transparent",
      },
      hover: {
        bg: "transparent",
        text: colors.secondary.hover,
        border: "transparent",
      },
      pressed: {
        bg: colors.secondary.pressedBg,
        text: colors.secondary.pressed,
        border: "transparent",
      },
      disabled: {
        bg: "transparent",
        text: colors.disable,
        border: "transparent",
      },
    },
    tertiary: {
      default: {
        bg: "transparent",
        text: colors.tertiary.default,
        border: "transparent",
      },
      hover: {
        bg: "transparent",
        text: colors.tertiary.hover,
        border: "transparent",
      },
      pressed: {
        bg: colors.tertiary.pressed,
        text: colors.white,
        border: "transparent",
      },
      disabled: {
        bg: "transparent",
        text: colors.disable,
        border: "transparent",
      },
    },
  },
  link: {
    primary: {
      default: {
        bg: "transparent",
        text: colors.primary.default,
        border: "transparent",
      },
      hover: {
        bg: "transparent",
        text: colors.primary.hover,
        border: "transparent",
      },
      pressed: {
        bg: colors.primary.pressedBg,
        text: colors.primary.default,
        border: "transparent",
      },
      disabled: {
        bg: "transparent",
        text: colors.disable,
        border: "transparent",
      },
    },
    secondary: {
      default: {
        bg: "transparent",
        text: colors.secondary.default,
        border: "transparent",
      },
      hover: {
        bg: "transparent",
        text: colors.secondary.hover,
        border: "transparent",
      },
      pressed: {
        bg: colors.secondary.pressedBg,
        text: colors.secondary.default,
        border: "transparent",
      },
      disabled: {
        bg: "transparent",
        text: colors.disable,
        border: "transparent",
      },
    },
    tertiary: {
      default: {
        bg: "transparent",
        text: colors.tertiary.default,
        border: "transparent",
      },
      hover: { bg: "transparent", text: colors.disable, border: "transparent" },
      pressed: {
        bg: colors.tertiary.pressed,
        text: colors.white,
        border: "transparent",
      },
      disabled: {
        bg: "transparent",
        text: colors.disable,
        border: "transparent",
      },
    },
  },
};

// ============ SPINNER ============
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
      animation: "tb-btn-spin 0.6s linear infinite",
    }}
  />
);

const SpinnerKeyframes = () => (
  <style>{`
    @keyframes tb-btn-spin { to { transform: rotate(360deg); } }
  `}</style>
);

// ============ BUTTON ============
export const Button: React.FC<ButtonProps> = ({
  children,
  buttonStyle = "filled",
  variant = "primary",
  size = "md",
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
  const [isHover, setIsHover] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  // State çözümle
  const stateKey: keyof VariantStateMap = isDisabled
    ? "disabled"
    : isPressed
    ? "pressed"
    : isHover
    ? "hover"
    : "default";

  const stateColors = styleVariantMap[buttonStyle][variant][stateKey];
  const sizeTokens = sizeMap[size];
  const spinnerSize = size === "sm" ? 12 : size === "md" ? 14 : 16;

  // Link stili için underline
  const isLink = buttonStyle === "link";

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: sizeTokens.gap,
    height: sizeTokens.height,
    minWidth: iconOnly ? undefined : sizeTokens.minWidth,
    width: iconOnly ? sizeTokens.iconOnlyWidth : fullWidth ? "100%" : "auto",
    paddingTop: sizeTokens.paddingV,
    paddingBottom: sizeTokens.paddingV,
    paddingLeft: iconOnly ? 0 : sizeTokens.paddingH,
    paddingRight: iconOnly ? 0 : sizeTokens.paddingH,
    backgroundColor: stateColors.bg,
    color: stateColors.text,
    border: `1.5px solid ${stateColors.border}`,
    borderRadius: isLink ? radius.sm : radius.md,
    fontSize: sizeTokens.fontSize,
    fontWeight: fontWeight.medium as React.CSSProperties["fontWeight"],
    fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, sans-serif",
    cursor: isDisabled ? "not-allowed" : "pointer",
    textDecoration: isLink ? "underline" : "none",
    textUnderlineOffset: 4,
    transition: "background-color 0.15s, color 0.15s, border-color 0.15s",
    boxSizing: "border-box",
  };

  return (
    <>
      <SpinnerKeyframes />
      <button
        type="button"
        style={baseStyle}
        disabled={isDisabled}
        onClick={onPress}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => {
          setIsHover(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        data-testid={testID}
      >
        {loading ? (
          <Spinner color={stateColors.text} size={spinnerSize} />
        ) : iconOnly ? (
          <span style={{ display: "inline-flex" }}>
            {leftIcon || rightIcon}
          </span>
        ) : (
          <>
            {leftIcon && (
              <span style={{ display: "inline-flex" }}>{leftIcon}</span>
            )}
            {children && <span>{children}</span>}
            {rightIcon && (
              <span style={{ display: "inline-flex" }}>{rightIcon}</span>
            )}
          </>
        )}
      </button>
    </>
  );
};
