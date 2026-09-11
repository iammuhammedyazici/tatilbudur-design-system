import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState, useMemo } from 'react';
import * as icons from '../icons/web';
import { IconDetailPanel } from './IconDetailPanel';
import { colors } from '../theme/colors';

type IconType = {
  name: string;
  Component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

// Galeri ve kullanım örnekleri paketin gerçek named export'larını kullanır.
const allIcons: IconType[] = Object.entries(icons)
  .map(([name, Component]) => ({ name, Component }))
  .sort((a, b) => a.name.localeCompare(b.name));

// ============ TATİLBUDUR MARKA RENKLERİ ============
const ACCENT = colors.primary.default; // '#004CAA'
const ACCENT_HOVER = colors.primary.hover; // '#99C7FF'
const ACCENT_SOFT = colors.primary.pressedBg; // '#CCE3FF' — açık mavi zemin
const NEUTRAL_BORDER = '#E5E7EB';
const NEUTRAL_TEXT = '#111827';
const NEUTRAL_MUTED = '#6B7280';
const isClubBenefit = (name: string) => /^TbClub[123]$/.test(name);

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
  const clubBenefit = isClubBenefit(name);

  return (
    <button
      type="button"
      aria-label={`${name} ikonunu incele`}
      aria-haspopup="dialog"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: 'inherit',
        width: '100%',
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
          width: clubBenefit ? 112 : 56,
          height: clubBenefit ? 64 : 56,
          borderRadius: clubBenefit ? 8 : '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: clubBenefit ? ACCENT : isSelected ? '#FFFFFF' : active ? ACCENT_SOFT : '#F9FAFB',
          transition: 'background 0.15s ease',
        }}
      >
        <Component
          width={clubBenefit ? size * 74 / 32 : size}
          height={clubBenefit ? size * 42 / 32 : size}
          style={clubBenefit ? { maxWidth: '100%', maxHeight: '100%' } : undefined}
          color={isSelected ? ACCENT : color}
        />
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
    </button>
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

        {selectedIcon && <IconDetailPanel key={selectedIcon.name} icon={selectedIcon} onClose={() => setSelectedIcon(null)} />}
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
