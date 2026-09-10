import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState, useMemo, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { colors } from '../theme/colors';

// src/icons/ klasöründeki tüm icon'ları otomatik import et
const iconModules = import.meta.glob('../icons/web/*.tsx', { eager: true });

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

// ============ TATİLBUDUR MARKA RENKLERİ ============
const ACCENT = colors.primary.default; // '#004CAA'
const ACCENT_HOVER = colors.primary.hover; // '#99C7FF'
const ACCENT_SOFT = colors.primary.pressedBg; // '#CCE3FF' — açık mavi zemin
const NEUTRAL_BORDER = '#E5E7EB';
const NEUTRAL_TEXT = '#111827';
const NEUTRAL_MUTED = '#6B7280';

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
  const [hover, setHover] = useState(false);
  const active = isSelected || hover;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '20px 12px',
        border: `1.5px solid ${isSelected ? ACCENT : active ? ACCENT_HOVER : NEUTRAL_BORDER}`,
        borderRadius: 16,
        background: isSelected ? ACCENT_SOFT : '#FFFFFF',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease',
        transform: active ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isSelected
          ? `0 8px 20px ${ACCENT}26`
          : active
          ? '0 8px 20px rgba(17, 24, 39, 0.08)'
          : '0 1px 2px rgba(17, 24, 39, 0.04)',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isSelected ? '#FFFFFF' : active ? ACCENT_SOFT : '#F9FAFB',
          transition: 'background 0.15s ease',
        }}
      >
        <Component width={size} height={size} color={isSelected ? ACCENT : color} />
      </div>
      <span
        style={{
          fontSize: 12.5,
          color: isSelected ? ACCENT : NEUTRAL_MUTED,
          fontWeight: isSelected ? 600 : 500,
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
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
        border: `1px solid ${copied ? ACCENT : NEUTRAL_BORDER}`,
        borderRadius: 8,
        background: copied ? ACCENT : '#FFFFFF',
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
  const [detailColor, setDetailColor] = useState(NEUTRAL_TEXT);
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

  const sectionLabelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  };

  const codeBlockStyle: React.CSSProperties = {
    margin: 0,
    padding: 12,
    background: '#0F172A',
    color: '#E2E8F0',
    fontSize: 11,
    borderRadius: 10,
    overflow: 'auto',
    fontFamily: '"JetBrains Mono", "SF Mono", Menlo, monospace',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.25)',
          zIndex: 9998,
          animation: 'tb-fadeIn 0.15s ease',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'clamp(380px, 30vw, 480px)',
          maxWidth: '100vw',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderLeft: `1px solid ${NEUTRAL_BORDER}`,
          boxShadow: '-16px 0 40px rgba(15, 23, 42, 0.14)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'tb-slideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px',
            borderBottom: `1px solid ${NEUTRAL_BORDER}`,
          }}
        >
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: NEUTRAL_TEXT, letterSpacing: -0.2 }}>
              {name}
            </div>
            <div style={{ fontSize: 12, color: NEUTRAL_MUTED, marginTop: 2 }}>
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
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 18,
              color: NEUTRAL_MUTED,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#E5E7EB')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#F3F4F6')}
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
              borderRadius: 16,
              border: `1px solid ${NEUTRAL_BORDER}`,
              marginBottom: 20,
              minHeight: 180,
            }}
          >
            <Component width={detailSize} height={detailSize} color={detailColor} />
          </div>

          {/* Controls card */}
          <div
            style={{
              background: '#F9FAFB',
              border: `1px solid ${NEUTRAL_BORDER}`,
              borderRadius: 14,
              padding: 16,
              marginBottom: 20,
            }}
          >
            {/* Size Control */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={sectionLabelStyle}>Boyut</label>
                <span
                  style={{
                    fontSize: 12,
                    color: ACCENT,
                    fontWeight: 600,
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
                style={{ width: '100%', accentColor: ACCENT }}
              />
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {[16, 24, 32, 48, 64, 96].map((s) => (
                  <button
                    key={s}
                    onClick={() => setDetailSize(s)}
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      fontSize: 11,
                      fontWeight: 500,
                      border: `1px solid ${detailSize === s ? ACCENT : NEUTRAL_BORDER}`,
                      background: detailSize === s ? ACCENT_SOFT : '#FFFFFF',
                      color: detailSize === s ? ACCENT : NEUTRAL_MUTED,
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontFamily: '"JetBrains Mono", monospace',
                      transition: 'all 0.15s',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Control */}
            <div>
              <label style={{ ...sectionLabelStyle, display: 'block', marginBottom: 8 }}>
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
                    border: `1px solid ${NEUTRAL_BORDER}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: 'none',
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
                    border: `1px solid ${NEUTRAL_BORDER}`,
                    borderRadius: 8,
                    fontFamily: '"JetBrains Mono", monospace',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {[NEUTRAL_TEXT, ACCENT, colors.secondary.default, '#10B981', '#EF4444', '#FFFFFF'].map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => setDetailColor(c)}
                      style={{
                        flex: 1,
                        height: 28,
                        background: c,
                        border: `2px solid ${
                          detailColor.toLowerCase() === c.toLowerCase() ? ACCENT : NEUTRAL_BORDER
                        }`,
                        borderRadius: 6,
                        cursor: 'pointer',
                        transition: 'border-color 0.15s',
                      }}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Import Snippet */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={sectionLabelStyle}>Import</label>
              <CopyButton text={importSnippet} label="Kopyala" />
            </div>
            <pre style={codeBlockStyle}>{importSnippet}</pre>
          </div>

          {/* Usage Snippet */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={sectionLabelStyle}>Kullanım</label>
              <CopyButton text={usageSnippet} label="Kopyala" />
            </div>
            <pre style={codeBlockStyle}>{usageSnippet}</pre>
          </div>

          {/* SVG Code */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={sectionLabelStyle}>SVG Kodu</label>
              <CopyButton text={svgString} label="Kopyala" />
            </div>
            <pre style={{ ...codeBlockStyle, maxHeight: 160, lineHeight: 1.5 }}>{svgString}</pre>
          </div>

          {/* Download Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleDownloadSvg}
              style={{
                flex: 1,
                padding: '11px 16px',
                fontSize: 13,
                fontWeight: 600,
                border: `1px solid ${NEUTRAL_BORDER}`,
                background: '#FFFFFF',
                color: '#374151',
                borderRadius: 10,
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
                padding: '11px 16px',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                background: ACCENT,
                color: '#FFFFFF',
                borderRadius: 10,
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
        @keyframes tb-slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes tb-fadeIn {
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

  // A-Z bölümleme: 288 icon'u tarayan bir kullanıcı için tek düz grid yerine
  // alfabetik, sticky başlıklı bölümler (Finder/kişiler listesi mantığı).
  const groupedIcons = useMemo(() => {
    const groups = new Map<string, IconType[]>();
    for (const icon of filteredIcons) {
      const letter = /[A-Za-z]/.test(icon.name[0] ?? '') ? icon.name[0].toUpperCase() : '#';
      if (!groups.has(letter)) groups.set(letter, []);
      groups.get(letter)!.push(icon);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredIcons]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#FAFBFC' }}>
      <style>{`
        html, body, #storybook-root { height: 100% !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; }
        .tb-icon-search::placeholder { color: #9CA3AF; }
      `}</style>

      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${NEUTRAL_BORDER}`,
          padding: '18px 32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: NEUTRAL_TEXT, letterSpacing: -0.3 }}>
              TatilBudur Icons
            </div>
            <div style={{ fontSize: 13, color: NEUTRAL_MUTED, marginTop: 2 }}>
              Design system'in tüm SVG ikonları — tıklayarak boyut/renk ayarlayın, kopyalayın veya indirin.
            </div>
          </div>
          <div
            style={{
              fontSize: 13,
              whiteSpace: 'nowrap',
              background: ACCENT_SOFT,
              color: ACCENT,
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: 999,
            }}
          >
            {filteredIcons.length}
            {filteredIcons.length !== allIcons.length && <span style={{ fontWeight: 400 }}> / {allIcons.length}</span>}{' '}
            icon
          </div>
        </div>

        <div style={{ position: 'relative', maxWidth: 480, marginTop: 12 }}>
          <input
            className="tb-icon-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Icon ara... (örn: plane, calendar, user)"
            style={{
              width: '100%',
              padding: '11px 14px 11px 40px',
              fontSize: 14,
              border: `1.5px solid ${NEUTRAL_BORDER}`,
              borderRadius: 10,
              outline: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              background: '#FFFFFF',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = ACCENT;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${ACCENT}1F`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = NEUTRAL_BORDER;
              e.currentTarget.style.boxShadow = 'none';
            }}
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
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px 32px' }}>
        {filteredIcons.length === 0 ? (
          <div
            style={{
              minHeight: '60vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px 24px',
              textAlign: 'center',
              color: '#9CA3AF',
            }}
          >
            <div style={{ fontSize: 15, marginBottom: 4 }}>
              "<strong style={{ color: NEUTRAL_TEXT }}>{search}</strong>" için sonuç bulunamadı
            </div>
            <div style={{ fontSize: 13 }}>Farklı bir terim deneyin</div>
          </div>
        ) : (
          groupedIcons.map(([letter, icons]) => (
            <div key={letter}>
              <div
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  background: 'rgba(250, 251, 252, 0.94)',
                  backdropFilter: 'blur(6px)',
                  padding: '14px 0 8px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: ACCENT,
                  letterSpacing: 0.5,
                }}
              >
                {letter}
                <span style={{ color: NEUTRAL_MUTED, fontWeight: 400, marginLeft: 8 }}>{icons.length}</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: 16,
                  paddingBottom: 24,
                }}
              >
                {icons.map((icon) => (
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
            </div>
          ))
        )}

        {selectedIcon && <DetailPanel icon={selectedIcon} onClose={() => setSelectedIcon(null)} />}
      </div>
    </div>
  );
};

const meta = {
  title: 'Icons/Gallery',
  component: IconGallery,
  parameters: {
    layout: 'fullscreen',
    html: {
      root: '#storybook-root',
      selector: '#storybook-root',
    },
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
