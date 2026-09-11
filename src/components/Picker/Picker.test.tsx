import { act, render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Picker } from './Picker.web';
import { usePicker } from './usePicker';
import type { PickerProps } from './Picker.types';
const items = [
  { label: 'Bugün', value: 0 },
  { label: 'Yarın', value: 1 },
  { label: 'Kapalı', value: 2, disabled: true },
];

describe('Picker selection', () => {
  it('keeps draft changes private until confirmation, including numeric zero', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => usePicker({ items, onChange }));
    act(() => result.current.open());
    act(() => result.current.select(items[0]));
    expect(result.current.value).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
    act(() => result.current.confirm());
    expect(result.current.value).toBe(0);
    expect(result.current.isOpen).toBe(false);
    expect(onChange).toHaveBeenCalledExactlyOnceWith(items[0]);
  });
  it('discards cancelled choices and clears the search on reopening', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      usePicker({ items, defaultValue: 0, searchable: true, onChange })
    );
    act(() => result.current.open());
    act(() => {
      result.current.select(items[1]);
      result.current.setQuery('yarin');
    });
    expect(result.current.filteredItems).toEqual([items[1]]);
    act(() => result.current.close());
    act(() => result.current.open());
    expect(result.current.draftValue).toBe(0);
    expect(result.current.query).toBe('');
    expect(onChange).not.toHaveBeenCalled();
  });
  it('does not overwrite a controlled value if the parent declines the change', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      usePicker({ items, value: 0, onChange })
    );
    act(() => result.current.open());
    act(() => result.current.select(items[1]));
    act(() => result.current.confirm());
    expect(onChange).toHaveBeenCalledWith(items[1]);
    expect(result.current.value).toBe(0);
    act(() => result.current.open());
    expect(result.current.draftValue).toBe(0);
  });
  it('honors an external reset while the picker is open', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      (props: PickerProps<number>) => usePicker(props),
      {
        initialProps: {
          items,
          value: 0,
          onChange,
        } as PickerProps<number>,
      }
    );
    act(() => result.current.open());
    act(() => result.current.select(items[1]));
    rerender({ items, value: null, onChange });
    expect(result.current.draftValue).toBeNull();
    expect(result.current.canConfirm).toBe(false);
    act(() => result.current.confirm());
    expect(onChange).not.toHaveBeenCalled();
  });
  it('rejects disabled and removed options', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      (props: PickerProps<number>) => usePicker(props),
      { initialProps: { items, onChange } as PickerProps<number> }
    );
    act(() => result.current.open());
    act(() => result.current.select(items[2]));
    expect(result.current.canConfirm).toBe(false);
    act(() => result.current.select(items[1]));
    rerender({ items: [items[0]], onChange });
    expect(result.current.canConfirm).toBe(false);
    act(() => result.current.confirm());
    expect(onChange).not.toHaveBeenCalled();
  });
  it('closes without committing when disabled and cannot reopen when read-only', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      (props: PickerProps<number>) => usePicker(props),
      { initialProps: { items, onChange } as PickerProps<number> }
    );
    act(() => result.current.open());
    act(() => result.current.select(items[0]));
    rerender({ items, onChange, disabled: true });
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.confirm());
    expect(onChange).not.toHaveBeenCalled();
    rerender({ items, onChange, readOnly: true });
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(false);
  });
  it('supports a custom trigger action without opening a picker', () => {
    const onPress = vi.fn();
    const { result } = renderHook(() => usePicker({ items, onPress }));
    act(() => result.current.open());
    expect(onPress).toHaveBeenCalledOnce();
    expect(result.current.isOpen).toBe(false);
  });
  it('renders accessible errors and submits the selected raw value in web forms', () => {
    const { container } = render(
      <Picker
        items={items}
        defaultValue={0}
        label="Arama zamanı"
        name="callTime"
        error
        helperText="Bir zaman seçin"
      />
    );
    expect(
      screen.getByRole('button', { name: 'Arama zamanı' })
    ).toHaveAccessibleDescription('Bugün Bir zaman seçin');
    expect(
      screen.getByRole('button', { name: 'Arama zamanı' })
    ).toHaveAttribute('aria-invalid', 'true');
    expect(container.querySelector('input[name="callTime"]')).toHaveValue('0');
  });
});
