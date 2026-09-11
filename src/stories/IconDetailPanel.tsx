import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CodeBlock } from './CodeBlock';
import {
  createIconPng,
  downloadIconBlob,
  getIconDimensions,
  getIconMetadata,
  getIconUsage,
  normalizeHex,
} from './iconDetails';
import './preview-workspace.css';
import './icon-detail.css';

type Icon = { name: string; Component: ComponentType<SVGProps<SVGSVGElement>> };

function DownloadMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path
        d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconDetailPanel({
  icon: { name, Component },
  onClose,
}: {
  icon: Icon;
  onClose: () => void;
}) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const metadata = useMemo(
    () => getIconMetadata(renderToStaticMarkup(<Component />)),
    [Component]
  );
  const [size, setSize] = useState(
    metadata.width === metadata.height ? 64 : 128
  );
  const [color, setColor] = useState('#004CAA');
  const [hexDraft, setHexDraft] = useState(color);
  const [surface, setSurface] = useState(
    metadata.whiteArtwork ? 'brand' : 'grid'
  );
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const { width, height } = getIconDimensions(metadata, size);
  const canChangeColor = metadata.colorMode !== 'fixed';
  const invalidHex = normalizeHex(hexDraft) === null;
  const svgString = useMemo(() => {
    const svg = renderToStaticMarkup(
      <Component
        width={width}
        height={height}
        color={canChangeColor ? color : undefined}
      />
    );
    return /<svg\b[^>]*\bxmlns=/.test(svg)
      ? svg
      : svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }, [Component, width, height, canChangeColor, color]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      trigger?.focus();
    };
  }, []);

  function chooseColor(next: string) {
    setColor(next);
    setHexDraft(next);
  }
  async function downloadPng() {
    setExporting(true);
    setExportError('');
    try {
      downloadIconBlob(
        `${name}.png`,
        await createIconPng(svgString, width, height)
      );
    } catch {
      setExportError(
        'PNG hazırlanamadı. Tekrar deneyebilir veya SVG olarak indirebilirsiniz.'
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="tb-icon-dialog"
      aria-labelledby={`${id}-title`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
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
          onClose();
      }}
    >
      <header className="tb-id-header">
        <div>
          <div className="tb-id-eyebrow">
            TATİLBUDUR <span>/</span> ICON LIBRARY
          </div>
          <h2 id={`${id}-title`}>{name}</h2>
        </div>
        <button
          type="button"
          className="tb-id-close"
          aria-label="İkon detayını kapat"
          onClick={onClose}
          autoFocus
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </header>
      <div className="tb-id-scroll">
        <div className="tb-id-preview" data-surface={surface}>
          <div className="tb-id-preview-top">
            <span>ÖNİZLEME</span>
            <span>
              {width} × {height} px
            </span>
          </div>
          <div className="tb-id-artwork">
            <Component
              width={width}
              height={height}
              color={canChangeColor ? color : undefined}
              aria-hidden="true"
            />
          </div>
          <div
            className="tb-id-surfaces"
            role="group"
            aria-label="Önizleme zemini"
          >
            {[
              ['grid', 'Şeffaf'],
              ['light', 'Açık'],
              ['dark', 'Koyu'],
              ['brand', 'Mavi'],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                aria-label={`${label} zemin`}
                aria-pressed={surface === value}
                data-swatch={value}
                onClick={() => setSurface(value)}
              />
            ))}
          </div>
        </div>
        <div className="tb-id-specs">
          <span>
            <i /> SVG vektör
          </span>
          <span>
            {metadata.width} × {metadata.height} viewBox
          </span>
          <span>
            {metadata.colorMode === 'fixed'
              ? 'Sabit renk'
              : metadata.colorMode === 'mixed'
              ? 'Kısmen renklendirilebilir'
              : 'Renklendirilebilir'}
          </span>
        </div>

        <section className="tb-id-settings" aria-label="İkon ayarları">
          <div className="tb-id-field-heading">
            <label htmlFor={`${id}-size`}>Boyut</label>
            <output htmlFor={`${id}-size`}>{size} px</output>
          </div>
          <input
            id={`${id}-size`}
            className="tb-id-range"
            type="range"
            min={16}
            max={256}
            step={1}
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
          />
          <div
            className="tb-id-presets"
            role="group"
            aria-label="Hazır boyutlar"
          >
            {[16, 24, 32, 48, 64, 128].map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={size === value}
                onClick={() => setSize(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <p className="tb-id-hint">
            Uzun kenar ölçüsü; ikonun en-boy oranı korunur.
          </p>
          {canChangeColor ? (
            <div className="tb-id-color-field">
              <div className="tb-id-field-heading">
                <label htmlFor={`${id}-hex`}>Renk</label>
                <span>HEX</span>
              </div>
              <div className="tb-id-color-inputs">
                <input
                  type="color"
                  value={color}
                  aria-label="İkon rengini seç"
                  onChange={(event) => chooseColor(event.target.value)}
                />
                <input
                  id={`${id}-hex`}
                  value={hexDraft}
                  spellCheck={false}
                  maxLength={7}
                  aria-invalid={invalidHex}
                  aria-describedby={invalidHex ? `${id}-hex-error` : undefined}
                  onChange={(event) => {
                    setHexDraft(event.target.value);
                    const normalized = normalizeHex(event.target.value);
                    if (normalized) setColor(normalized);
                  }}
                  onBlur={() => {
                    const normalized = normalizeHex(hexDraft);
                    if (normalized) setHexDraft(normalized);
                  }}
                />
                <span
                  className="tb-id-color-dot"
                  style={{ background: color }}
                />
              </div>
              {invalidHex && (
                <p id={`${id}-hex-error`} className="tb-id-error">
                  3 veya 6 haneli bir HEX renk girin.
                </p>
              )}
              <div
                className="tb-id-palette"
                role="group"
                aria-label="Hazır renkler"
              >
                {[
                  '#004CAA',
                  '#1C2B42',
                  '#86287E',
                  '#10B981',
                  '#D6243B',
                  '#FFFFFF',
                ].map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-label={`${value} rengini seç`}
                    aria-pressed={color.toUpperCase() === value}
                    onClick={() => chooseColor(value)}
                    style={{ background: value }}
                  />
                ))}
              </div>
              {metadata.colorMode === 'mixed' && (
                <p className="tb-id-hint">
                  Renk seçimi yalnızca değişken renkli alanları etkiler; sabit
                  renkler korunur.
                </p>
              )}
            </div>
          ) : (
            <div className="tb-id-fixed-note">
              <span>Orijinal renkler korunur</span>
              <p>
                Bu ikonun çizim renkleri sabittir; <code>color</code>{' '}
                özelliğiyle değişmez. Önizleme zeminini yukarıdan
                seçebilirsiniz.
              </p>
            </div>
          )}
        </section>

        <section className="tb-id-usage" aria-labelledby={`${id}-usage`}>
          <div className="tb-id-section-heading">
            <h3 id={`${id}-usage`}>Projende kullan</h3>
            <span>Seçimlerinle güncellenir</span>
          </div>
          <CodeBlock
            tabs={[
              {
                label: 'React',
                language: 'tsx',
                code: getIconUsage(
                  name,
                  'web',
                  width,
                  height,
                  canChangeColor ? color : undefined
                ),
              },
              {
                label: 'React Native',
                language: 'tsx',
                code: getIconUsage(
                  name,
                  'native',
                  width,
                  height,
                  canChangeColor ? color : undefined
                ),
              },
              { label: 'SVG', language: 'svg', code: svgString },
            ]}
          />
          <p className="tb-id-hint">
            React Native kullanımında <code>react-native-svg</code> kurulu
            olmalıdır.
          </p>
        </section>
        {exportError && (
          <p className="tb-id-error" role="alert">
            {exportError}
          </p>
        )}
      </div>
      <footer className="tb-id-footer">
        <div className="tb-id-downloads">
          <button
            type="button"
            onClick={() =>
              downloadIconBlob(
                `${name}.svg`,
                new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
              )
            }
          >
            <DownloadMark /> SVG indir <span>Vektör</span>
          </button>
          <button
            type="button"
            className="tb-id-primary"
            onClick={downloadPng}
            disabled={exporting}
          >
            <DownloadMark /> {exporting ? 'Hazırlanıyor…' : 'PNG indir'}{' '}
            <span>4×</span>
          </button>
        </div>
        <p>
          Zemin yalnızca önizleme içindir. Dosyalar şeffaf arka planla
          indirilir.
        </p>
      </footer>
    </dialog>
  );
}
