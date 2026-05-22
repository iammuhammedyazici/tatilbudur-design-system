import React, { useState } from 'react';

type Tab = {
  label: string;
  language: string;
  code: string;
};

interface CodeBlockProps {
  tabs: Tab[];
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tabs[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        border: '1px solid #E5E7EB',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#0F172A',
        margin: '16px 0',
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#1E293B',
          borderBottom: '1px solid #334155',
        }}
      >
        <div style={{ display: 'flex' }}>
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '10px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === i ? '2px solid #1D4ED8' : '2px solid transparent',
                color: activeTab === i ? '#FFFFFF' : '#94A3B8',
                fontSize: 13,
                fontWeight: activeTab === i ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'color 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            marginRight: 8,
            background: copied ? '#10B981' : 'transparent',
            border: '1px solid #334155',
            borderRadius: 6,
            color: '#FFFFFF',
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
        >
          {copied ? '✓ Kopyalandı' : '📋 Kopyala'}
        </button>
      </div>

      {/* Code area */}
      <pre
        style={{
          margin: 0,
          padding: 16,
          overflow: 'auto',
          fontSize: 13,
          lineHeight: 1.6,
          color: '#E2E8F0',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
        }}
      >
        <code>{tabs[activeTab].code}</code>
      </pre>
    </div>
  );
};
