import { useEffect, useMemo, useState } from 'react';
import type { PickerProps, PickerItem } from './Picker.types';

// Kaynak: tatilbudurapp-v82 / components/common/CustomPicker.
// Liste içindeki geçici seçim, Tamamla denene kadar form değerini değiştirmez.
export function usePicker<T extends string | number>(
  props: PickerProps<T>
) {
  const [internalValue, setInternalValue] = useState<T | null>(
    props.defaultValue ?? null
  );
  const value = props.value === undefined ? internalValue : props.value;
  const [visible, setVisible] = useState(false);
  const [session, setSession] = useState({
    baseValue: value,
    draftValue: value,
  });
  const [query, setQuery] = useState('');
  const locked = !!(props.disabled || props.readOnly);
  const isOpen = visible && !locked && !props.onPress;
  // Açıkken form sıfırlanırsa eski geçici seçimi tekrar kaydetmeyin.
  const draftValue = session.baseValue === value ? session.draftValue : value;
  const selectedItem = props.items.find((item) => item.value === value);
  const draftItem = props.items.find(
    (item) => item.value === draftValue && !item.disabled
  );
  const filteredItems = useMemo(() => {
    if (!props.searchable || !query.trim()) return props.items;
    const normalize = (text: string) =>
      text
        .toLocaleLowerCase('tr')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ı/g, 'i');
    const search = normalize(query.trim());
    return props.items.filter((item) => normalize(item.label).includes(search));
  }, [props.items, props.searchable, query]);

  useEffect(() => {
    if (locked || props.onPress) setVisible(false);
  }, [locked, props.onPress]);

  function close() {
    setVisible(false);
    setQuery('');
  }
  return {
    value,
    isOpen,
    locked,
    selectedItem,
    draftValue,
    filteredItems,
    query,
    setQuery,
    canConfirm: !!draftItem,
    message:
      props.helperText || (props.error ? 'Bir seçim yapmalısınız.' : undefined),
    open() {
      if (locked) return;
      if (props.onPress) {
        props.onPress();
        return;
      }
      setSession({ baseValue: value, draftValue: value });
      setQuery('');
      setVisible(true);
    },
    close,
    select(item: PickerItem<T>) {
      if (locked || item.disabled) return;
      setSession({ baseValue: value, draftValue: item.value });
    },
    confirm() {
      if (locked || !draftItem) return;
      if (props.value === undefined) setInternalValue(draftItem.value);
      close();
      props.onChange?.(draftItem);
    },
  };
}
