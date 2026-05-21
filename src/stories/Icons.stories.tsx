import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState, useMemo, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// src/icons/ klasöründeki tüm icon'ları otomatik import et
const iconModules = import.meta.glob('../icons/*.tsx', { eager: true });

type IconType = {
  name: string;
  Component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const allIcons: IconType[] = Object.entries(iconModules)
  .map(([path, module]) => {
    const name = path.split('/').pop()?.replace('.tsx', '') ?? 'Unknown';
    const Component = (module as { default: React.ComponentType<React.SVGProps<SVGSVGElement>> }).default;
    return { name, Component };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// ============ HELPER ============
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const downloadFile = (filename: string, content: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ============ ICON CARD ============
const IconCard = ({
  icon,
  isSelected,
  onClick,
  size,
  color,
}: {
  icon: IconType;
  isSelected: boolean;
  onClick: () => void;
  size: number;
  color: string;
}) => {
  const { name, Component } = icon;
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 20,
        border: `1px solid ${isSelected ? '#F76F00' : '#E5E7EB'}`,
        borderRadius: 12,
        background: isSelected ? '#FFF7ED' : '#FFFFFF',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: isSelected ? '0 4px 12px rgba(247, 111, 0, 0.15)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#F76F00';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#E5E7EB';
        }
      }}
    >
      <Component width={size} height={size} color={color} />
      <span
        style={{
          fontSize: 12,
          color: isSelected ? '#F76F00' : '#6B7280',
          fontFamily: '"JetBrains Mono", monospace',
          fontWeight: isSelected ? 600 : 400,
        }}
      >
        {name}
      </span>
    </div>
  );
};

// ============ COPY BUTTON ============
const CopyButton = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);
  const handleClick = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return (
    <button
      onClick={handleClick}
      style={{
        padding: '6px 12px',
        fontSize: 12,
        fontWeight: 500,
        border: '1px solid #E5E7EB',
        borderRadius: 6,
        background: copied ? '#F76F00' : '#FFFFFF',
        color: copied ? '#FFFFFF' : '#374151',
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontFamily: 'inherit',
      }}
    >
      {copied ? '✓ Kopyalandı' : label}
    </button>
  );
};

// ============ DETAIL PANEL ============
const DetailPanel = ({
  icon,
  onClose,
}: {
  icon: IconType;
  onClose: () => void;
}) => {
  const [detailSize, setDetailSize] = useState(64);
  const [detailColor, setDetailColor] = useState('#111827');
  const svgRef = useRef<HTMLDivElement>(null);

  const { name, Component } = icon;

  // SVG string'i üret (current state ile)
  const svgString = useMemo(() => {
    return renderToStaticMarkup(
      <Component width={detailSize} height={detailSize} color={detailColor} />
    );
  }, [Component, detailSize, detailColor]);

  const importSnippet = `import ${name}Icon from '@tatilbudur/icons/${name}';`;
  const usageSnippet = `<${name}Icon width={${detailSize}} height={${detailSize}} color="${detailColor}" />`;

  const handleDownloadSvg = () => {
    downloadFile(`${name.toLowerCase()}.svg`, svgString, 'image/svg+xml');
  };

  const handleDownloadPng = async () => {
    // SVG'yi canvas'a çiz, PNG'ye çevir
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = detailSize * 4; // 4x retina
      canvas.height = detailSize * 4;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = `${name.toLowerCase()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(pngUrl);
          }
        }, 'image/png');
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.2)',
          zIndex: 9998,
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '420px',
          maxWidth: '100vw',
          background: '#FFFFFF',
          borderLeft: '1px solid #E5E7EB',
          boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.08)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.2s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#111827',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              {name}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
              Icon detayları
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              border: 'none',
              background: '#F3F4F6',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 18,
              color: '#6B7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* Content (scrollable) */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {/* Preview */}
          <div
            ref={svgRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 32,
              background:
                'repeating-conic-gradient(#F9FAFB 0% 25%, #FFFFFF 0% 50%) 50% / 16px 16px',
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              marginBottom: 20,
              minHeight: 180,
            }}
          >
            <Component width={detailSize} height={detailSize} color={detailColor} />
          </div>

          {/* Size Control */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#374151',
                }}
              >
                Boyut
              </label>
              <span
                style={{
                  fontSize: 13,
                  color: '#6B7280',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                {detailSize}px
              </span>
            </div>
            <input
              type="range"
              min={16}
              max={128}
              step={2}
              value={detailSize}
              onChange={(e) => setDetailSize(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#F76F00',
              }}
            />
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {[16, 24, 32, 48, 64, 96].map((s) => (
                <button
                  key={s}
                  onClick={() => setDetailSize(s)}
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    fontSize: 11,
                    border: `1px solid ${detailSize === s ? '#F76F00' : '#E5E7EB'}`,
                    background: detailSize === s ? '#FFF7ED' : '#FFFFFF',
                    color: detailSize === s ? '#F76F00' : '#6B7280',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Control */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: '#374151',
                marginBottom: 8,
              }}
            >
              Renk
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="color"
                value={detailColor}
                onChange={(e) => setDetailColor(e.target.value)}
                style={{
                  width: 40,
                  height: 40,
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              />
              <input
                type="text"
                value={detailColor}
                onChange={(e) => setDetailColor(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: 13,
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  fontFamily: '"JetBrains Mono", monospace',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {['#111827', '#F76F00', '#3B82F6', '#10B981', '#EF4444', '#FFFFFF'].map(
                (c) => (
                  <button
                    key={c}
                    onClick={() => setDetailColor(c)}
                    style={{
                      flex: 1,
                      height: 28,
                      background: c,
                      border: `2px solid ${
                        detailColor.toLowerCase() === c.toLowerCase()
                          ? '#F76F00'
                          : '#E5E7EB'
                      }`,
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  />
                )
              )}
            </div>
          </div>

          {/* Import Snippet */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                Import
              </label>
              <CopyButton text={importSnippet} label="Kopyala" />
            </div>
            <pre
              style={{
                margin: 0,
                padding: 12,
                background: '#1F2937',
                color: '#F9FAFB',
                fontSize: 11,
                borderRadius: 6,
                overflow: 'auto',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              {importSnippet}
            </pre>
          </div>

          {/* Usage Snippet */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                Kullanım
              </label>
              <CopyButton text={usageSnippet} label="Kopyala" />
            </div>
            <pre
              style={{
                margin: 0,
                padding: 12,
                background: '#1F2937',
                color: '#F9FAFB',
                fontSize: 11,
                borderRadius: 6,
                overflow: 'auto',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              {usageSnippet}
            </pre>
          </div>

          {/* SVG Code */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                SVG Kodu
              </label>
              <CopyButton text={svgString} label="Kopyala" />
            </div>
            <pre
              style={{
                margin: 0,
                padding: 12,
                background: '#1F2937',
                color: '#F9FAFB',
                fontSize: 11,
                borderRadius: 6,
                overflow: 'auto',
                maxHeight: 160,
                fontFamily: '"JetBrains Mono", monospace',
                lineHeight: 1.5,
              }}
            >
              {svgString}
            </pre>
          </div>

          {/* Download Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleDownloadSvg}
              style={{
                flex: 1,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 500,
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                color: '#374151',
                borderRadius: 6,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ⬇ SVG İndir
            </button>
            <button
              onClick={handleDownloadPng}
              style={{
                flex: 1,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 500,
                border: 'none',
                background: '#F76F00',
                color: '#FFFFFF',
                borderRadius: 6,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ⬇ PNG İndir
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
};

// ============ GALLERY ============
const IconGallery = ({ size, color }: { size: number; color: string }) => {
  const [search, setSearch] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconType | null>(null);

  const filteredIcons = useMemo(() => {
    if (!search.trim()) return allIcons;
    const query = search.toLowerCase().trim();
    return allIcons.filter((icon) => icon.name.toLowerCase().includes(query));
  }, [search]);

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ position: 'relative', flex: 1, maxWidth: 480 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Icon ara... (örn: plane, calendar, user)"
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              fontSize: 14,
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              outline: 'none',
              transition: 'border-color 0.15s',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#F76F00')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <div style={{ fontSize: 13, color: '#6B7280', whiteSpace: 'nowrap' }}>
          <strong style={{ color: '#111827' }}>{filteredIcons.length}</strong>
          {filteredIcons.length !== allIcons.length && (
            <span> / {allIcons.length}</span>
          )}{' '}
          icon
        </div>
      </div>

      {/* Empty state */}
      {filteredIcons.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: '#9CA3AF',
            background: '#F9FAFB',
            borderRadius: 12,
            border: '1px dashed #E5E7EB',
          }}
        >
          <div style={{ fontSize: 14, marginBottom: 4 }}>
            "<strong style={{ color: '#111827' }}>{search}</strong>" için sonuç bulunamadı
          </div>
          <div style={{ fontSize: 12 }}>Farklı bir terim deneyin</div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: 12,
          }}
        >
          {filteredIcons.map((icon) => (
            <IconCard
              key={icon.name}
              icon={icon}
              isSelected={selectedIcon?.name === icon.name}
              onClick={() => setSelectedIcon(icon)}
              size={size}
              color={color}
            />
          ))}
        </div>
      )}

      {/* Detail Panel */}
      {selectedIcon && (
        <DetailPanel icon={selectedIcon} onClose={() => setSelectedIcon(null)} />
      )}
    </div>
  );
};

const meta = {
  title: 'Icons/Gallery',
  component: IconGallery,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'range', min: 16, max: 96, step: 4 } },
    color: { control: { type: 'color' } },
  },
} satisfies Meta<typeof IconGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  args: {
    size: 32,
    color: '#111827',
  },
};