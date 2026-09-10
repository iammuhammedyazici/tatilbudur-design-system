import { createContext, useContext, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { Decorator } from '@storybook/react-vite';
import { PhoneFrame } from './PhoneFrame';
import { PreviewTabs } from './PreviewTabs';
import './preview-workspace.css';

const PreviewPlatform = createContext<'web' | 'native'>('web');
export const usePreviewPlatform = () => useContext(PreviewPlatform);

function PreviewWorkspace({ children, title, name, Usage }: {
  children: ReactNode;
  title: string;
  name: string;
  Usage?: ComponentType;
}) {
  const [tab, setTab] = useState(0);
  const [mode, setMode] = useState('both');
  const preview = (
    <>
      <div className="tb-preview-toolbar">
        <span><span className="tb-live-dot" /> Canlı önizleme</span>
        <div className="tb-view-switch" role="group" aria-label="Görünüm seçimi">
          {[['both', 'Yan yana'], ['web', 'Web'], ['native', 'Mobil']].map(([value, label]) => (
            <button type="button" key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{label}</button>
          ))}
        </div>
      </div>
      <div className="tb-preview-grid" data-mode={mode}>
        <section className="tb-web-card" aria-label="Web önizlemesi" hidden={mode === 'native'}>
          <header className="tb-card-header"><span>Web</span><span className="tb-platform-label">DESKTOP</span></header>
          <div className="tb-browser-bar" aria-hidden="true"><span className="tb-window-dots"><i /><i /><i /></span><span className="tb-address">tatilbudur / {title.toLowerCase()}</span></div>
          <div className="tb-web-stage"><div className="tb-web-content">
            <PreviewPlatform.Provider value="web">{children}</PreviewPlatform.Provider>
          </div></div>
          <footer className="tb-card-footer">{name}<span>Web görünümü</span></footer>
        </section>
        <section className="tb-mobile-card" aria-label="Native önizlemesi" hidden={mode === 'web'}>
          <header className="tb-card-header"><span>Mobil</span><span className="tb-platform-label">NATIVE</span></header>
          <div className="tb-phone-stage"><PreviewPlatform.Provider value="native"><PhoneFrame>{children}</PhoneFrame></PreviewPlatform.Provider></div>
          <footer className="tb-card-footer">{name}<span>Mobil görünümü</span></footer>
        </section>
      </div>
    </>
  );

  return (
    <div className="tb-workspace">
      <header className="tb-workspace-header">
        <div><div className="tb-eyebrow">COMPONENT LIBRARY <span>/</span> {title.toUpperCase()}</div><h1>{title}<span className="tb-story-badge">{name}</span></h1><p>Her ekran için aynı tasarım dili.</p></div>
        <span className="tb-system-badge"><span /> Tatilbudur Design System</span>
      </header>
      <PreviewTabs label="Bileşen içeriği" active={tab} onChange={setTab} tabs={[
        { label: 'Önizleme', content: preview },
        ...(Usage ? [{ label: 'Kullanım', content: <div className="tb-usage"><Usage /></div> }] : []),
      ]} />
    </div>
  );
}

export const CompareDecorator: Decorator = (Story, context) => (
  <PreviewWorkspace key={context.id} title={context.title.split('/').pop() ?? 'Components'} name={context.name} Usage={context.parameters.usage}>
    <Story />
  </PreviewWorkspace>
);
