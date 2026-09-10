// Kaynak: tatilbudurapp-v82 / TBTextInput ve authFieldStyles.
export const inputTokens = {
  height: 48,
  radius: 8,
  borderWidth: 1,
  paddingHorizontal: 16,
  gap: 8,
  iconGap: 12,
  fontSize: 14,
  helperFontSize: 12,
  text: '#3F546C',
  placeholder: '#6F7E90',
  border: '#CFD4DA',
  background: '#FFFFFF',
  error: '#D6243B',
  errorBackground: '#FFE1E4',
  fontRegular: 'Poppins-Regular',
  fontMedium: 'Poppins-Medium',
  fontWeb: 'Poppins, system-ui, sans-serif',
} as const;

// Önceki boyut seçeneklerini kullanan tüketiciler için korunur.
export const inputHeights = { sm: 36, md: inputTokens.height, lg: 52 } as const;
