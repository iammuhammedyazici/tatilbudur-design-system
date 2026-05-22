import type { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Buton içeriği (text veya custom JSX) */
  children: ReactNode;

  /** Görsel varyant */
  variant?: ButtonVariant;

  /** Boyut */
  size?: ButtonSize;

  /** Tıklama handler */
  onPress?: () => void;

  /** Devre dışı durum */
  disabled?: boolean;

  /** Yükleniyor durumu (spinner gösterir) */
  loading?: boolean;

  /** Tam genişlik kullansın mı */
  fullWidth?: boolean;

  /** Sol ikon */
  leftIcon?: ReactNode;

  /** Sağ ikon */
  rightIcon?: ReactNode;

  /** Test için */
  testID?: string;
}
