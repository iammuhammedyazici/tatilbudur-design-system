import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import type { DropdownTheme } from './Dropdown.tokens';

interface DropdownSearchProps {
  value: string;
  placeholder: string;
  theme: DropdownTheme;
  loading?: boolean;
  autoFocus?: boolean;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  onChangeText: (text: string) => void;
  testID?: string;
}

export function DropdownSearchWeb({
  value,
  placeholder,
  theme,
  loading = false,
  autoFocus = true,
  style,
  inputStyle,
  onChangeText,
  testID,
}: DropdownSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { colors, spacing, typography } = theme;

  useEffect(() => {
    if (!autoFocus) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(timer);
  }, [autoFocus]);

  return (
    <div
      style={{
        position: 'relative',
        borderBottom: `1px solid ${colors.separator}`,
        background: colors.searchBackground,
        paddingLeft: spacing.searchPaddingH,
        paddingRight: spacing.searchPaddingH,
        paddingTop: spacing.searchPaddingV,
        paddingBottom: spacing.searchPaddingV,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChangeText(e.target.value)}
        autoCapitalize="none"
        autoCorrect="off"
        aria-label="Seçenek ara"
        data-testid={testID && `${testID}-search`}
        style={{
          width: '100%',
          height: 40,
          border: `1px solid ${colors.searchBorder}`,
          borderRadius: 8,
          paddingLeft: 12,
          paddingRight: 12,
          fontSize: typography.searchFontSize,
          fontFamily: 'inherit',
          color: colors.searchText,
          background: colors.background,
          outline: 'none',
          boxSizing: 'border-box',
          ...inputStyle,
        }}
      />
      {loading && (
        <span
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 14,
            height: 14,
            border: `2px solid ${colors.loadingIndicator}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'tb-dropdown-spin 0.6s linear infinite',
          }}
        />
      )}
      <style>{`@keyframes tb-dropdown-spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  );
}

export default DropdownSearchWeb;
