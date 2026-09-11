import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDropdown } from './useDropdown';
import { Dropdown } from './Dropdown.web';
import type { DropdownItem } from './Dropdown.types';

const items: DropdownItem<string>[] = [
  { id: 'ist', label: 'İstanbul', value: 'ist' },
  { id: 'ank', label: 'Ankara', value: 'ank' },
  { id: 'izm', label: 'İzmir', value: 'izm', disabled: true },
];

describe('useDropdown (single select)', () => {
  it('opens, selects an item, and closes when closeOnSelect is true', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({ items, value: null, multiple: false, searchable: false, closeOnSelect: true, onChange })
    );
    act(() => result.current.openDropdown());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.handleSelectItem(items[0]));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('ist', items[0]);
    expect(result.current.isOpen).toBe(false);
  });

  it('deselects when the already-selected item is pressed again', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({ items, value: 'ist', multiple: false, searchable: false, closeOnSelect: true, onChange })
    );
    act(() => result.current.handleSelectItem(items[0]));
    expect(onChange).toHaveBeenCalledExactlyOnceWith(null, null);
  });

  it('ignores presses on disabled items', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({ items, value: null, multiple: false, searchable: false, closeOnSelect: true, onChange })
    );
    act(() => result.current.handleSelectItem(items[2]));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('filters items by search query (Turkish-aware, case-insensitive)', () => {
    const { result } = renderHook(() =>
      useDropdown({ items, value: null, multiple: false, searchable: true, closeOnSelect: true, onChange: vi.fn() })
    );
    act(() => result.current.handleSearchChange('IZMIR'));
    expect(result.current.filteredItems.map((i) => i.id)).toEqual(['izm']);
  });
});

describe('useDropdown (multiple select)', () => {
  it('accumulates values and stays open by default', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({ items, value: null, multiple: true, searchable: false, closeOnSelect: false, onChange })
    );
    act(() => result.current.handleSelectItem(items[0]));
    expect(onChange).toHaveBeenLastCalledWith(['ist'], [items[0]]);
    expect(result.current.isOpen).toBe(false);
  });

  it('removes a value already in the selection', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({ items, value: ['ist', 'ank'], multiple: true, searchable: false, closeOnSelect: false, onChange })
    );
    act(() => result.current.handleSelectItem(items[0]));
    expect(onChange).toHaveBeenLastCalledWith(['ank'], [items[1]]);
  });

  it('clears the whole selection via handleClear', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useDropdown({ items, value: ['ist'], multiple: true, searchable: false, closeOnSelect: false, onChange })
    );
    act(() => result.current.handleClear());
    expect(onChange).toHaveBeenCalledExactlyOnceWith(null, []);
  });
});

describe('Dropdown (web) rendering', () => {
  it('shows the placeholder, opens the list on click, and selects an item', () => {
    const onChange = vi.fn();
    function Wrapper() {
      return <Dropdown items={items} value={null} onChange={onChange} placeholder="Şehir seçin" testID="city" />;
    }
    render(<Wrapper />);
    expect(screen.getByText('Şehir seçin')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('city-trigger'));
    expect(screen.getByText('İstanbul')).toBeInTheDocument();
    fireEvent.click(screen.getByText('İstanbul'));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('ist', items[0]);
  });

  it('renders an error message and disables the trigger when disabled', () => {
    render(
      <Dropdown items={items} value={null} onChange={vi.fn()} error="Zorunlu alan" disabled testID="city" />
    );
    expect(screen.getByText('Zorunlu alan')).toBeInTheDocument();
    expect(screen.getByTestId('city-trigger')).toBeDisabled();
  });
});
