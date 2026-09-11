import type { ReactNode } from 'react';

export interface PickerItem<T extends string | number = string | number> {
  /** Görünen metin */
  label: string;
  /** Seçenekler arasında benzersiz ve sabit olmalıdır. */
  value: T;
  /** Seçilemez yapar */
  disabled?: boolean;
}

export interface PickerProps<
  T extends string | number = string | number
> {
  /** Listelenecek tüm seçenekler */
  items: readonly PickerItem<T>[];
  /** Kontrollü seçim. Seçimi temizlemek için null kullanın. */
  value?: T | null;
  /** Kontrolsüz kullanımda başlangıç değeri. */
  defaultValue?: T;
  /** Yalnızca Tamamla ile onaylandığında çağrılır. */
  onChange?: (item: PickerItem<T>) => void;
  /** Tetikleyicinin üstünde gösterilen etiket */
  label?: string;
  /** Hiçbir şey seçili değilken gösterilen metin */
  placeholder?: string;
  /** Açılan modal'ın başlığı */
  modalTitle?: string;
  /** Modal içinde bir arama kutusu gösterir */
  searchable?: boolean;
  /** Arama kutusunun placeholder metni */
  searchPlaceholder?: string;
  /** Tüm etkileşimi devre dışı bırakır */
  disabled?: boolean;
  /** Değeri gösterir ama etkileşimi engeller */
  readOnly?: boolean;
  /** Doğrulama hatası — kırmızı kenarlık tetikler */
  error?: boolean;
  /** Tetikleyicinin altında gösterilen yardım/hata metni */
  helperText?: string;
  /** Etiketin yanında zorunlu alan (*) işareti gösterir */
  required?: boolean;
  /** Tetikleyicinin solunda gösterilen ikon */
  leftIcon?: ReactNode;
  /** Varsayılan açılır oku değiştirir */
  rightIcon?: ReactNode;
  /** Verilirse varsayılan listeyi açmak yerine bu işlem çalışır. */
  onPress?: () => void;
  /** Ekran okuyucular için erişilebilir ad — varsayılan: label veya placeholder */
  accessibilityLabel?: string;
  /** Test ve otomasyon için tanımlayıcı */
  testID?: string;
}
