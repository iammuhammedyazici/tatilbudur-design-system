import { forwardRef, useEffect, useId, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Input } from '../Input/Input.web';
import type { WebInputProps } from '../Input/Input.web';
import { inputTokens as tokens } from '../Input/Input.tokens';
import type { ContactInputProps } from './ContactInput.types';
import { useContactInput } from './useContactInput';

export interface WebContactInputProps
  extends ContactInputProps,
    Omit<WebInputProps, keyof ContactInputProps | 'type' | 'prefix'> {}

export const ContactInput = forwardRef<
  HTMLInputElement,
  WebContactInputProps
>(function ContactInput(
  {
    value,
    defaultValue,
    onChangeText,
    onModeChange,
    onCallingCodeChange,
    forcedMode,
    defaultCountry,
    label,
    placeholder,
    disabled,
    readOnly,
    editable,
    ...props
  },
  ref
) {
  const state = useContactInput({
    value,
    defaultValue,
    onChangeText,
    onModeChange,
    onCallingCodeChange,
    forcedMode,
    defaultCountry,
  });
  const locked = disabled || readOnly || editable === false;
  const dialog = useRef<HTMLDialogElement>(null);
  const countryButton = useRef<HTMLButtonElement>(null);
  const id = useId();
  const pickerOpen = state.pickerVisible && state.isPhoneMode && !locked;
  useEffect(() => {
    if (!pickerOpen) return;
    const element = dialog.current;
    element?.showModal();
    return () => {
      element?.close();
      countryButton.current?.focus();
    };
  }, [pickerOpen]);
  useEffect(() => {
    if (locked || !state.isPhoneMode) state.setPickerVisible(false);
  }, [locked, state.isPhoneMode, state.setPickerVisible]);

  return (
    <>
      <Input
        {...props}
        ref={ref}
        label={label ?? state.label}
        placeholder={placeholder ?? state.placeholder}
        value={state.value}
        onChangeText={state.changeText}
        disabled={disabled}
        readOnly={readOnly}
        editable={editable}
        type="text"
        inputMode={
          props.inputMode ??
          (forcedMode === 'phone'
            ? 'tel'
            : forcedMode === 'email'
            ? 'email'
            : 'text')
        }
        autoCapitalize={props.autoCapitalize ?? 'none'}
        autoCorrect={props.autoCorrect ?? 'off'}
        spellCheck={props.spellCheck ?? false}
        prefix={
          state.isPhoneMode ? (
            <span style={styles.prefix}>
              <button
                type="button"
                ref={countryButton}
                style={styles.countryButton}
                disabled={locked}
                aria-label={`Ülke seç: ${state.country.name} (${state.country.callingCode})`}
                aria-haspopup="dialog"
                aria-expanded={pickerOpen}
                onClick={state.openPicker}
                data-testid={props.testID && `${props.testID}-country-button`}
              >
                <span aria-hidden="true" style={{ fontSize: 18 }}>
                  {state.country.flag}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m4 6 4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span style={styles.divider} />
              <span>{state.country.callingCode}</span>
            </span>
          ) : undefined
        }
      />
      {pickerOpen && (
        <dialog
          ref={dialog}
          aria-labelledby={`${id}-title`}
          style={styles.dialog}
          onCancel={(event) => {
            event.preventDefault();
            state.setPickerVisible(false);
          }}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const rect = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom
            )
              state.setPickerVisible(false);
          }}
        >
          <div style={styles.header}>
            <h2
              id={`${id}-title`}
              style={{ fontSize: 16, fontWeight: 600, margin: 0 }}
            >
              Ülke Seç
            </h2>
            <button
              type="button"
              aria-label="Ülke seçimini kapat"
              onClick={() => state.setPickerVisible(false)}
              style={styles.close}
            >
              ×
            </button>
          </div>
          <div style={{ padding: '0 16px 12px' }}>
            <Input
              autoFocus
              aria-label="Ülke ara"
              placeholder="Ülke adı veya telefon kodu"
              value={state.search}
              onChangeText={state.setSearch}
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
            {!state.filteredCountries.length && (
              <p role="status" style={{ padding: 24, textAlign: 'center' }}>
                Ülke bulunamadı
              </p>
            )}
            {state.filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                aria-pressed={state.country.code === country.code}
                onClick={() => state.selectCountry(country)}
                style={{
                  ...styles.row,
                  background:
                    state.country.code === country.code ? '#EDF4FE' : '#FFF',
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 20 }}>
                  {country.flag}
                </span>
                <span style={{ flex: 1, textAlign: 'left' }}>
                  {country.name}
                </span>
                <span>{country.callingCode}</span>
              </button>
            ))}
          </div>
        </dialog>
      )}
    </>
  );
});

const styles: Record<string, CSSProperties> = {
  prefix: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    alignSelf: 'stretch',
    color: tokens.text,
    fontFamily: tokens.fontWeb,
    fontSize: 14,
    marginRight: -6,
  },
  countryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: 0,
    background: 'transparent',
    border: 0,
    color: 'inherit',
    cursor: 'pointer',
    alignSelf: 'stretch',
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    background: tokens.border,
    margin: '0 8px',
  },
  dialog: {
    border: 0,
    padding: 0,
    borderRadius: 20,
    width: 'min(440px, calc(100vw - 32px))',
    height: 'min(560px, 80dvh)',
    maxHeight: '80dvh',
    color: tokens.text,
    fontFamily: tokens.fontWeb,
    fontSize: 14,
    boxShadow: '0 24px 80px #14233440',
    flexDirection: 'column',
    display: 'flex',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  close: {
    width: 32,
    height: 32,
    border: 0,
    borderRadius: 8,
    fontSize: 24,
    background: '#F3F6FA',
    color: tokens.text,
    cursor: 'pointer',
  },
  row: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    border: 0,
    borderBottom: '1px solid #EEF0F3',
    color: 'inherit',
    font: 'inherit',
    cursor: 'pointer',
  },
};
