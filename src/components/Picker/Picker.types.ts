import type { ReactNode } from 'react';

export interface PickerItem<T extends string | number = string | number> {
  label: string;
  /** Seçenekler arasında benzersiz ve sabit olmalıdır. */
  value: T;
  disabled?: boolean;
}

export interface PickerProps<
  T extends string | number = string | number
> {
  items: readonly PickerItem<T>[];
  /** Kontrollü seçim. Seçimi temizlemek için null kullanın. */
  value?: T | null;
  defaultValue?: T;
  /** Yalnızca Tamamla ile onaylandığında çağrılır. */
  onChange?: (item: PickerItem<T>) => void;
  label?: string;
  placeholder?: string;
  modalTitle?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Verilirse varsayılan listeyi açmak yerine bu işlem çalışır. */
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
}
