import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { FlatListProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type {
  DropdownHandle,
  DropdownItem as DropdownItemType,
  DropdownProps,
  DropdownValue,
} from './Dropdown.types';
import { getDropdownTheme, resolveDropdownSizeTokens } from './Dropdown.tokens';
import { useDropdown } from './useDropdown';
import { buildTriggerLabel, defaultKeyExtractor, isItemSelected } from './dropdown.helpers';
import DropdownItemComponent from './DropdownItem.native';
import DropdownSearch from './DropdownSearch.native';

const regularFont = Platform.OS === 'web' ? 'Poppins, system-ui, sans-serif' : 'Poppins-Regular';
const mediumFont = Platform.OS === 'web' ? 'Poppins, system-ui, sans-serif' : 'Poppins-Medium';

export interface NativeDropdownStyleOverrides {
  container?: StyleProp<ViewStyle>;
  trigger?: StyleProp<ViewStyle>;
  triggerText?: StyleProp<TextStyle>;
  listContainer?: StyleProp<ViewStyle>;
  item?: StyleProp<ViewStyle>;
  itemText?: StyleProp<TextStyle>;
  selectedItem?: StyleProp<ViewStyle>;
  selectedItemText?: StyleProp<TextStyle>;
  disabledItem?: StyleProp<ViewStyle>;
  searchContainer?: StyleProp<ViewStyle>;
  searchInput?: StyleProp<TextStyle>;
  label?: StyleProp<TextStyle>;
  helperText?: StyleProp<TextStyle>;
  errorText?: StyleProp<TextStyle>;
  placeholder?: StyleProp<TextStyle>;
  chip?: StyleProp<ViewStyle>;
  chipText?: StyleProp<TextStyle>;
}

export type NativeDropdownProps<T extends DropdownValue> = DropdownProps<T> & {
  styleOverrides?: NativeDropdownStyleOverrides;
  flatListProps?: Partial<FlatListProps<DropdownItemType<T>>>;
};

interface TriggerLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  pageY: number;
}

const DEFAULT_LAYOUT: TriggerLayout = { x: 0, y: 0, width: 0, height: 0, pageY: 0 };

function DropdownInner<T extends DropdownValue>(
  props: NativeDropdownProps<T>,
  ref: React.Ref<DropdownHandle>
) {
  const {
    items,
    value,
    placeholder = 'Seçiniz',
    label,
    error,
    helperText,
    disabled = false,
    loading = false,
    readonly = false,
    searchable = false,
    searchPlaceholder = 'Ara...',
    onSearch,
    mode = 'default',
    direction = 'auto',
    theme: themeVariant = 'default',
    size = 'medium',
    maxHeight,
    visibleItemCount,
    clearable = false,
    showChips = false,
    leftIcon,
    rightIcon,
    renderItem,
    renderSelectedValue,
    keyExtractor,
    onEndReached,
    onOpen,
    onClose,
    styleOverrides,
    testID,
    borderRadius,
    required,
    multiple,
  } = props;

  const resolvedTheme = useMemo(() => getDropdownTheme(themeVariant), [themeVariant]);
  const { height, paddingH, fontSize, borderRadius: radius } = useMemo(
    () => resolveDropdownSizeTokens(resolvedTheme, size, borderRadius),
    [resolvedTheme, size, borderRadius]
  );

  const resolvedMaxHeight = useMemo(() => {
    if (visibleItemCount) {
      const itemHeight = resolvedTheme.spacing.itemPaddingV * 2 + Math.ceil(resolvedTheme.typography.itemFontSize * 1.4);
      return visibleItemCount * itemHeight + (visibleItemCount - 1) + 2;
    }
    return maxHeight ?? resolvedTheme.sizes.maxHeightDefault;
  }, [visibleItemCount, maxHeight, resolvedTheme]);

  const closeOnSelect = props.closeOnSelect ?? !multiple;

  const {
    isOpen,
    isSearchLoading,
    searchQuery,
    filteredItems,
    selectedItems,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    handleSelectItem,
    handleSearchChange,
    handleClear,
  } = useDropdown<T>({
    items,
    value: value as T | T[] | null,
    multiple: !!multiple,
    searchable,
    closeOnSelect,
    onOpen,
    onClose,
    onSearch,
    onChange: props.onChange as (
      value: T | T[] | null,
      item: DropdownItemType<T> | DropdownItemType<T>[] | null
    ) => void,
  });

  const triggerRef = useRef<View>(null);
  const [triggerLayout, setTriggerLayout] = useState<TriggerLayout>(DEFAULT_LAYOUT);
  const [resolvedDirection, setResolvedDirection] = useState<'top' | 'bottom'>('bottom');

  const measureAndOpen = useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, measuredHeight) => {
      const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 900;
      const spaceBelow = screenHeight - y - measuredHeight;
      const spaceAbove = y;
      let resolved: 'top' | 'bottom';
      if (direction === 'top') resolved = 'top';
      else if (direction === 'bottom') resolved = 'bottom';
      else resolved = spaceBelow >= resolvedMaxHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top';

      setTriggerLayout({ x, y, width, height: measuredHeight, pageY: y });
      setResolvedDirection(resolved);
      openDropdown();
    });
  }, [direction, resolvedMaxHeight, openDropdown]);

  const handleToggle = useCallback(() => {
    if (isOpen) closeDropdown();
    else measureAndOpen();
  }, [isOpen, closeDropdown, measureAndOpen]);

  useImperativeHandle(ref, () => ({
    open: measureAndOpen,
    close: closeDropdown,
    clear: handleClear,
  }));

  const triggerLabel = useMemo(() => buildTriggerLabel(selectedItems), [selectedItems]);
  const hasValue = selectedItems.length > 0;
  const isInteractive = !disabled && !readonly && !loading;

  const resolvedKeyExtractor = useCallback(
    (item: DropdownItemType<T>) => (keyExtractor ? keyExtractor(item) : defaultKeyExtractor(item)),
    [keyExtractor]
  );

  const renderListBody = () => (
    <View style={{ maxHeight: resolvedMaxHeight, backgroundColor: resolvedTheme.colors.listBackground }}>
      {searchable && (
        <DropdownSearch
          value={searchQuery}
          placeholder={searchPlaceholder}
          theme={resolvedTheme}
          fontFamily={regularFont}
          loading={isSearchLoading}
          onChangeText={handleSearchChange}
          style={styleOverrides?.searchContainer}
          inputStyle={styleOverrides?.searchInput}
          testID={testID}
        />
      )}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        onScroll={
          onEndReached
            ? ({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) onEndReached();
              }
            : undefined
        }
        scrollEventThrottle={16}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: resolvedTheme.colors.helperText, fontFamily: regularFont }]}>
              {searchQuery ? 'Sonuç bulunamadı' : 'Seçenek yok'}
            </Text>
          </View>
        ) : (
          filteredItems.map((item, index) => {
            const selected = isItemSelected(item, value as T | T[] | null, !!multiple);
            return (
              <View key={resolvedKeyExtractor(item)}>
                {index > 0 && <View style={[styles.separator, { backgroundColor: resolvedTheme.colors.separator }]} />}
                <DropdownItemComponent<T>
                  item={item}
                  isSelected={selected}
                  theme={resolvedTheme}
                  fontFamily={regularFont}
                  onPress={handleSelectItem}
                  renderItem={renderItem}
                  itemStyle={styleOverrides?.item}
                  itemTextStyle={styleOverrides?.itemText}
                  selectedItemStyle={styleOverrides?.selectedItem}
                  selectedItemTextStyle={styleOverrides?.selectedItemText}
                  disabledItemStyle={styleOverrides?.disabledItem}
                  testID={testID ? `${testID}-item-${item.id}` : undefined}
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );

  const renderDefaultList = () => {
    if (!isOpen) return null;
    const isAbove = resolvedDirection === 'top';
    return (
      <>
        <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={closeDropdown} />
        <View
          style={[
            styles.listContainer,
            {
              borderColor: resolvedTheme.colors.listBorder,
              borderRadius: resolvedTheme.sizes.listBorderRadius,
              backgroundColor: resolvedTheme.colors.listBackground,
            },
            isAbove ? { bottom: height + 4 } : { top: height + 4 },
            styles.listAboveBackdrop,
            styleOverrides?.listContainer,
          ]}
        >
          {renderListBody()}
        </View>
      </>
    );
  };

  const renderModalList = () => (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={closeDropdown} statusBarTranslucent testID={testID && `${testID}-modal`}>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: resolvedTheme.colors.overlay }]} onPress={closeDropdown}>
        <View
          style={[
            styles.modalListContainer,
            {
              top: resolvedDirection === 'top' ? triggerLayout.pageY - resolvedMaxHeight - 4 : triggerLayout.pageY + triggerLayout.height + 4,
              left: triggerLayout.x,
              width: triggerLayout.width,
              maxHeight: resolvedMaxHeight,
              borderRadius: resolvedTheme.sizes.listBorderRadius,
              borderColor: resolvedTheme.colors.listBorder,
              backgroundColor: resolvedTheme.colors.listBackground,
              shadowColor: resolvedTheme.colors.shadow,
              shadowOffset: { width: 0, height: resolvedTheme.sizes.shadowOffsetY },
              shadowOpacity: resolvedTheme.sizes.shadowOpacity,
              shadowRadius: resolvedTheme.sizes.shadowRadius,
              elevation: resolvedTheme.sizes.elevation,
            },
            styleOverrides?.listContainer,
          ]}
        >
          {renderListBody()}
        </View>
      </Pressable>
    </Modal>
  );

  const renderInlineList = () => {
    if (!isOpen) return null;
    return (
      <View
        style={[
          styles.inlineList,
          { borderWidth: resolvedTheme.sizes.borderWidth, borderColor: resolvedTheme.colors.listBorder, borderRadius: resolvedTheme.sizes.listBorderRadius },
          styleOverrides?.listContainer,
        ]}
      >
        {renderListBody()}
      </View>
    );
  };

  const renderTrigger = () => {
    if (renderSelectedValue && hasValue) {
      return renderSelectedValue(multiple ? selectedItems : selectedItems[0]);
    }
    return (
      <Text
        numberOfLines={1}
        style={[
          { flex: 1, fontSize, fontFamily: mediumFont, color: hasValue ? resolvedTheme.colors.text : resolvedTheme.colors.placeholder },
          styleOverrides?.triggerText,
          !hasValue ? styleOverrides?.placeholder : undefined,
          disabled ? { color: resolvedTheme.colors.disabledText } : undefined,
        ]}
      >
        {triggerLabel ?? placeholder}
      </Text>
    );
  };

  return (
    <View style={[styles.wrapper, styleOverrides?.container]} testID={testID}>
      {label != null && (
        <Text style={[styles.label, { color: resolvedTheme.colors.label, fontFamily: mediumFont }, styleOverrides?.label]}>
          {label}
          {required && <Text style={{ color: resolvedTheme.colors.errorText }}> *</Text>}
        </Text>
      )}

      <View style={styles.triggerContainer}>
        <TouchableOpacity
          ref={triggerRef}
          onPress={isInteractive ? handleToggle : undefined}
          activeOpacity={isInteractive ? 0.7 : 1}
          accessibilityRole="combobox"
          accessibilityLabel={label ?? placeholder}
          accessibilityState={{ expanded: isOpen, disabled: disabled || loading }}
          testID={testID ? `${testID}-trigger` : undefined}
          style={[
            styles.trigger,
            {
              height,
              paddingHorizontal: paddingH,
              borderWidth: resolvedTheme.sizes.borderWidth,
              borderColor: resolvedTheme.colors.border,
              borderRadius: radius,
              backgroundColor: resolvedTheme.colors.background,
            },
            disabled && { backgroundColor: resolvedTheme.colors.disabledBackground, borderColor: resolvedTheme.colors.disabledBorder },
            !!error && { borderColor: resolvedTheme.colors.errorBorder },
            readonly && { opacity: 0.75 },
            styleOverrides?.trigger,
          ]}
        >
          {leftIcon != null && <View style={{ marginRight: resolvedTheme.spacing.iconGap }}>{leftIcon}</View>}

          {loading ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="small" color={resolvedTheme.colors.loadingIndicator} />
            </View>
          ) : (
            renderTrigger()
          )}

          {clearable && hasValue && !disabled && !loading && !readonly && (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Seçimi temizle"
              testID={testID ? `${testID}-clear` : undefined}
              style={styles.clearButton}
            >
              <Text style={[styles.clearIcon, { color: resolvedTheme.colors.clearIcon }]}>×</Text>
            </TouchableOpacity>
          )}

          {rightIcon ? (
            <View style={{ marginLeft: resolvedTheme.spacing.iconGap }}>{rightIcon}</View>
          ) : (
            <View style={{ width: resolvedTheme.sizes.arrowIconSize, height: resolvedTheme.sizes.arrowIconSize, marginLeft: resolvedTheme.spacing.iconGap }}>
              <Svg width={resolvedTheme.sizes.arrowIconSize} height={resolvedTheme.sizes.arrowIconSize} viewBox="0 0 16 16" fill="none" style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
                <Path d="m4 6 4 4 4-4" stroke={resolvedTheme.colors.arrow} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          )}
        </TouchableOpacity>

        {mode === 'default' && renderDefaultList()}
      </View>

      {mode === 'modal' && renderModalList()}
      {mode === 'inline' && renderInlineList()}

      {multiple && showChips && selectedItems.length > 0 && (
        <View style={[styles.chipsRow, styleOverrides?.chip]}>
          {selectedItems.map((item) => (
            <View key={resolvedKeyExtractor(item)} style={[styles.chip, { backgroundColor: resolvedTheme.colors.chipBackground, borderColor: resolvedTheme.colors.chipBorder }]}>
              <Text style={[styles.chipText, { color: resolvedTheme.colors.chipText, fontFamily: regularFont }, styleOverrides?.chipText]} numberOfLines={1}>
                {item.label}
              </Text>
              <TouchableOpacity onPress={() => handleSelectItem(item)} accessibilityLabel={`${item.label} kaldır`}>
                <Text style={[styles.chipRemoveText, { color: resolvedTheme.colors.chipText }]}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {!!error && <Text style={[styles.helperText, { color: resolvedTheme.colors.errorText, fontFamily: regularFont }, styleOverrides?.errorText]}>{error}</Text>}
      {!error && !!helperText && (
        <Text style={[styles.helperText, { color: resolvedTheme.colors.helperText, fontFamily: regularFont }, styleOverrides?.helperText]}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: 'stretch' },
  label: { fontSize: 11, marginBottom: 4 },
  triggerContainer: { position: 'relative' },
  trigger: { flexDirection: 'row', alignItems: 'center' },
  loadingWrapper: { flex: 1, alignItems: 'flex-start', justifyContent: 'center' },
  clearButton: { padding: 4, marginLeft: 4, justifyContent: 'center', alignItems: 'center' },
  clearIcon: { fontSize: 14 },
  helperText: { fontSize: 12, marginTop: 4 },
  listContainer: { position: 'absolute', left: 0, right: 0, borderWidth: 1, overflow: 'hidden' },
  listAboveBackdrop: { zIndex: 999 },
  backdrop: { zIndex: 998 },
  modalListContainer: { position: 'absolute', overflow: 'hidden', borderWidth: 1.5 },
  inlineList: { overflow: 'hidden', marginTop: 4 },
  separator: { height: StyleSheet.hairlineWidth },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24, paddingHorizontal: 16 },
  emptyText: { fontSize: 15, textAlign: 'center' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingTop: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, borderWidth: 1 },
  chipText: { fontSize: 13, marginRight: 4 },
  chipRemoveText: { fontSize: 11, fontWeight: '700' },
});

const Dropdown = forwardRef(DropdownInner) as <T extends DropdownValue>(
  props: NativeDropdownProps<T> & { ref?: React.Ref<DropdownHandle> }
) => React.ReactElement;

export { Dropdown };
export default memo(Dropdown) as typeof Dropdown;
