import { memo, useEffect, useRef } from 'react';
import { ActivityIndicator, Platform, StyleSheet, TextInput, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { DropdownTheme } from './Dropdown.tokens';

interface DropdownSearchProps {
  value: string;
  placeholder: string;
  theme: DropdownTheme;
  fontFamily: string;
  loading?: boolean;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  onChangeText: (text: string) => void;
  testID?: string;
}

function DropdownSearch({
  value,
  placeholder,
  theme,
  fontFamily,
  loading = false,
  autoFocus = true,
  style,
  inputStyle,
  onChangeText,
  testID,
}: DropdownSearchProps) {
  const inputRef = useRef<TextInput>(null);
  const { colors, spacing, typography } = theme;

  useEffect(() => {
    if (!autoFocus) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [autoFocus]);

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: colors.separator,
          backgroundColor: colors.searchBackground,
          paddingHorizontal: spacing.searchPaddingH,
          paddingVertical: spacing.searchPaddingV,
        },
        style,
      ]}
    >
      <TextInput
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.searchPlaceholder}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
        accessibilityLabel="Seçenek ara"
        testID={testID ? `${testID}-search` : undefined}
        style={[
          styles.input,
          {
            color: colors.searchText,
            fontSize: typography.searchFontSize,
            fontFamily,
            borderColor: colors.searchBorder,
            backgroundColor: colors.background,
          },
          inputStyle,
        ]}
      />
      {loading && (
        <ActivityIndicator size="small" color={colors.loadingIndicator} style={styles.loadingIndicator} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderBottomWidth: StyleSheet.hairlineWidth },
  input: { height: 40, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 0 },
  loadingIndicator: { position: 'absolute', right: 20, top: '50%', marginTop: -8 },
});

export default memo(DropdownSearch);
