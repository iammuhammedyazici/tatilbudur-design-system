import type { ReactElement, ReactNode } from 'react';

// Kaynak: tatilbudurapp-v82 / src/components/Dropdown.

export type DropdownValue = string | number | boolean;

export interface DropdownItem<T extends DropdownValue = string> {
  /** Benzersiz tanımlayıcı — React key olarak kullanılır */
  id: string | number;
  /** Görünen metin */
  label: string;
  /** Seçildiğinde iletilen gerçek değer */
  value: T;
  /** Seçilemez yapar */
  disabled?: boolean;
  /** Sol taraftaki ikon */
  icon?: ReactNode;
  /** renderItem içinde erişilebilen serbest ek veri */
  meta?: Record<string, unknown>;
}

export interface DropdownSection<T extends DropdownValue = string> {
  title: string;
  data: DropdownItem<T>[];
}

export type DropdownSize = 'small' | 'medium' | 'large';

export type DropdownThemeVariant =
  | 'default'
  | 'light'
  | 'dark'
  | 'outline'
  | 'filled'
  | 'danger'
  | 'success';

/**
 * - `default` → tetikleyicinin hemen altında/üstünde, aynı ağaçta konumlanan liste
 * - `modal`   → RN/DOM Modal içinde render edilir (ScrollView/başka modal içinde bile güvenli)
 * - `inline`  → liste layout içinde genişler, altındaki içeriği aşağı iter
 */
export type DropdownMode = 'default' | 'modal' | 'inline';

export type DropdownDirection = 'auto' | 'top' | 'bottom';

export interface DropdownHandle {
  open: () => void;
  close: () => void;
  clear: () => void;
}

interface DropdownBaseProps<T extends DropdownValue> {
  items: DropdownItem<T>[];
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  loading?: boolean;
  readonly?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  /**
   * Arama sorgusu her değiştiğinde çağrılır.
   * Sunucu taraflı arama için async bir fonksiyon geçin.
   * Promise beklerken bir yükleniyor göstergesi gösterilir.
   */
  onSearch?: (query: string) => void | Promise<void>;
  mode?: DropdownMode;
  direction?: DropdownDirection;
  theme?: DropdownThemeVariant;
  size?: DropdownSize;
  /** Açılan listenin azami yüksekliği */
  maxHeight?: number;
  /**
   * Kaydırma başlamadan önce görünecek öğe sayısını sınırlar.
   * Verildiğinde maxHeight'tan önceliklidir.
   */
  visibleItemCount?: number;
  /** Bir öğe seçildikten sonra kapanıp kapanmayacağı (single için varsayılan true) */
  closeOnSelect?: boolean;
  /** Seçimi temizleyen × butonu göster */
  clearable?: boolean;
  /** Seçili değerleri chip olarak göster (multiple modunda) */
  showChips?: boolean;
  borderRadius?: number;
  leftIcon?: ReactNode;
  /** Varsayılan oku değiştirir */
  rightIcon?: ReactNode;
  renderItem?: (item: DropdownItem<T>, isSelected: boolean) => ReactElement;
  renderSelectedValue?: (
    selected: DropdownItem<T> | DropdownItem<T>[]
  ) => ReactElement;
  /** Varsayılan: String(item.id) */
  keyExtractor?: (item: DropdownItem<T>) => string;
  /** Bölümlenmiş veri (items'a alternatif) */
  sections?: DropdownSection<T>[];
  /** Liste sonuna ulaşıldığında tetiklenir — sayfalama için */
  onEndReached?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  required?: boolean;
  testID?: string;
}

export interface DropdownSingleProps<T extends DropdownValue>
  extends DropdownBaseProps<T> {
  multiple?: false;
  value: T | null;
  defaultValue?: T | null;
  onChange: (value: T | null, item: DropdownItem<T> | null) => void;
}

export interface DropdownMultipleProps<T extends DropdownValue>
  extends DropdownBaseProps<T> {
  multiple: true;
  value: T[] | null;
  defaultValue?: T[] | null;
  onChange: (value: T[] | null, items: DropdownItem<T>[]) => void;
}

export type DropdownProps<T extends DropdownValue = string> =
  | DropdownSingleProps<T>
  | DropdownMultipleProps<T>;
