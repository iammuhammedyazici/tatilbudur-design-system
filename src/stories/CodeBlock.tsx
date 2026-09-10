import { useEffect, useRef, useState } from 'react';
import { PreviewTabs } from './PreviewTabs';

type Tab = { label: string; language: string; code: string };

export function CodeBlock({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copyStatus, setCopyStatus] = useState('Kopyala');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function handleCopy() {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(tabs[activeTab].code);
      setCopyStatus('Kopyalandı');
    } catch {
      setCopyStatus('Kopyalanamadı');
    }
    timer.current = setTimeout(() => setCopyStatus('Kopyala'), 1800);
  }

  return (
    <div className="tb-code">
      <PreviewTabs label="Kod platformu" toolbarClassName="tb-code-toolbar" active={activeTab}
        onChange={(index) => { setActiveTab(index); setCopyStatus('Kopyala'); }}
        action={<button type="button" className="tb-code-copy" onClick={handleCopy} aria-live="polite">{copyStatus}</button>}
        tabs={tabs.map(tab => ({ label: tab.label, content: <pre><code className={`language-${tab.language}`}>{tab.code}</code></pre> }))} />
    </div>
  );
}
