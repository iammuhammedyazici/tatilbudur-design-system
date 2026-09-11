import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { DropdownItem as DropdownItemType, DropdownValue } from './Dropdown.types';
import type { DropdownTheme } from './Dropdown.tokens';

interface DropdownItemProps<T extends DropdownValue> {
  item: DropdownItemType<T>;
  isSelected: boolean;
  theme: DropdownTheme;
  fontFamily: string;
  onPress: (item: DropdownItemType<T>) => void;
  renderItem?: (item: DropdownItemType<T>, isSelected: boolean) => React.ReactElement;
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  selectedItemStyle?: StyleProp<ViewStyle>;
  selectedItemTextStyle?: StyleProp<TextStyle>;
  disabledItemStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

function DropdownItemInner<T extends DropdownValue>({
  item,
  isSelected,
  theme,
  fontFamily,
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

  const handlePress = useCallback(() => onPress(item), [item, onPress]);

  if (renderItem) {
    return (
      <Pressable
        onPress={handlePress}
        disabled={item.disabled}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, disabled: !!item.disabled }}
        accessibilityLabel={item.label}
        testID={testID}
      >
        {renderItem(item, isSelected)}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={item.disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: !!item.disabled }}
      accessibilityLabel={item.label}
      testID={testID}
      style={[
        styles.container,
        { paddingHorizontal: spacing.itemPaddingH, paddingVertical: spacing.itemPaddingV },
        isSelected && { backgroundColor: colors.selectedItemBackground },
        item.disabled && [styles.disabled, disabledItemStyle],
        itemStyle,
        isSelected && selectedItemStyle,
      ]}
    >
      {item.icon != null && (
        <View style={[styles.iconWrapper, { marginRight: spacing.iconGap }]}>{item.icon}</View>
      )}
      <Text
        numberOfLines={1}
        style={[
          styles.label,
          {
            fontSize: typography.itemFontSize,
            fontFamily,
            color: isSelected ? colors.selectedItemText : colors.itemText,
          },
          itemTextStyle,
          isSelected && selectedItemTextStyle,
        ]}
      >
        {item.label}
      </Text>
      {isSelected && <Text style={[styles.checkmark, { color: colors.selectedItemText }]}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { justifyContent: 'center', alignItems: 'center' },
  label: { flex: 1 },
  disabled: { opacity: 0.4 },
  checkmark: { fontSize: 14, marginLeft: 8 },
});

const DropdownItem = memo(DropdownItemInner) as typeof DropdownItemInner;
export default DropdownItem;
