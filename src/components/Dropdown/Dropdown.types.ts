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
  /** Bölüm başlığı */
  title: string;
  /** Bölüme ait öğeler */
  data: DropdownItem<T>[];
}

/** Tetikleyicinin yüksekliğini ve iç boşluğunu belirler. */
export type DropdownSize = 'small' | 'medium' | 'large';

/** Renk teması — 7 hazır varyanttan biri (TatilBudur marka tokenlarına göre). */
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

/** Listenin tetikleyiciye göre hangi yöne açılacağı — auto en uygun yönü otomatik seçer. */
export type DropdownDirection = 'auto' | 'top' | 'bottom';

export interface DropdownHandle {
  /** Listeyi programatik olarak açar */
  open: () => void;
  /** Listeyi programatik olarak kapatır */
  close: () => void;
  /** Seçimi temizler (handleClear ile aynı davranış) */
  clear: () => void;
}

export interface DropdownBaseProps<T extends DropdownValue> {
  /** Listelenecek tüm seçenekler */
  items: DropdownItem<T>[];
  /** Hiçbir şey seçili değilken gösterilen metin */
  placeholder?: string;
  /** Tetikleyicinin üstünde gösterilen etiket */
  label?: string;
  /** Doğrulama hatası — kırmızı kenarlık ve hata metni tetikler */
  error?: string;
  /** Tetikleyicinin altında gösterilen yardım metni */
  helperText?: string;
  /** Tüm etkileşimi devre dışı bırakır */
  disabled?: boolean;
  /** Tetikleyici içinde yükleniyor göstergesi gösterir */
  loading?: boolean;
  /** Değeri gösterir ama etkileşimi engeller */
  readonly?: boolean;
  /** Liste içinde bir arama kutusu gösterir */
  searchable?: boolean;
  /** Arama kutusunun placeholder metni */
  searchPlaceholder?: string;
  /**
   * Arama sorgusu her değiştiğinde çağrılır.
   * Sunucu taraflı arama için async bir fonksiyon geçin.
   * Promise beklerken bir yükleniyor göstergesi gösterilir.
   */
  onSearch?: (query: string) => void | Promise<void>;
  /** Açılan listenin nasıl render edileceği — default | modal | inline */
  mode?: DropdownMode;
  /** Listenin açılma yönü — auto | top | bottom */
  direction?: DropdownDirection;
  /** Renk teması — default | light | dark | outline | filled | danger | success */
  theme?: DropdownThemeVariant;
  /** Tetikleyici boyutu — small | medium | large */
  size?: DropdownSize;
  /** Açılan listenin azami yüksekliği (piksel) */
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
  /** Tetikleyici ve listenin köşe yuvarlaklığını özelleştirir */
  borderRadius?: number;
  /** Tetikleyicinin solunda gösterilen ikon */
  leftIcon?: ReactNode;
  /** Varsayılan açılır oku değiştirir */
  rightIcon?: ReactNode;
  /** Liste öğesinin görünümünü tamamen özelleştirmek için render fonksiyonu */
  renderItem?: (item: DropdownItem<T>, isSelected: boolean) => ReactElement;
  /** Tetikleyicideki seçili değer gösterimini özelleştirmek için render fonksiyonu */
  renderSelectedValue?: (
    selected: DropdownItem<T> | DropdownItem<T>[]
  ) => ReactElement;
  /** React key üretici — varsayılan: String(item.id) */
  keyExtractor?: (item: DropdownItem<T>) => string;
  /** Bölümlenmiş veri (items'a alternatif) */
  sections?: DropdownSection<T>[];
  /** Liste sonuna ulaşıldığında tetiklenir — sayfalama için kullanılır */
  onEndReached?: () => void;
  /** Liste açıldığında çağrılır */
  onOpen?: () => void;
  /** Liste kapandığında çağrılır */
  onClose?: () => void;
  /** Etiketin yanında zorunlu alan (*) işareti gösterir */
  required?: boolean;
  /** Test ve otomasyon için tanımlayıcı */
  testID?: string;
}

export interface DropdownSingleProps<T extends DropdownValue>
  extends DropdownBaseProps<T> {
  /** Çoklu seçim kapalı (varsayılan) */
  multiple?: false;
  /** Kontrollü seçili değer — seçimi temizlemek için null kullanın */
  value: T | null;
  /** Kontrolsüz kullanımda başlangıç değeri */
  defaultValue?: T | null;
  /** Seçim her değiştiğinde çağrılır */
  onChange: (value: T | null, item: DropdownItem<T> | null) => void;
}

export interface DropdownMultipleProps<T extends DropdownValue>
  extends DropdownBaseProps<T> {
  /** Çoklu seçimi açar */
  multiple: true;
  /** Kontrollü seçili değerler dizisi — temizlemek için null kullanın */
  value: T[] | null;
  /** Kontrolsüz kullanımda başlangıç değerleri */
  defaultValue?: T[] | null;
  /** Seçim her değiştiğinde çağrılır */
  onChange: (value: T[] | null, items: DropdownItem<T>[]) => void;
}

export type DropdownProps<T extends DropdownValue = string> =
  | DropdownSingleProps<T>
  | DropdownMultipleProps<T>;
