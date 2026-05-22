/**
 * TatilBudur Design System — Color Tokens
 * Brand colors extracted from tatilbudur.com
 */

export const colors = {
  // Primary (mavi)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#1D4ED8',  // Ana mavi (button, link)
    600: '#1E40AF',  // Hover
    700: '#1E3A8A',  // Active/pressed
  },

  // Accent (turuncu) — kampanya, badge
  accent: {
    500: '#F76F00',
    600: '#E55A00',
  },

  // Success (yeşil) — onay, garanti
  success: {
    500: '#10B981',
    600: '#059669',
  },

  // Danger (kırmızı) — uyarı, hata
  danger: {
    500: '#EF4444',
    600: '#DC2626',
  },

  // Neutrals (gri tonları)
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorToken = typeof colors;
