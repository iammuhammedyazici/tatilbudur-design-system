import type { ReactNode } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'error' | 'success';

export interface InputProps {
  /** Input değeri (controlled) */
  value?: string;

  /** Değer değişim handler */
  onChangeText?: (value: string) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Üstte görünen label */
  label?: string;

  /** Alt mesaj (helper / hata mesajı) */
  helperText?: string;

  /** Boyut */
  size?: InputSize;

  /** Durum (default/error/success) */
  status?: InputStatus;

  /** Devre dışı */
  disabled?: boolean;

  /** Sadece okunabilir */
  readOnly?: boolean;

  /** Sol icon */
  leftIcon?: ReactNode;

  /** Sağ icon */
  rightIcon?: ReactNode;

  /** Tam genişlik */
  fullWidth?: boolean;

  /** Required field */
  required?: boolean;

  /** Input type (web) — text/email/password/number/tel */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';

  /** Test ID */
  testID?: string;
}
