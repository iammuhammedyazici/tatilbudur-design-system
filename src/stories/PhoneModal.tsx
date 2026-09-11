import { createContext, useContext, useEffect, useRef } from 'react';
import type { ComponentType, KeyboardEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { ModalProps } from 'react-native';

// undefined: outside a simulator; null: the simulator is still mounting.
export const PhoneModalHost = createContext<HTMLDivElement | null | undefined>(
  undefined
);

type Props = {
  children?: ReactNode;
  visible?: boolean;
  transparent?: boolean;
  animationType?: ModalProps['animationType'];
  testID?: string;
  onRequestClose?: () => void;
  fallback: ComponentType<ModalProps>;
};

export function PhoneModal({ fallback: Fallback, ...props }: Props) {
  const host = useContext(PhoneModalHost);
  if (host === undefined) return <Fallback {...props} />;
  if (!host || props.visible === false) return null;
  return createPortal(<PhoneModalContent {...props} host={host} />, host);
}

function PhoneModalContent({
  host,
  children,
  onRequestClose,
  testID,
  animationType,
}: Omit<Props, 'fallback'> & { host: HTMLDivElement }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const base =
      host.parentElement?.querySelector<HTMLElement>('[data-phone-base]');
    const wasInert = base?.inert ?? false;
    if (base) base.inert = true;
    panel.current?.focus();
    return () => {
      if (base) base.inert = wasInert;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [host]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onRequestClose?.();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [
      ...event.currentTarget.querySelectorAll<HTMLElement>(
        'button, input, select, textarea, a[href], [tabindex]'
      ),
    ].filter(
      (element) =>
        element.tabIndex >= 0 &&
        !element.matches(':disabled, [aria-disabled="true"]') &&
        element.getClientRects().length > 0
    );
    if (!focusable.length) {
      event.preventDefault();
      panel.current?.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (
      event.shiftKey &&
      (document.activeElement === first ||
        document.activeElement === panel.current)
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last ||
        document.activeElement === panel.current)
    ) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      ref={panel}
      tabIndex={-1}
      role="dialog"
      aria-label="Mobil seçim penceresi"
      data-testid={testID}
      data-phone-modal=""
      data-animation={animationType}
      className="tb-phone-modal"
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}
