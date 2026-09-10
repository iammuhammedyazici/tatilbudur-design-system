import type { ReactNode } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'error' | 'success';
export type InputType = 'text' | 'password' | 'tc' | 'email' | 'number' | 'tel';

export interface InputProps {
  /** Input değeri (controlled) */
  value?: string;
  /** Kontrolsüz kullanımda başlangıç değeri. */
  defaultValue?: string;

  /** Değer değişim handler */
  onChangeText?: (value: string) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Üstte görünen label */
  label?: string;

  /** Alt mesaj (helper / hata mesajı) */
  helperText?: string;
  /** TBTextInput hata görünümü: pembe zemin, kırmızı kenarlık ve ikonlu mesaj. */
  error?: string;

  /** Eski API uyumluluğu. TBTextInput tasarımının varsayılanı md (48px). */
  size?: InputSize;

  /** Eski API uyumluluğu. Yeni kullanımlarda hata için error tercih edilir. */
  status?: InputStatus;

  /** Devre dışı */
  disabled?: boolean;

  /** Sadece okunabilir */
  readOnly?: boolean;
  /** React Native ile ortak düzenlenebilirlik özelliği. */
  editable?: boolean;

  /** Sol icon */
  leftIcon?: ReactNode;

  /** Sağ icon */
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
  /** Özel sağ ikon aksiyonunun erişilebilir adı. */
  rightIconAccessibilityLabel?: string;

  /** Tam genişlik */
  fullWidth?: boolean;

  /** Required field */
  required?: boolean;

  /** tc: yalnızca rakam, en fazla 11 karakter; kimlik doğrulaması yapmaz. */
  type?: InputType;
  maxLength?: number;
  autoFocus?: boolean;

  /** Test ID */
  testID?: string;
}
