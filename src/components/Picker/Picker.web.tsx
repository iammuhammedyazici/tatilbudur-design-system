import { useEffect, useId, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Input } from '../Input/Input.web';
import type { PickerProps } from './Picker.types';
import { usePicker } from './usePicker';

export interface WebPickerProps<
  T extends string | number = string | number
> extends PickerProps<T> {
  containerStyle?: CSSProperties;
  inputContainerStyle?: CSSProperties;
  inputTextStyle?: CSSProperties;
  itemStyle?: CSSProperties;
  /** HTML form gönderiminde kullanılacak alan adı. Doğrulamayı form yönetir. */
  name?: string;
}

export function Picker<T extends string | number = string | number>(
  props: WebPickerProps<T>
) {
  const state = usePicker(props);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const placeholder = props.placeholder ?? 'Seçiniz';
  const title = props.modalTitle ?? props.label ?? 'Seçim Yapın';
  useEffect(() => {
    if (!state.isOpen) return;
    const element = dialog.current;
    element?.showModal();
    if (element) element.style.display = 'flex';
    return () => {
      element?.close();
      trigger.current?.focus();
    };
  }, [state.isOpen]);

  return (
    <div
      style={{
        color: '#3F536C',
        fontFamily: 'Poppins, system-ui, sans-serif',
        ...props.containerStyle,
      }}
    >
      {props.label && (
        <label htmlFor={`${id}-trigger`} style={styles.label}>
          {props.label}
          {props.required && (
            <span aria-hidden="true" style={{ color: '#D6243B' }}>
              {' '}
              *
            </span>
          )}
        </label>
      )}
      <button
        ref={trigger}
        id={`${id}-trigger`}
        type="button"
        onClick={state.open}
        disabled={props.disabled}
        aria-label={props.accessibilityLabel ?? props.label ?? placeholder}
        aria-describedby={
          [
            state.selectedItem ? `${id}-value` : undefined,
            state.message ? `${id}-message` : undefined,
          ]
            .filter(Boolean)
            .join(' ') || undefined
        }
        aria-haspopup={props.onPress ? undefined : 'dialog'}
        aria-expanded={props.onPress ? undefined : state.isOpen}
        aria-controls={state.isOpen ? `${id}-dialog` : undefined}
        aria-invalid={!!props.error}
        aria-disabled={state.locked}
        data-testid={props.testID}
        style={{
          ...styles.trigger,
          ...(props.disabled ? { background: '#F0F4FA', opacity: 0.7 } : {}),
          ...(props.error ? { borderColor: '#D6243B' } : {}),
          cursor: state.locked ? 'default' : 'pointer',
          ...props.inputContainerStyle,
        }}
      >
        {props.leftIcon && <span style={styles.icon}>{props.leftIcon}</span>}
        <span
          id={`${id}-value`}
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left',
            color: state.selectedItem ? '#3F536C' : '#6F7E90',
            ...props.inputTextStyle,
          }}
        >
          {state.selectedItem?.label ?? placeholder}
        </span>
        <span style={styles.icon}>
          {props.rightIcon !== undefined ? (
            props.rightIcon
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              style={{ transform: state.isOpen ? 'rotate(180deg)' : undefined }}
            >
              <path
                d="m4 6 4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </button>
      {props.name && (
        <input
          type="hidden"
          name={props.name}
          value={state.value ?? ''}
          disabled={props.disabled}
        />
      )}
      {state.message && (
        <p
          id={`${id}-message`}
          role={props.error ? 'alert' : undefined}
          style={{
            margin: '4px 0 0',
            fontSize: 12,
            color: props.error ? '#D6243B' : '#6F7E90',
          }}
        >
          {state.message}
        </p>
      )}
      {state.isOpen && (
        <dialog
          id={`${id}-dialog`}
          ref={dialog}
          aria-labelledby={`${id}-title`}
          style={styles.dialog}
          onCancel={(event) => {
            event.preventDefault();
            state.close();
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
              state.close();
          }}
        >
          <header style={styles.header}>
            <h2
              id={`${id}-title`}
              style={{ margin: 0, fontSize: 16, fontWeight: 600 }}
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={state.confirm}
              disabled={!state.canConfirm}
              style={{ ...styles.done, opacity: state.canConfirm ? 1 : 0.4 }}
            >
              Tamamla
            </button>
          </header>
          <div
            style={{
              padding: '8px 16px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button type="button" onClick={state.close} style={styles.cancel}>
              Vazgeç
            </button>
          </div>
          {props.searchable && (
            <div style={{ padding: '0 16px 16px' }}>
              <Input
                aria-label="Seçenek ara"
                placeholder={props.searchPlaceholder ?? 'Ara...'}
                value={state.query}
                onChangeText={state.setQuery}
                autoComplete="off"
              />
            </div>
          )}
          <div
            role="radiogroup"
            aria-label={title}
            style={{ overflowY: 'auto', minHeight: 0, paddingBottom: 16 }}
          >
            {!state.filteredItems.length && (
              <p
                role="status"
                style={{ padding: 24, textAlign: 'center', color: '#8A92A6' }}
              >
                Kayıt bulunamadı.
              </p>
            )}
            {state.filteredItems.map((item) => (
              <label
                key={`${typeof item.value}:${item.value}`}
                style={{
                  ...styles.row,
                  opacity: item.disabled ? 0.5 : 1,
                  color:
                    item.value === state.draftValue ? '#115BB9' : '#3F536C',
                  background:
                    item.value === state.draftValue ? '#F3F7FE' : '#FFF',
                  cursor: item.disabled ? 'default' : 'pointer',
                  ...props.itemStyle,
                }}
              >
                <span style={{ flex: 1 }}>{item.label}</span>
                <input
                  type="radio"
                  name={`${id}-option`}
                  checked={item.value === state.draftValue}
                  disabled={item.disabled}
                  onChange={() => state.select(item)}
                  style={{
                    accentColor: '#115BB9',
                    width: 18,
                    height: 18,
                    flexShrink: 0,
                  }}
                />
              </label>
            ))}
          </div>
        </dialog>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  label: { display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 },
  trigger: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    height: 50,
    width: '100%',
    border: '1px solid #CFD4DA',
    borderRadius: 6,
    padding: '0 16px',
    background: '#FFF',
    color: '#3F536C',
    font: '500 14px Poppins, system-ui, sans-serif',
  },
  icon: { display: 'inline-flex', alignItems: 'center', flexShrink: 0 },
  dialog: {
    border: 0,
    borderRadius: 16,
    padding: 0,
    width: 'min(480px, calc(100vw - 32px))',
    maxHeight: '80dvh',
    color: '#3F536C',
    fontFamily: 'Poppins, system-ui, sans-serif',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 24px 80px #14233440',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderBottom: '1px solid #E6EAF0',
  },
  done: {
    font: '600 16px Poppins, system-ui, sans-serif',
    color: '#115BB9',
    border: 0,
    background: 'none',
    padding: 4,
    cursor: 'pointer',
  },
  cancel: {
    font: 'inherit',
    fontSize: 12,
    border: 0,
    background: 'none',
    color: '#6F7E90',
    cursor: 'pointer',
    padding: 4,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    borderBottom: '1px solid #F0F4FA',
    fontSize: 15,
  },
};
