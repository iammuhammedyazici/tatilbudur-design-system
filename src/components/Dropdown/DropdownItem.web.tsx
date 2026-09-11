import type { CSSProperties, ReactElement } from 'react';
import type { DropdownItem as DropdownItemType, DropdownValue } from './Dropdown.types';
import type { DropdownTheme } from './Dropdown.tokens';

interface DropdownItemProps<T extends DropdownValue> {
  item: DropdownItemType<T>;
  isSelected: boolean;
  theme: DropdownTheme;
  onPress: (item: DropdownItemType<T>) => void;
  renderItem?: (item: DropdownItemType<T>, isSelected: boolean) => ReactElement;
  itemStyle?: CSSProperties;
  itemTextStyle?: CSSProperties;
  selectedItemStyle?: CSSProperties;
  selectedItemTextStyle?: CSSProperties;
  disabledItemStyle?: CSSProperties;
  testID?: string;
}

export function DropdownItemWeb<T extends DropdownValue>({
  item,
  isSelected,
  theme,
  onPress,
  renderItem,
  itemStyle,
  itemTextStyle,
  selectedItemStyle,
  selectedItemTextStyle,
  disabledItemStyle,
  testID,
}: DropdownItemProps<T>) {
  const { colors, spacing, typography } = theme;

  const content = renderItem ? (
    renderItem(item, isSelected)
  ) : (
    <>
      {item.icon != null && (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: spacing.iconGap }}>
          {item.icon}
        </span>
      )}
      <span
        style={{
          flex: 1,
          fontSize: typography.itemFontSize,
          color: isSelected ? colors.selectedItemText : colors.itemText,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          ...itemTextStyle,
          ...(isSelected ? selectedItemTextStyle : undefined),
        }}
      >
        {item.label}
      </span>
      {isSelected && <span style={{ fontSize: 14, marginLeft: 8, color: colors.selectedItemText }}>✓</span>}
    </>
  );

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      aria-disabled={item.disabled}
      disabled={item.disabled}
      data-testid={testID}
      onClick={() => !item.disabled && onPress(item)}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        textAlign: 'left',
        border: 'none',
        background: isSelected ? colors.selectedItemBackground : 'transparent',
        paddingLeft: spacing.itemPaddingH,
        paddingRight: spacing.itemPaddingH,
        paddingTop: spacing.itemPaddingV,
        paddingBottom: spacing.itemPaddingV,
        cursor: item.disabled ? 'default' : 'pointer',
        opacity: item.disabled ? 0.4 : 1,
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        ...itemStyle,
        ...(isSelected ? selectedItemStyle : undefined),
        ...(item.disabled ? disabledItemStyle : undefined),
      }}
      onMouseEnter={(e) => {
        if (!item.disabled && !isSelected) e.currentTarget.style.background = colors.searchBackground;
      }}
      onMouseLeave={(e) => {
        if (!item.disabled && !isSelected) e.currentTarget.style.background = 'transparent';
      }}
    >
      {content}
    </button>
  );
}

export default DropdownItemWeb;
