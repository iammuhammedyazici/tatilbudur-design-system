import { create } from 'storybook/theming/create';

export default create({
  base: 'light',

  // Brand — TatilBudur 2026 logosu
  brandTitle: 'TatilBudur Design System',
  brandUrl: 'https://www.tatilbudur.com',
  brandImage: 'https://www.tatilbudur.com/themes/tbcom/assets/img/tatilbudur-logo-2026.svg',
  brandTarget: '_self',

  // Colors — TatilBudur turuncu
  colorPrimary: '#F76F00',
  colorSecondary: '#F76F00',

  // UI
  appBg: '#F8F9FB',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#E5E7EB',
  appBorderRadius: 8,

  // Typography
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", monospace',

  // Text colors
  textColor: '#111827',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#6B7280',

  // Toolbar default and active colors
  barTextColor: '#6B7280',
  barSelectedColor: '#F76F00',
  barHoverColor: '#F76F00',
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: '#E5E7EB',
  inputTextColor: '#111827',
  inputBorderRadius: 6,

  // Button colors
  buttonBg: '#FFFFFF',
  buttonBorder: '#E5E7EB',
  booleanBg: '#F3F4F6',
  booleanSelectedBg: '#F76F00',
});