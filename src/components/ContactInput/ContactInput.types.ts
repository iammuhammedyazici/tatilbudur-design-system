export type ContactInputMode = 'phone' | 'email';

export interface ContactInputProps {
  /** Ulusal telefon numarası veya e-posta; ülke kodu bu değere eklenmez. */
  value?: string;
  defaultValue?: string;
  onChangeText?: (value: string) => void;
  /** İlk render ve mod değişimlerinde bildirilir. Altı rakam telefon modunu açar. */
  onModeChange?: (isPhoneMode: boolean) => void;
  /** İlk render ve ülke değişimlerinde +90 gibi ülke arama kodunu bildirir. */
  onCallingCodeChange?: (callingCode: string) => void;
  /** Otomatik algılamayı kapatır. Doğrulama veya maskeleme uygulamaz. */
  forcedMode?: ContactInputMode;
  /** İlk seçili ülkenin ISO 3166-1 alpha-2 kodu. Varsayılan TR. */
  defaultCountry?: string;
}
