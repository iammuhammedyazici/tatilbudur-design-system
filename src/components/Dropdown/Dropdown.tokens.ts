import type { DropdownSize, DropdownThemeVariant } from './Dropdown.types';

// Kaynak: tatilbudurapp-v82 / src/components/Dropdown/theme/dropdownTheme.ts
// Renkler TatilBudur marka paletine (src/theme/colors.ts) uyarlandı;
// spacing/typography/sizes yapısı orijinaliyle aynı.

export interface DropdownThemeColors {
  background: string;
  border: string;
  text: string;
  placeholder: string;
  arrow: string;
  listBackground: string;
  listBorder: string;
  itemText: string;
  selectedItemBackground: string;
  selectedItemText: string;
  disabledBackground: string;
  disabledText: string;
  disabledBorder: string;
  searchBackground: string;
  searchText: string;
  searchPlaceholder: string;
  searchBorder: string;
  chipBackground: string;
  chipText: string;
  chipBorder: string;
  label: string;
  helperText: string;
  errorText: string;
  errorBorder: string;
  shadow: string;
  separator: string;
  overlay: string;
  sectionHeader: string;
  sectionHeaderText: string;
  clearIcon: string;
  loadingIndicator: string;
}

export interface DropdownThemeSpacing {
  triggerPaddingHSm: number;
  triggerPaddingHMd: number;
  triggerPaddingHLg: number;
  itemPaddingH: number;
  itemPaddingV: number;
  searchPaddingH: number;
  searchPaddingV: number;
  chipPaddingH: number;
  chipPaddingV: number;
  chipGap: number;
  labelMarginBottom: number;
  helperTextMarginTop: number;
  iconGap: number;
}

export interface DropdownThemeTypography {
  fontSizeSm: number;
  fontSizeMd: number;
  fontSizeLg: number;
  itemFontSize: number;
  labelFontSize: number;
  helperTextFontSize: number;
  searchFontSize: number;
  chipFontSize: number;
  sectionHeaderFontSize: number;
}

export interface DropdownThemeSizes {
  triggerHeightSm: number;
  triggerHeightMd: number;
  triggerHeightLg: number;
  borderWidth: number;
  arrowIconSize: number;
  borderRadiusSm: number;
  borderRadiusMd: number;
  borderRadiusLg: number;
  chipBorderRadius: number;
  listBorderRadius: number;
  maxHeightDefault: number;
  elevation: number;
  shadowRadius: number;
  shadowOpacity: number;
  shadowOffsetY: number;
}

export interface DropdownTheme {
  colors: DropdownThemeColors;
  spacing: DropdownThemeSpacing;
  typography: DropdownThemeTypography;
  sizes: DropdownThemeSizes;
}

const baseSpacing: DropdownThemeSpacing = {
  triggerPaddingHSm: 10,
  triggerPaddingHMd: 16,
  triggerPaddingHLg: 18,
  itemPaddingH: 16,
  itemPaddingV: 13,
  searchPaddingH: 12,
  searchPaddingV: 10,
  chipPaddingH: 10,
  chipPaddingV: 4,
  chipGap: 6,
  labelMarginBottom: 4,
  helperTextMarginTop: 4,
  iconGap: 8,
};

const baseTypography: DropdownThemeTypography = {
  fontSizeSm: 13,
  fontSizeMd: 14,
  fontSizeLg: 16,
  itemFontSize: 15,
  labelFontSize: 11,
  helperTextFontSize: 12,
  searchFontSize: 14,
  chipFontSize: 13,
  sectionHeaderFontSize: 11,
};

const baseSizes: DropdownThemeSizes = {
  triggerHeightSm: 36,
  triggerHeightMd: 48,
  triggerHeightLg: 56,
  borderWidth: 1,
  arrowIconSize: 16,
  borderRadiusSm: 6,
  borderRadiusMd: 8,
  borderRadiusLg: 10,
  chipBorderRadius: 16,
  listBorderRadius: 10,
  maxHeightDefault: 280,
  elevation: 8,
  shadowRadius: 10,
  shadowOpacity: 0.12,
  shadowOffsetY: 4,
};

// ─── Renk paletleri (TatilBudur marka tokenları) ────────────────────────────

const defaultColors: DropdownThemeColors = {
  background: '#FFFFFF',
  border: '#CFD4DA',
  text: '#3F546C',
  placeholder: '#6F7E90',
  arrow: '#3F546C',
  listBackground: '#FFFFFF',
  listBorder: '#CFD4DA',
  itemText: '#3F546C',
  selectedItemBackground: '#F3F7FE',
  selectedItemText: '#004CAA',
  disabledBackground: '#F0F4FA',
  disabledText: '#9FA9B5',
  disabledBorder: '#E6EAF0',
  searchBackground: '#F0F4FA',
  searchText: '#3F546C',
  searchPlaceholder: '#6F7E90',
  searchBorder: '#CFD4DA',
  chipBackground: '#F3F7FE',
  chipText: '#004CAA',
  chipBorder: '#CCE3FF',
  label: '#3F546C',
  helperText: '#6F7E90',
  errorText: '#D6243B',
  errorBorder: '#D6243B',
  shadow: '#000000',
  separator: '#F0F4FA',
  overlay: 'rgba(15, 23, 42, 0.35)',
  sectionHeader: '#F0F4FA',
  sectionHeaderText: '#6F7E90',
  clearIcon: '#6F7E90',
  loadingIndicator: '#004CAA',
};

const darkColors: DropdownThemeColors = {
  ...defaultColors,
  background: '#1A2733',
  border: '#3F546C',
  text: '#F9FAFB',
  placeholder: '#9FA9B5',
  arrow: '#CCE3FF',
  listBackground: '#1A2733',
  listBorder: '#3F546C',
  itemText: '#F9FAFB',
  selectedItemBackground: '#002E66',
  selectedItemText: '#99C7FF',
  disabledBackground: '#111827',
  disabledText: '#3F546C',
  disabledBorder: '#1A2733',
  searchBackground: '#111827',
  searchText: '#F9FAFB',
  searchPlaceholder: '#9FA9B5',
  searchBorder: '#3F546C',
  chipBackground: '#002E66',
  chipText: '#99C7FF',
  chipBorder: '#004CAA',
  label: '#9FA9B5',
  helperText: '#9FA9B5',
  separator: '#3F546C',
  overlay: 'rgba(0, 0, 0, 0.6)',
  sectionHeader: '#111827',
  sectionHeaderText: '#9FA9B5',
  clearIcon: '#9FA9B5',
  loadingIndicator: '#99C7FF',
};

const outlineColors: DropdownThemeColors = {
  ...defaultColors,
  background: 'transparent',
  border: '#004CAA',
  arrow: '#004CAA',
};

const filledColors: DropdownThemeColors = {
  ...defaultColors,
  background: '#F0F4FA',
  border: '#F0F4FA',
};

const dangerColors: DropdownThemeColors = {
  ...defaultColors,
  border: '#D6243B',
  arrow: '#D6243B',
  selectedItemBackground: '#FFE1E4',
  selectedItemText: '#D6243B',
  chipBackground: '#FFE1E4',
  chipText: '#D6243B',
  chipBorder: '#F5B3BA',
};

const successColors: DropdownThemeColors = {
  ...defaultColors,
  border: '#10B981',
  arrow: '#059669',
  selectedItemBackground: '#ECFDF5',
  selectedItemText: '#059669',
  chipBackground: '#ECFDF5',
  chipText: '#059669',
  chipBorder: '#A7F3D0',
};

const DROPDOWN_THEMES: Record<DropdownThemeVariant, DropdownTheme> = {
  default: { colors: defaultColors, spacing: baseSpacing, typography: baseTypography, sizes: baseSizes },
  light: { colors: { ...defaultColors, background: '#FFFFFF' }, spacing: baseSpacing, typography: baseTypography, sizes: baseSizes },
  dark: { colors: darkColors, spacing: baseSpacing, typography: baseTypography, sizes: baseSizes },
  outline: { colors: outlineColors, spacing: baseSpacing, typography: baseTypography, sizes: baseSizes },
  filled: { colors: filledColors, spacing: baseSpacing, typography: baseTypography, sizes: baseSizes },
  danger: { colors: dangerColors, spacing: baseSpacing, typography: baseTypography, sizes: baseSizes },
  success: { colors: successColors, spacing: baseSpacing, typography: baseTypography, sizes: baseSizes },
};

export const getDropdownTheme = (
  variant: DropdownThemeVariant = 'default'
): DropdownTheme => DROPDOWN_THEMES[variant] ?? DROPDOWN_THEMES.default;

const triggerHeightMap: Record<DropdownSize, keyof DropdownThemeSizes> = {
  small: 'triggerHeightSm',
  medium: 'triggerHeightMd',
  large: 'triggerHeightLg',
};
const triggerPaddingHMap: Record<DropdownSize, keyof DropdownThemeSpacing> = {
  small: 'triggerPaddingHSm',
  medium: 'triggerPaddingHMd',
  large: 'triggerPaddingHLg',
};
const fontSizeMap: Record<DropdownSize, keyof DropdownThemeTypography> = {
  small: 'fontSizeSm',
  medium: 'fontSizeMd',
  large: 'fontSizeLg',
};
const borderRadiusMap: Record<DropdownSize, keyof DropdownThemeSizes> = {
  small: 'borderRadiusSm',
  medium: 'borderRadiusMd',
  large: 'borderRadiusLg',
};

export function resolveDropdownSizeTokens(theme: DropdownTheme, size: DropdownSize, customBorderRadius?: number) {
  return {
    height: theme.sizes[triggerHeightMap[size]] as number,
    paddingH: theme.spacing[triggerPaddingHMap[size]] as number,
    fontSize: theme.typography[fontSizeMap[size]] as number,
    borderRadius: customBorderRadius ?? (theme.sizes[borderRadiusMap[size]] as number),
  };
}
