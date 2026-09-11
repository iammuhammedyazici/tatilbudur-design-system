import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CSSProperties, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import type {
  DropdownHandle,
  DropdownItem as DropdownItemType,
  DropdownProps,
  DropdownValue,
} from './Dropdown.types';
import { getDropdownTheme, resolveDropdownSizeTokens } from './Dropdown.tokens';
import { useDropdown } from './useDropdown';
import { buildTriggerLabel, defaultKeyExtractor, isItemSelected } from './dropdown.helpers';
import { DropdownItemWeb } from './DropdownItem.web';
import { DropdownSearchWeb } from './DropdownSearch.web';

const fontFamily = 'Poppins, system-ui, sans-serif';

export interface WebDropdownStyleOverrides {
  container?: CSSProperties;
  trigger?: CSSProperties;
  triggerText?: CSSProperties;
  listContainer?: CSSProperties;
  item?: CSSProperties;
  itemText?: CSSProperties;
  selectedItem?: CSSProperties;
  selectedItemText?: CSSProperties;
  disabledItem?: CSSProperties;
  searchContainer?: CSSProperties;
  searchInput?: CSSProperties;
  label?: CSSProperties;
  helperText?: CSSProperties;
  errorText?: CSSProperties;
  placeholder?: CSSProperties;
  chip?: CSSProperties;
  chipText?: CSSProperties;
}

export type WebDropdownProps<T extends DropdownValue> = DropdownProps<T> & {
  styleOverrides?: WebDropdownStyleOverrides;
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
  props: WebDropdownProps<T>,
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

  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerLayout, setTriggerLayout] = useState<TriggerLayout>(DEFAULT_LAYOUT);
  const [resolvedDirection, setResolvedDirection] = useState<'top' | 'bottom'>('bottom');

  const measureAndOpen = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    let resolved: 'top' | 'bottom';
    if (direction === 'top') resolved = 'top';
    else if (direction === 'bottom') resolved = 'bottom';
    else resolved = spaceBelow >= resolvedMaxHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top';

    setTriggerLayout({ x: rect.left, y: rect.top, width: rect.width, height: rect.height, pageY: rect.top + window.scrollY });
    setResolvedDirection(resolved);
    openDropdown();
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

  // Escape ile kapatma
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDropdown();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeDropdown]);

  const triggerLabel = useMemo(() => buildTriggerLabel(selectedItems), [selectedItems]);
  const hasValue = selectedItems.length > 0;
  const isInteractive = !disabled && !readonly && !loading;

  const resolvedKeyExtractor = useCallback(
    (item: DropdownItemType<T>) => (keyExtractor ? keyExtractor(item) : defaultKeyExtractor(item)),
    [keyExtractor]
  );

  const renderListBody = () => (
    <div style={{ maxHeight: resolvedMaxHeight, background: resolvedTheme.colors.listBackground, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {searchable && (
        <DropdownSearchWeb
          value={searchQuery}
          placeholder={searchPlaceholder}
          theme={resolvedTheme}
          loading={isSearchLoading}
          onChangeText={handleSearchChange}
          style={styleOverrides?.searchContainer}
          inputStyle={styleOverrides?.searchInput}
          testID={testID}
        />
      )}
      <div
        role="listbox"
        style={{ overflowY: 'auto' }}
        onScroll={
          onEndReached
            ? (e) => {
                const el = e.currentTarget;
                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) onEndReached();
              }
            : undefined
        }
      >
        {filteredItems.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 15, color: resolvedTheme.colors.helperText }}>
            {searchQuery ? 'Sonuç bulunamadı' : 'Seçenek yok'}
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const selected = isItemSelected(item, value as T | T[] | null, !!multiple);
            return (
              <div key={resolvedKeyExtractor(item)}>
                {index > 0 && <div style={{ height: 1, background: resolvedTheme.colors.separator }} />}
                <DropdownItemWeb<T>
                  item={item}
                  isSelected={selected}
                  theme={resolvedTheme}
                  onPress={handleSelectItem}
                  renderItem={renderItem}
                  itemStyle={styleOverrides?.item}
                  itemTextStyle={styleOverrides?.itemText}
                  selectedItemStyle={styleOverrides?.selectedItem}
                  selectedItemTextStyle={styleOverrides?.selectedItemText}
                  disabledItemStyle={styleOverrides?.disabledItem}
                  testID={testID ? `${testID}-item-${item.id}` : undefined}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const listBoxShadow = `0 ${resolvedTheme.sizes.shadowOffsetY}px ${resolvedTheme.sizes.shadowRadius}px rgba(0,0,0,${resolvedTheme.sizes.shadowOpacity})`;

  const renderDefaultList = () => {
    if (!isOpen) return null;
    const isAbove = resolvedDirection === 'top';
    return (
      <>
        <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={closeDropdown} />
        <div
          role="presentation"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 999,
            border: `1px solid ${resolvedTheme.colors.listBorder}`,
            borderRadius: resolvedTheme.sizes.listBorderRadius,
            background: resolvedTheme.colors.listBackground,
            boxShadow: listBoxShadow,
            overflow: 'hidden',
            boxSizing: 'border-box',
            ...(isAbove ? { bottom: height + 4 } : { top: height + 4 }),
            ...styleOverrides?.listContainer,
          }}
        >
          {renderListBody()}
        </div>
      </>
    );
  };

  const renderModalList = () => {
    if (!isOpen || typeof document === 'undefined') return null;
    return createPortal(
      <div
        role="presentation"
        style={{ position: 'fixed', inset: 0, zIndex: 998, background: resolvedTheme.colors.overlay }}
        onClick={closeDropdown}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: resolvedDirection === 'top' ? triggerLayout.y - resolvedMaxHeight - 4 : triggerLayout.y + triggerLayout.height + 4,
            left: triggerLayout.x,
            width: triggerLayout.width,
            maxHeight: resolvedMaxHeight,
            border: `1.5px solid ${resolvedTheme.colors.listBorder}`,
            borderRadius: resolvedTheme.sizes.listBorderRadius,
            background: resolvedTheme.colors.listBackground,
            boxShadow: listBoxShadow,
            overflow: 'hidden',
            boxSizing: 'border-box',
            ...styleOverrides?.listContainer,
          }}
        >
          {renderListBody()}
        </div>
      </div>,
      document.body
    );
  };

  const renderInlineList = () => {
    if (!isOpen) return null;
    return (
      <div
        style={{
          marginTop: 4,
          border: `${resolvedTheme.sizes.borderWidth}px solid ${resolvedTheme.colors.listBorder}`,
          borderRadius: resolvedTheme.sizes.listBorderRadius,
          overflow: 'hidden',
          ...styleOverrides?.listContainer,
        }}
      >
        {renderListBody()}
      </div>
    );
  };

  const renderTrigger = () => {
    if (renderSelectedValue && hasValue) {
      return renderSelectedValue(multiple ? selectedItems : selectedItems[0]) as ReactElement;
    }
    return (
      <span
        style={{
          flex: 1,
          fontSize,
          fontFamily,
          color: hasValue ? resolvedTheme.colors.text : resolvedTheme.colors.placeholder,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'left',
          ...styleOverrides?.triggerText,
          ...(!hasValue ? styleOverrides?.placeholder : undefined),
          ...(disabled ? { color: resolvedTheme.colors.disabledText } : undefined),
        }}
      >
        {triggerLabel ?? placeholder}
      </span>
    );
  };

  return (
    <div style={{ alignSelf: 'stretch', ...styleOverrides?.container }} data-testid={testID}>
      {label != null && (
        <label style={{ display: 'block', fontSize: 11, fontFamily, color: resolvedTheme.colors.label, marginBottom: 4, ...styleOverrides?.label }}>
          {label}
          {required && <span style={{ color: resolvedTheme.colors.errorText }}> *</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        <button
          ref={triggerRef}
          type="button"
          onClick={isInteractive ? handleToggle : undefined}
          disabled={!isInteractive}
          aria-expanded={isOpen}
          aria-label={label ?? placeholder}
          data-testid={testID ? `${testID}-trigger` : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height,
            paddingLeft: paddingH,
            paddingRight: paddingH,
            border: `${resolvedTheme.sizes.borderWidth}px solid ${error ? resolvedTheme.colors.errorBorder : resolvedTheme.colors.border}`,
            borderRadius: radius,
            background: disabled ? resolvedTheme.colors.disabledBackground : resolvedTheme.colors.background,
            cursor: isInteractive ? 'pointer' : 'default',
            opacity: readonly ? 0.75 : 1,
            boxSizing: 'border-box',
            fontFamily,
            ...styleOverrides?.trigger,
          }}
        >
          {leftIcon != null && <span style={{ display: 'inline-flex', marginRight: resolvedTheme.spacing.iconGap }}>{leftIcon}</span>}

          {loading ? (
            <span
              style={{
                width: 16,
                height: 16,
                border: `2px solid ${resolvedTheme.colors.loadingIndicator}`,
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'tb-dropdown-spin 0.6s linear infinite',
              }}
            />
          ) : (
            renderTrigger()
          )}

          {clearable && hasValue && !disabled && !loading && !readonly && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Seçimi temizle"
              data-testid={testID ? `${testID}-clear` : undefined}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              style={{ display: 'inline-flex', padding: 4, marginLeft: 4, cursor: 'pointer', fontSize: 14, color: resolvedTheme.colors.clearIcon }}
            >
              ×
            </span>
          )}

          {rightIcon ? (
            <span style={{ display: 'inline-flex', marginLeft: resolvedTheme.spacing.iconGap }}>{rightIcon}</span>
          ) : (
            <span
              style={{
                display: 'inline-flex',
                width: resolvedTheme.sizes.arrowIconSize,
                height: resolvedTheme.sizes.arrowIconSize,
                marginLeft: resolvedTheme.spacing.iconGap,
                transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s',
              }}
            >
              <svg width={resolvedTheme.sizes.arrowIconSize} height={resolvedTheme.sizes.arrowIconSize} viewBox="0 0 16 16" fill="none">
                <path d="m4 6 4 4 4-4" stroke={resolvedTheme.colors.arrow} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </button>

        {mode === 'default' && renderDefaultList()}
      </div>

      {mode === 'modal' && renderModalList()}
      {mode === 'inline' && renderInlineList()}

      {multiple && showChips && selectedItems.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 6, ...styleOverrides?.chip }}>
          {selectedItems.map((item) => (
            <div
              key={resolvedKeyExtractor(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 4,
                paddingBottom: 4,
                borderRadius: 16,
                border: `1px solid ${resolvedTheme.colors.chipBorder}`,
                background: resolvedTheme.colors.chipBackground,
              }}
            >
              <span style={{ fontSize: 13, marginRight: 4, color: resolvedTheme.colors.chipText, fontFamily, ...styleOverrides?.chipText }}>{item.label}</span>
              <span
                role="button"
                tabIndex={0}
                aria-label={`${item.label} kaldır`}
                onClick={() => handleSelectItem(item)}
                style={{ cursor: 'pointer', fontSize: 11, fontWeight: 700, color: resolvedTheme.colors.chipText }}
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}

      {!!error && <div style={{ fontSize: 12, marginTop: 4, color: resolvedTheme.colors.errorText, fontFamily, ...styleOverrides?.errorText }}>{error}</div>}
      {!error && !!helperText && (
        <div style={{ fontSize: 12, marginTop: 4, color: resolvedTheme.colors.helperText, fontFamily, ...styleOverrides?.helperText }}>{helperText}</div>
      )}

      <style>{`@keyframes tb-dropdown-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const Dropdown = forwardRef(DropdownInner) as <T extends DropdownValue>(
  props: WebDropdownProps<T> & { ref?: React.Ref<DropdownHandle> }
) => ReactElement;

export { Dropdown };
export default Dropdown;
