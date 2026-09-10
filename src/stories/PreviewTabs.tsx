import { useId } from 'react';
import type { ReactNode } from 'react';

export function PreviewTabs({ label, tabs, active, onChange, action, toolbarClassName }: {
  label: string;
  tabs: { label: string; content: ReactNode }[];
  active: number;
  onChange: (index: number) => void;
  action?: ReactNode;
  toolbarClassName?: string;
}) {
  const id = useId();
  return (
    <>
      <div className={toolbarClassName}>
      <div className="tb-tabs" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button key={tab.label} type="button" role="tab" id={`${id}-tab-${index}`}
            aria-selected={active === index} aria-controls={`${id}-panel-${index}`}
            tabIndex={active === index ? 0 : -1} onClick={() => onChange(index)}
            onKeyDown={(event) => {
              const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length
                : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
                : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
              if (next === null) return;
              event.preventDefault();
              onChange(next);
              event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next].focus();
            }}>
            {tab.label}
          </button>
        ))}
      </div>
      {action}
      </div>
      {tabs.map((tab, index) => (
        <div key={tab.label} role="tabpanel" id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`} hidden={active !== index}>
          {tab.content}
        </div>
      ))}
    </>
  );
}
