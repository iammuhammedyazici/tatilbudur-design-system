import type { ReactNode } from 'react';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="tb-phone">
      <div className="tb-phone-screen">
        <div className="tb-phone-status" aria-hidden="true">
          <span>9:41</span><span className="tb-phone-island" />
          <svg width="46" height="14" viewBox="0 0 46 14" fill="currentColor"><path d="M1 9h2v4H1zm4-3h2v7H5zm4-3h2v10H9zm4-3h2v13h-2z" /><rect x="23" y="3" width="19" height="9" rx="2" fill="none" stroke="currentColor" /><rect x="25" y="5" width="15" height="5" rx="1" /><path d="M44 6h2v3h-2z" /></svg>
        </div>
        <div className="tb-phone-appbar"><span className="tb-phone-brand">tatilbudur</span><span className="tb-phone-avatar">TB</span></div>
        <div tabIndex={0} role="region" aria-label="Mobil önizleme içeriği" className="tb-phone-content">{children}</div>
        <div className="tb-phone-home" aria-hidden="true"><span /></div>
      </div>
    </div>
  );
}
