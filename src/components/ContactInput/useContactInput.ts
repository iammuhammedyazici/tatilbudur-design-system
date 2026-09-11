import { useEffect, useMemo, useRef, useState } from 'react';
import type { ContactInputProps } from './ContactInput.types';
import { contactCountries } from './countries';

// Kaynak: tatilbudurapp-v82/src/screens/signInUp/components/AuthContactInput.tsx.
// Altı rakamdan sonra telefon modu, boşaltılana veya metin girilene dek korunur.
export function useContactInput(props: ContactInputProps) {
  const [internalValue, setInternalValue] = useState(props.defaultValue ?? '');
  const value = props.value ?? internalValue;
  const [previous, setPrevious] = useState({
    value,
    phone: /^\d{6,}$/.test(value),
  });
  const phone = /^\d+$/.test(value) && (previous.phone || value.length >= 6);
  if (previous.value !== value) setPrevious({ value, phone });
  const isPhoneMode = props.forcedMode ? props.forcedMode === 'phone' : phone;
  const [country, setCountry] = useState(
    () =>
      contactCountries.find(
        (item) => item.code === (props.defaultCountry ?? 'TR').toUpperCase()
      ) ?? contactCountries.find((item) => item.code === 'TR')!
  );
  const [pickerVisible, setPickerVisible] = useState(false);
  const [search, setSearch] = useState('');
  const filteredCountries = useMemo(() => {
    const normalize = (text: string) =>
      text
        .toLocaleLowerCase('tr')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ı/g, 'i');
    const query = normalize(search.trim());
    return contactCountries.filter((item) =>
      normalize(
        `${item.name} ${item.englishName} ${item.code} ${item.callingCode}`
      ).includes(query)
    );
  }, [search]);

  const notifiedMode = useRef<boolean | undefined>(undefined);
  const notifiedCallingCode = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (notifiedMode.current === isPhoneMode) return;
    notifiedMode.current = isPhoneMode;
    props.onModeChange?.(isPhoneMode);
  }, [isPhoneMode, props.onModeChange]);
  useEffect(() => {
    if (notifiedCallingCode.current === country.callingCode) return;
    notifiedCallingCode.current = country.callingCode;
    props.onCallingCodeChange?.(country.callingCode);
  }, [country.callingCode, props.onCallingCodeChange]);

  return {
    value,
    isPhoneMode,
    country,
    pickerVisible,
    setPickerVisible,
    search,
    setSearch,
    filteredCountries,
    changeText(text: string) {
      if (props.value === undefined) setInternalValue(text);
      props.onChangeText?.(text);
    },
    openPicker() {
      setSearch('');
      setPickerVisible(true);
    },
    selectCountry(next: typeof country) {
      setCountry(next);
      setPickerVisible(false);
    },
    label:
      props.forcedMode === 'phone'
        ? 'Telefon numarası'
        : props.forcedMode === 'email'
        ? 'E-posta adresi'
        : 'E-posta adresi veya telefon numarası',
    placeholder:
      props.forcedMode === 'phone'
        ? '5xxxxxxxxx'
        : props.forcedMode === 'email'
        ? 'ornek@mail.com'
        : 'ornek@mail.com veya 5xxxxxxxxx',
  };
}
