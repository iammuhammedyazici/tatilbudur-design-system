import type { ReactNode } from 'react';

export type ButtonStyle = 'filled' | 'outline' | 'ghost' | 'link';
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Buton içeriği */
  children?: ReactNode;

  /** Görsel stil: filled / outline / ghost / link */
  buttonStyle?: ButtonStyle;

  /** Renk varyantı: primary / secondary / tertiary */
  variant?: ButtonVariant;

  /** Boyut: sm (32px) / md (40px) / lg (48px) */
  size?: ButtonSize;

  /** Tıklama handler */
  onPress?: () => void;

  /** Devre dışı */
  disabled?: boolean;

  /** Yükleniyor */
  loading?: boolean;

  /** Tam genişlik */
  fullWidth?: boolean;

  /** Sol ikon */
  leftIcon?: ReactNode;

  /** Sağ ikon */
  rightIcon?: ReactNode;

  /** Sadece ikon (kare buton) */
  iconOnly?: boolean;

  /** Test ID */
  testID?: string;
}
