import { useCallback, useMemo, useReducer, useRef } from 'react';
import type { DropdownItem, DropdownValue } from './Dropdown.types';
import {
  filterItems,
  getSelectedItems,
  isItemSelected,
  toggleMultipleValue,
} from './dropdown.helpers';

// Kaynak: tatilbudurapp-v82 / src/components/Dropdown/hooks/useDropdown.ts
// Orijinalinden fark: tetikleyicinin ekran konumunu ölçmek platforma özgü bir
// işlem olduğu için (RN: ref.measure, web: getBoundingClientRect) buradan
// çıkarıldı — her platform bileşeni kendi ölçümünü yapıp openDropdown()'a geçirir.

export interface UseDropdownOptions<T extends DropdownValue> {
  items: DropdownItem<T>[];
  value: T | T[] | null;
  multiple: boolean;
  searchable: boolean;
  closeOnSelect: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onSearch?: (query: string) => void | Promise<void>;
  onChange: (
    value: T | T[] | null,
    item: DropdownItem<T> | DropdownItem<T>[] | null
  ) => void;
}

export interface UseDropdownReturn<T extends DropdownValue> {
  isOpen: boolean;
  isSearchLoading: boolean;
  searchQuery: string;
  filteredItems: DropdownItem<T>[];
  selectedItems: DropdownItem<T>[];
  openDropdown: () => void;
  closeDropdown: () => void;
  toggleDropdown: () => void;
  handleSelectItem: (item: DropdownItem<T>) => void;
  handleSearchChange: (query: string) => void;
  handleClear: () => void;
}

interface DropdownState {
  isOpen: boolean;
  isSearchLoading: boolean;
  searchQuery: string;
}

type DropdownAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_SEARCH_LOADING'; loading: boolean };

function reducer(state: DropdownState, action: DropdownAction): DropdownState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, isOpen: true, searchQuery: '' };
    case 'CLOSE':
      return { ...state, isOpen: false, searchQuery: '', isSearchLoading: false };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'SET_SEARCH_LOADING':
      return { ...state, isSearchLoading: action.loading };
    default:
      return state;
  }
}

export function useDropdown<T extends DropdownValue>({
  items,
  value,
  multiple,
  searchable,
  closeOnSelect,
  onOpen,
  onClose,
  onSearch,
  onChange,
}: UseDropdownOptions<T>): UseDropdownReturn<T> {
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    isSearchLoading: false,
    searchQuery: '',
  });

  // Yarım kalmış async arama sonucunun eskimiş bir güncelleme yapmasını önler.
  const searchPromiseRef = useRef<Promise<void> | null>(null);

  const filteredItems = useMemo<DropdownItem<T>[]>(() => {
    if (!searchable || !state.searchQuery) return items;
    if (onSearch) return items; // sunucu taraflı filtreleme varsayılır
    return filterItems(items, state.searchQuery);
  }, [items, state.searchQuery, searchable, onSearch]);

  const selectedItems = useMemo<DropdownItem<T>[]>(
    () => getSelectedItems(items, value, multiple),
    [items, value, multiple]
  );

  const openDropdown = useCallback(() => {
    if (state.isOpen) return;
    dispatch({ type: 'OPEN' });
    onOpen?.();
  }, [state.isOpen, onOpen]);

  const closeDropdown = useCallback(() => {
    if (!state.isOpen) return;
    dispatch({ type: 'CLOSE' });
    onClose?.();
  }, [state.isOpen, onClose]);

  const toggleDropdown = useCallback(() => {
    if (state.isOpen) closeDropdown();
    else openDropdown();
  }, [state.isOpen, openDropdown, closeDropdown]);

  const handleSelectItem = useCallback(
    (item: DropdownItem<T>) => {
      if (item.disabled) return;

      if (multiple) {
        const currentArray = Array.isArray(value) ? value : null;
        const newValues = toggleMultipleValue(currentArray, item.value);
        const newItems = getSelectedItems(items, newValues, true);
        (onChange as (v: T[] | null, i: DropdownItem<T>[]) => void)(
          newValues.length > 0 ? newValues : null,
          newItems
        );
        if (closeOnSelect) closeDropdown();
      } else {
        const alreadySelected = isItemSelected(item, value, false);
        const newValue = alreadySelected ? null : item.value;
        (onChange as (v: T | null, i: DropdownItem<T> | null) => void)(
          newValue,
          alreadySelected ? null : item
        );
        if (closeOnSelect) closeDropdown();
      }
    },
    [multiple, value, items, onChange, closeOnSelect, closeDropdown]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      dispatch({ type: 'SET_SEARCH', query });
      if (!onSearch) return;

      const result = onSearch(query);
      if (result instanceof Promise) {
        searchPromiseRef.current = result;
        dispatch({ type: 'SET_SEARCH_LOADING', loading: true });
        result.finally(() => {
          if (searchPromiseRef.current === result) {
            dispatch({ type: 'SET_SEARCH_LOADING', loading: false });
          }
        });
      }
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    if (multiple) {
      (onChange as (v: T[] | null, i: DropdownItem<T>[]) => void)(null, []);
    } else {
      (onChange as (v: T | null, i: DropdownItem<T> | null) => void)(null, null);
    }
  }, [multiple, onChange]);

  return {
    isOpen: state.isOpen,
    isSearchLoading: state.isSearchLoading,
    searchQuery: state.searchQuery,
    filteredItems,
    selectedItems,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    handleSelectItem,
    handleSearchChange,
    handleClear,
  };
}
