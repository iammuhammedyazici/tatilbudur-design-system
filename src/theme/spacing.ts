/**
 * Spacing tokens (Figma)
 */
export const spacing = {
  none: 0,
  xs: 4,
  small: 8,
  default: 12,
  medium: 16,
  large: 24,
  xl: 32,
} as const;

export const radius = {
  none: 0,
  sm: 4,
  md: 8,        // button radius
  lg: 12,
  xl: 16,
  full: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,       // small button
  base: 16,     // medium/large button
  lg: 18,
  xl: 20,
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
