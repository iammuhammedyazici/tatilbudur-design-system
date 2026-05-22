/**
 * TatilBudur Design System — Color Tokens (Figma)
 */

export const colors = {
  // ============ BRAND ============
  primary: {
    default: '#004CAA',
    hover: '#99C7FF',
    pressed: '#002E66',
    pressedBg: '#CCE3FF',  // outline/link pressed background
  },
  secondary: {
    default: '#86287E',
    hover: '#C744BC',
    pressed: '#5F1C5A',
    pressedBg: '#E9B0E3',
  },
  tertiary: {
    default: '#3F536C',
    hover: '#313C4A',
    pressed: '#3F536C',
    pressedBg: '#3F536C',
    bgDefault: '#FFFFFF',
    bgHover: '#CFD4DA',
  },

  // ============ NEUTRAL ============
  disable: '#9FA9B5',
  disableLight: '#CFD4DA',

  // ============ BASE ============
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorToken = typeof colors;
