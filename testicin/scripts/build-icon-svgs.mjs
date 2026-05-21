/**
 * build-icon-svgs.mjs
 *
 * features.js içindeki React Native SVG ikonlarını:
 *  1. Parse eder (tüm if(iconName==) bloklarını)
 *  2. Duplicate'leri temizler (canonical isim üzerinden, ilk occurrence kazanır)
 *  3. JSX → Standart SVG'ye çevirir
 *  4. Tüm renkleri currentColor ile değiştirir
 *  5. LinearGradient / embedded Image içerenleri "multi-color" olarak işaretler (yine de export eder ama mapper'da belirtir)
 *  6. SVG dosyalarını testicin/svg/ klasörüne yazar
 *  7. icons-mapper.json dosyasını yazar
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEATURES_PATH = path.join(__dirname, '..', 'features.js');
const OUTPUT_SVG_DIR = path.join(__dirname, '..', '../src/svg');
const OUTPUT_MAPPER_PATH = path.join(__dirname, '..', 'icons-mapper.json');

// ============================================================
// NAME MAP — Eski isim → Yeni standart isim
// ============================================================
const NAME_MAP = {
  // Tab Navigation
  'search-tab-menu': 'tab-search',
  'reservations-tab-menu': 'tab-bookings',
  'home-tab-menu': 'tab-home',
  'categories-tab-menu': 'tab-categories',
  'profile-tab-menu': 'tab-profile',

  // Hotel Features – Beach & Water
  'yakinimdaki-oteller': 'nearby-hotels',
  'aquapark': 'aquapark',
  'denize-sifir': 'beachfront',
  'ozel-plaj': 'private-beach',
  'mavi-bayrakli': 'blue-flag-beach',
  'mavi-bayrakli-plaj': 'blue-flag-beach',
  'kumlu-plaj': 'sandy-beach',
  'kum-plaj': 'sandy-beach',
  'kum-cakil-plaj': 'sand-pebble-beach',
  'cakilli-plaj': 'pebble-beach',
  'cakil-plaj': 'pebble-beach',
  'sig-deniz': 'shallow-water',
  'denizi-sig-otel': 'shallow-water',
  'denizi-kademeli-derinlesen-otel': 'gradual-seabed',
  'deniz-manzarali': 'sea-view',
  'su-kaydiragi': 'waterslide',

  // Hotel Features – Concept
  'balayi-konsepti': 'honeymoon',
  'balayi': 'honeymoon',
  'yetiskin-oteli': 'adult-only',
  'cocuk-dostu': 'family-friendly',
  'aile-oteli': 'family-hotel',
  '2-cocuk-ucretsiz': 'two-children-free',
  'spa-merkezi': 'spa',

  // Hotel Features – Policy
  'pet-friendly': 'pet-friendly',
  'evcil-hayvan-dostu': 'pet-friendly',
  'no-smoke': 'no-smoking',
  'sigara-icilmez': 'no-smoking',
  'guvenli-turizm-sertifikali': 'health-safety-certified',
  'guvenli-turizm-sertifikasi': 'health-safety-certified',
  'covid': 'health-measures',
  'covid-19-tedbirleri': 'health-measures',

  // Children free age variants
  '0-6-yas-ucretsiz': 'children-free',
  '0-5-yas-ucretsiz': 'children-free',
  '0-3-yas-ucretsiz': 'children-free',

  // Hotel Features – Accessibility
  'engelli-dostu-otel': 'accessibility',
  'tekerlekli-sandalyeye-uygun': 'wheelchair-accessible',
  'tekerlekli-sandalyaye-uygun': 'wheelchair-accessible',

  // Hotel Amenities
  'ucretsiz-a-la-carte-restoran': 'free-ala-carte',
  'ucretsiz-a-la-carte-restoranli': 'free-ala-carte',
  'a-la-carte-restoran': 'ala-carte',
  'havuz-ve-plaj': 'pool-and-beach',
  'tesis-aktiviteleri': 'activities',
  'facility': 'facility',
  'genel-ozellikler': 'facility',
  'konsept-ozellikleri': 'amenities',
  'concept': 'amenities',
  'checklist': 'amenities',

  // Room Features – Bathroom
  'dus': 'shower',
  'banyo': 'bathroom',
  'kuvet': 'bathtub',
  'jakuzi': 'jacuzzi',

  // Room Features – Spaces
  'balkon': 'balcony',
  'fransiz-balkon': 'french-balcony',
  'somine': 'fireplace',

  // Room Features – Appliances
  'klima': 'air-conditioning',
  'split-klima': 'air-conditioning',
  'merkezi-klima': 'central-ac',
  'vrv-klima': 'central-ac',
  'yari-merkezi-klima': 'central-ac',
  'lcd-plazma-tv': 'tv',
  'tv': 'tv',
  'minibar': 'minibar',
  'mini-bar': 'minibar',
  'sac-kurutma-makinasi': 'hair-dryer',

  // Room Features – Other
  'kasa': 'safe-box',
  'emanet-kasa': 'safe-box',
  'internet': 'internet',
  'wifi': 'wifi',
  'wireless': 'wifi',
  'cami': 'mosque',
  'metrekare': 'square-meters',
  'onemli-notlar': 'note',
  'note': 'note',

  // Payment
  'ucretsiz-iptal': 'free-cancellation',
  'ucretsiz-transfer': 'free-transfer',
  'shuttle-servis': 'free-transfer',
  'kartsiz-odeme': 'no-card-payment',
  'kartsiz-rezervasyon': 'no-card-payment',
  'checkout-nopay': 'no-card-payment',
  'kredi-karti': 'credit-card',
  'credit-card': 'credit-card',
  'kaporali-odeme': 'deposit-payment',
  'kismi-odeme': 'deposit-payment',
  '4te1': 'quarter-payment',
  'pay-quarter': 'quarter-payment',
  '4te1-pay': 'quarter-payment',
  'best-price': 'best-price',
  'best-price-new': 'best-price-new',
  'best-price-new-premium': 'best-price-premium',

  // Travel & Tours
  'bus': 'bus',
  'world': 'globe',
  'gemi-turu': 'cruise',
  'gemi-turlari': 'cruise',
  'around-world': 'international-tours',
  'yurtdisi-turlar': 'international-tours',
  'building': 'building',
  'yurtici-oteller': 'building',
  'kultur-turlari': 'culture-tours',
  'cyprus': 'cyprus',
  'kibris-turlari': 'cyprus',
  'tour-program': 'tour-itinerary',
  'tur-programi': 'tour-itinerary',
  'visa-program': 'visa',
  'tour-condition': 'tour-conditions',
  'tour-hotels': 'tour-hotels',
  'otobus-ile-ulasim': 'transport',
  'ucak-ile-ulasim': 'transport',
  'kesin-kalkis': 'guaranteed-departure',
  'plane': 'plane',
  'plane-icon': 'plane',
  'upgrade': 'upgrade',
  'flight': 'flight',
  'flight-package': 'flight-package',
  'dynamic-package': 'flight-package',
  'fly-room': 'fly-room',
  'flight-and-transfer': 'flight-transfer',
  'car': 'car',
  'round-trip': 'round-trip',
  'dart': 'best-deal',
  'en-uygun-oda': 'best-deal',
  'campaign-percentage': 'percentage',
  'campaign-arrow-down': 'campaign-arrow-down',
  'campaign-arrow-right': 'campaign-arrow-right',

  // UI Navigation
  'chevron-right': 'chevron-right',
  'angle-down': 'chevron-down',
  'arrow-down': 'chevron-down',
  'angle-up': 'chevron-up',
  'arrow-up': 'chevron-up',
  'arrow-right': 'arrow-right',
  'arrow-left': 'arrow-left',
  'vector-right': 'vector-right',

  // UI Actions
  'close-circle': 'close-circle',
  'close-modal': 'close',
  'edit': 'edit',
  'pen': 'edit',
  'duzenle': 'edit',
  'delete': 'trash',
  'remove': 'trash',
  'sil': 'trash',
  'copy': 'copy',
  'check': 'check',
  'plus-filled': 'plus-filled',
  'plus-empty': 'plus-outline',
  'eye': 'eye',
  'share': 'share',
  'heart': 'heart',
  'heart-filled': 'heart-filled',
  'favorites-heart': 'favorites',

  // UI Status & Feedback
  'warning-icon': 'warning',
  'success-icon': 'success',
  'error-icon': 'error',
  'info': 'info',
  'information': 'info',
  'information-orange': 'info-orange',
  'shield': 'shield',
  'secure': 'shield',
  'safety': 'shield',
  'badge': 'badge',

  // UI Components
  'calender': 'calendar',
  'calendar': 'calendar',
  'calendar-white': 'calendar',
  'reservation-calender': 'reservation-calendar',
  'star': 'star',
  'stars': 'star',
  'bell': 'bell',
  'bell-2': 'bell-dot',
  'timer': 'timer',
  'fill-timer': 'timer-fill',
  'credit-timer': 'credit-timer',
  'clock': 'clock',
  'lock': 'lock',
  'comment': 'comment',
  'file-upload': 'upload',
  'frame': 'frame',
  'pin-filled': 'pin',

  // Location
  'marker': 'marker',
  'map-marker': 'map-marker',
  'map-icon': 'map',
  'map-trip': 'map-trip',

  // Contact & Person
  'telefon': 'phone',
  'phone': 'phone',
  'call-center': 'call-center',
  'person': 'person',
  'passenger': 'passenger',
  'corporate': 'corporate',

  // Account
  'settings': 'settings',
  'logout': 'logout',
  'authorise': 'authorize',
  'about-us': 'tb-about-us',
  'sale-office': 'sale-office',

  // Accommodation Specific
  'otel-icon': 'hotel',
  'bed': 'bed',
  'tb-building': 'building-tb',
  'tb-baggage': 'baggage',
  'tb-cable-car': 'cable-car',
  'tb-airport': 'airport',

  // Brand / Club
  'tb-club-1': 'tb-club-1',
  'tb-club-2': 'tb-club-2',
  'tb-club-3': 'tb-club-3',
  'tb-club-menu': 'tb-club-menu',
  'tbicon': 'logo',
  'logo': 'logo',
  'tbicon-premium': 'logo-premium',
  'tb-star-01': 'tb-star',
  'tb-short-logo': 'logo-short',

  // Premium
  'premium-danisman': 'premium-advisor',
  'premium-whatsapp': 'premium-whatsapp',
  'premium-transfer': 'premium-transfer',
  'premium': 'premium',
  'sharePremium': 'share-premium',

  // Misc
  'room-detail-campaign': 'room-campaign',
};

// ============================================================
// VIEWBOX OVERRIDE — Otomatik hesaplanamayan ikonlar için manuel viewBox
// ============================================================
const VIEWBOX_OVERRIDE = {
  'cyprus': '0 0 35.185 24',
};

// ============================================================
// PRESERVE COLOR — Bu canonical isimler için renk dönüşümü yapılmaz
// Marka/çok renkli ikonlar: orijinal renkler korunur
// ============================================================
const PRESERVE_COLOR = new Set([
  'tb-club-1',
  'tb-club-2',
  'tb-club-3',
  'tb-club-menu',
  'tb-star',
  'logo-premium',
  'premium',
  'share-premium',
  'best-price',
  'logo',
  'tb-about-us',
]);

// Marka kutusu ikonlar — arka plan rect → currentColor, iç icon → beyaz kalır
const COLORED_BOX = new Set([
  'baggage',
  'building-tb',
  'cable-car',
  'airport',
]);

// ============================================================
// PARSER — features.js'den icon bloklarını çıkart
// ============================================================
function parseIconBlocks(content) {
  const blocks = [];
  let pos = 0;

  while (pos < content.length) {
    // "iconName ==" veya "iconName ==" pattern'ini ara
    const markerIdx = content.indexOf('iconName ==', pos);
    if (markerIdx === -1) break;

    // Bu iconName'in içinde bulunduğu if ifadesini bul
    // markerIdx'den geriye gidip "if (" veya "if\n(" ara
    let ifSearchStart = Math.max(0, markerIdx - 200);
    const before = content.substring(ifSearchStart, markerIdx);
    const lastIfIdx = before.lastIndexOf('if ');
    if (lastIfIdx === -1) {
      pos = markerIdx + 11;
      continue;
    }
    const ifAbsoluteIdx = ifSearchStart + lastIfIdx;

    // if'in ( parantezini bul
    const parenOpenIdx = content.indexOf('(', ifAbsoluteIdx);
    if (parenOpenIdx === -1) {
      pos = markerIdx + 11;
      continue;
    }

    // Parantezi kapat (nested parantezleri say)
    let parenDepth = 0;
    let parenCloseIdx = parenOpenIdx;
    while (parenCloseIdx < content.length) {
      const ch = content[parenCloseIdx];
      if (ch === '(') parenDepth++;
      else if (ch === ')') {
        parenDepth--;
        if (parenDepth === 0) break;
      }
      parenCloseIdx++;
    }

    const condition = content.substring(parenOpenIdx, parenCloseIdx + 1);

    // Bu condition'da iconName == var mı? (başka if ifadeleri için yanlış yakalamayı önle)
    if (!condition.includes('iconName')) {
      pos = markerIdx + 11;
      continue;
    }

    // Tüm icon isimlerini çıkart
    const names = [];
    const nameRegex = /iconName\s*==\s*["']([^"']+)["']/g;
    let m;
    while ((m = nameRegex.exec(condition)) !== null) {
      names.push(m[1]);
    }
    if (names.length === 0) {
      pos = markerIdx + 11;
      continue;
    }

    // Condition'dan sonraki { bloğunu bul
    const blockOpenIdx = content.indexOf('{', parenCloseIdx + 1);
    if (blockOpenIdx === -1) {
      pos = markerIdx + 11;
      continue;
    }

    // Bloğu kapat
    let blockDepth = 0;
    let blockCloseIdx = blockOpenIdx;
    while (blockCloseIdx < content.length) {
      const ch = content[blockCloseIdx];
      if (ch === '{') blockDepth++;
      else if (ch === '}') {
        blockDepth--;
        if (blockDepth === 0) break;
      }
      blockCloseIdx++;
    }

    const blockContent = content.substring(blockOpenIdx, blockCloseIdx + 1);
    const lineNum = content.substring(0, ifAbsoluteIdx).split('\n').length;

    blocks.push({ names, content: blockContent, line: lineNum });
    pos = blockCloseIdx + 1;
  }

  return blocks;
}

// ============================================================
// SVG EXTRACT — JSX bloğundan <Svg>...</Svg> kısmını al
// ============================================================
function extractSvgJsx(blockContent) {
  // <Svg ile başlayan ve </Svg> ile biten kısmı bul
  const start = blockContent.search(/<Svg[\s\n>]/);
  if (start === -1) return null;

  const endTag = '</Svg>';
  let endIdx = blockContent.lastIndexOf(endTag);
  if (endIdx === -1) {
    // Self-closing Svg? (nadiren olur)
    const scIdx = blockContent.indexOf('/>', start);
    if (scIdx !== -1) return blockContent.substring(start, scIdx + 2);
    return null;
  }

  return blockContent.substring(start, endIdx + endTag.length);
}

// ============================================================
// MULTI-COLOR DETECTOR
// Gerçek bozuk SVG üretecek olanlar: embedded bitmap Image
// LinearGradient olanlar currentColor ile de çalışır (tek ton gradient)
// ============================================================
function detectMultiColor(svgJsx) {
  const reasons = [];

  // Embedded bitmap image (base64 veya URI)
  if (/<Image\b/.test(svgJsx) || /<image\b/.test(svgJsx)) {
    reasons.push('embedded-image');
  }

  // Pattern + Use (genellikle bitmap)
  if (/<Pattern\b/.test(svgJsx) && /<Use\b/.test(svgJsx)) {
    reasons.push('pattern-with-use');
  }

  return reasons;
}

// ============================================================
// JSX → SVG CONVERTER
// ============================================================
function convertJsxToSvg(jsx, canonicalName = '') {
  let s = jsx;
  const preserveColor = PRESERVE_COLOR.has(canonicalName);
  const coloredBox = COLORED_BOX.has(canonicalName);

  // 1) JSX yorum satırlarını temizle
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  // Satır yorumlarını temizle ama xmlns="http://..." gibi URL'lere dokunma
  // JSX'te // yorumları ya tek başına bir satırda, ya da JSX prop değerlerinin sonunda gelir
  // xmlns gibi string değerler içindeki // güvendedir çünkü onlar " içinde
  // Sadece boşluk + // + metin şeklindeki satırları kaldır
  s = s.replace(/^\s*\/\/[^\n]*$/gm, '');

  // 2) style={{ clipPath: "url(#x)" }} → clip-path="url(#x)"
  s = s.replace(/style=\{\{\s*clipPath:\s*["']([^"']+)["']\s*\}\}/g, 'clip-path="$1"');

  // 3) style={{ fill: color..., stroke: color... }} → fill="currentColor" stroke="currentColor"
  s = s.replace(/style=\{[^}]*fill:[^,}]*(,\s*stroke:[^}]*)?\s*\}\}/g, (match) => {
    let result = 'fill="currentColor"';
    if (/stroke:/.test(match)) result += ' stroke="currentColor"';
    return result;
  });
  // Remaining style blocks → remove
  s = s.replace(/\s+style=\{\{[\s\S]*?\}\}/g, '');

  // 4) fill/stroke color prop expressions → currentColor
  // fill={color} fill={color ?? "#xxx"} fill={color != undefined ? color : "#xxx"}
  if (!preserveColor) {
    s = s.replace(/fill=\{color\b[^}]*\}/g, 'fill="currentColor"');
    s = s.replace(/stroke=\{color\b[^}]*\}/g, 'stroke="currentColor"');
  } else {
    // Sadece color prop ifadelerini default renge çevir
    s = s.replace(/fill=\{color\s*!=\s*undefined\s*\?\s*color\s*:\s*"(#[^"]+)"\}/g, 'fill="$1"');
    s = s.replace(/fill=\{color\s*\?\?\s*"(#[^"]+)"\}/g, 'fill="$1"');
    s = s.replace(/stroke=\{color\s*!=\s*undefined\s*\?\s*color\s*:\s*"(#[^"]+)"\}/g, 'stroke="$1"');
    s = s.replace(/stroke=\{color\s*\?\?\s*"(#[^"]+)"\}/g, 'stroke="$1"');
    // fill={color} alone (no fallback) → currentColor (renk bilgisi yok)
    s = s.replace(/fill=\{color\}/g, 'fill="currentColor"');
    s = s.replace(/stroke=\{color\}/g, 'stroke="currentColor"');
  }

  // 5) Hardcoded hex/named fill colors → currentColor (mask içi hariç)
  // <mask> içindeki beyaz fill'ler maskenin şeklini tanımlar, currentColor yapma
  // Mask bloklarını geçici olarak koruyarak işle
  const maskPlaceholders = [];
  s = s.replace(/<[Mm]ask\b[\s\S]*?<\/[Mm]ask>/g, (maskBlock) => {
    const idx = maskPlaceholders.length;
    maskPlaceholders.push(maskBlock);
    return `__MASK_PLACEHOLDER_${idx}__`;
  });

  if (!preserveColor && !coloredBox) {
    s = s.replace(/fill="#[a-fA-F0-9]{3,8}"/g, 'fill="currentColor"');
    s = s.replace(/fill="white"/gi, 'fill="currentColor"');
    s = s.replace(/fill="black"/gi, 'fill="currentColor"');

    // 6) Hardcoded hex/named stroke colors → currentColor
    s = s.replace(/stroke="#[a-fA-F0-9]{3,8}"/g, 'stroke="currentColor"');
    s = s.replace(/stroke="white"/gi, 'stroke="currentColor"');
    s = s.replace(/stroke="black"/gi, 'stroke="currentColor"');
  } else if (coloredBox) {
    // Arka plan rect (ilk rect) fill → currentColor, diğer fills koru
    // JSX'te henüz PascalCase (Rect) olabilir, her ikisini de yakala
    s = s.replace(/(<[Rr]ect\b[^>]*?)fill=\{[^}]+\}/, '$1fill="currentColor"');
    s = s.replace(/(<[Rr]ect\b[^>]*?)fill="#[a-fA-F0-9]{3,8}"/, '$1fill="currentColor"');
  }

  // Mask bloklarını geri koy (değiştirilmeden)
  maskPlaceholders.forEach((block, idx) => {
    s = s.replace(`__MASK_PLACEHOLDER_${idx}__`, block);
  });

  // 7) stopColor
  if (!preserveColor && !coloredBox) {
    s = s.replace(/stopColor="(#[a-fA-F0-9]{3,8})"/g, 'stop-color="currentColor"');
    s = s.replace(/stopColor=\{[^}]+\}/g, 'stop-color="currentColor"');
  } else {
    s = s.replace(/stopColor="(#[a-fA-F0-9]{3,8})"/g, 'stop-color="$1"');
    s = s.replace(/stopColor=\{[^}]+\}/g, '');
  }

  // 8) Dimension expressions → viewBox yoksa width/height'tan türet, sonra sil
  // Önce JSX expression'lardan default değerleri çıkar
  let derivedW = null, derivedH = null;
  const wMatch = s.match(/\bwidth=\{(?:width\s*(?:!=\s*undefined\s*\?\s*width\s*:|\?\?)\s*)(\d+(?:\.\d+)?)\}/);
  const hMatch = s.match(/\bheight=\{(?:height\s*(?:!=\s*undefined\s*\?\s*height\s*:|\?\?)\s*)(\d+(?:\.\d+)?)\}/);
  if (wMatch) derivedW = wMatch[1];
  if (hMatch) derivedH = hMatch[1];
  // Sabit sayısal width/height expression'larını da yakala: width={14.405}
  if (!derivedW) { const m = s.match(/(?:<Svg|<svg)[^>]*?\bwidth=\{(\d+(?:\.\d+)?)\}/); if (m) derivedW = m[1]; }
  if (!derivedH) { const m = s.match(/(?:<Svg|<svg)[^>]*?\bheight=\{(\d+(?:\.\d+)?)\}/); if (m) derivedH = m[1]; }

  // JSX width/height expression'larını kaldır
  s = s.replace(/\s+width=\{[^}]*\}/g, (m, offset) => {
    // rect/use/image/pattern inline elementlerde sayısal width'i koru
    const before = s.substring(Math.max(0, offset - 20), offset);
    if (/(?:rect|use|image|pattern)/i.test(before)) return m.replace(/\{(\d+(?:\.\d+)?)\}/, '"$1"');
    return '';
  });
  s = s.replace(/\s+height=\{[^}]*\}/g, (m, offset) => {
    const before = s.substring(Math.max(0, offset - 20), offset);
    if (/(?:rect|use|image|pattern)/i.test(before)) return m.replace(/\{(\d+(?:\.\d+)?)\}/, '"$1"');
    return '';
  });

  // Diğer sayısal JSX boyut attribute'ları
  s = s.replace(/(\brx|\bry|\bcx|\bcy|\br\b|\bx\b|\by\b|\bx1|\by1|\bx2|\by2)=\{(\d+(?:\.\d+)?)\}/g, '$1="$2"');

  // 9) color prop expression on <Svg color={...}> → remove (it's a React prop)
  s = s.replace(/\s+color=\{[^}]+\}/g, '');
  s = s.replace(/\s+color="[^"]*"/g, '');

  // 10) Numeric JSX props: attr={number} → attr="number"
  s = s.replace(/(\w+)=\{(\d+(?:\.\d+)?)\}/g, '$1="$2"');

  // 11) String JSX props: attr={"string"} → attr="string"
  s = s.replace(/(\w+)=\{"([^"]*)"\}/g, '$1="$2"');

  // 12) Remove remaining JSX expressions (complex/unknown)
  s = s.replace(/\s+\w+=\{[^}]*\}/g, '');

  // 13) Attribute renames: camelCase → SVG hyphen-case
  s = s.replace(/\bfillRule=/g, 'fill-rule=');
  s = s.replace(/\bclipRule=/g, 'clip-rule=');
  s = s.replace(/\bclipPath=/g, 'clip-path=');
  s = s.replace(/\bstrokeWidth=/g, 'stroke-width=');
  s = s.replace(/\bstrokeLinecap=/g, 'stroke-linecap=');
  s = s.replace(/\bstrokeLinejoin=/g, 'stroke-linejoin=');
  s = s.replace(/\bstrokeMiterlimit=/g, 'stroke-miterlimit=');
  s = s.replace(/\bstrokeDasharray=/g, 'stroke-dasharray=');
  s = s.replace(/\bstrokeDashoffset=/g, 'stroke-dashoffset=');
  s = s.replace(/\bstrokeOpacity=/g, 'stroke-opacity=');
  s = s.replace(/\bfillOpacity=/g, 'fill-opacity=');
  s = s.replace(/\bstopOpacity=/g, 'stop-opacity=');
  s = s.replace(/\bxlinkHref=/g, 'href=');
  s = s.replace(/\bxlink:href=/g, 'href=');
  s = s.replace(/\bmaskUnits=/g, 'maskUnits=');       // stays camelCase in SVG spec
  s = s.replace(/\bgradientUnits=/g, 'gradientUnits='); // stays
  s = s.replace(/\bgradientTransform=/g, 'gradientTransform='); // stays
  s = s.replace(/\bpatternContentUnits=/g, 'patternContentUnits='); // stays

  // 14) Remove React/RN-specific attributes
  s = s.replace(/\s+data-name="[^"]*"/g, '');

  // 15) Element name conversion (JSX PascalCase → SVG lowercase)
  const elementMap = {
    '</Svg>': '</svg>',
    '<Svg': '<svg',
    '</Path>': '',             // self-closing paths don't need closing tag
    '<Path': '<path',
    '</G>': '</g>',
    '<G>': '<g>',
    '<G ': '<g ',
    '<G\n': '<g\n',
    '</Rect>': '',
    '<Rect': '<rect',
    '</Circle>': '',
    '<Circle': '<circle',
    '</Ellipse>': '',
    '<Ellipse': '<ellipse',
    '<Defs>': '<defs>',
    '<Defs ': '<defs ',
    '</Defs>': '</defs>',
    '<ClipPath': '<clipPath',
    '</ClipPath>': '</clipPath>',
    '<LinearGradient': '<linearGradient',
    '</LinearGradient>': '</linearGradient>',
    '<Stop': '<stop',
    '</Stop>': '',
    '<Mask': '<mask',
    '</Mask>': '</mask>',
    '<TSpan': '<tspan',
    '</TSpan>': '</tspan>',
    '<Pattern': '<pattern',
    '</Pattern>': '</pattern>',
    '<Use': '<use',
    '</Use>': '',
    '<Image': '<image',
    '</Image>': '</image>',
    '<Polygon': '<polygon',
    '</Polygon>': '',
    '<Polyline': '<polyline',
    '</Polyline>': '',
    '<Line': '<line',
    '</Line>': '',
    '<Text': '<text',
    '</Text>': '</text>',
  };

  for (const [from, to] of Object.entries(elementMap)) {
    s = s.replaceAll(from, to);
  }

  // 16) xmlns'i koru veya ekle
  if (!s.includes('xmlns=')) {
    s = s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // 16b) viewBox yoksa türetilen width/height'tan ekle
  if (!s.includes('viewBox=') && derivedW && derivedH) {
    s = s.replace('<svg', `<svg viewBox="0 0 ${derivedW} ${derivedH}"`);
  }

  // 16b2) viewBox hâlâ yoksa path d attribute'undaki max koordinatlardan tahmin et
  if (!s.includes('viewBox=')) {
    const allNums = [];
    const dMatch = s.match(/\bd="([^"]+)"/g);
    if (dMatch) {
      for (const dm of dMatch) {
        const nums = dm.match(/-?[\d]+\.?[\d]*/g);
        if (nums) allNums.push(...nums.map(Number).filter(n => !isNaN(n)));
      }
    }
    if (allNums.length > 0) {
      const maxVal = Math.ceil(Math.max(...allNums.filter(n => n > 0)));
      s = s.replace('<svg', `<svg viewBox="0 0 ${maxVal} ${maxVal}"`);
    }
  }

  // 16b3) Manuel viewBox override (VIEWBOX_OVERRIDE map)
  if (VIEWBOX_OVERRIDE[canonicalName]) {
    s = s.replace(/viewBox="[^"]*"/, `viewBox="${VIEWBOX_OVERRIDE[canonicalName]}"`);
    if (!s.includes('viewBox=')) {
      s = s.replace('<svg', `<svg viewBox="${VIEWBOX_OVERRIDE[canonicalName]}"`);
    }
  }

  // 16c) viewBox clipPath rect boyutlarından türet
  // <clipPath> içinde "M0 0hXvYH0z" patternı varsa, gerçek içerik boyutu budur
  // Ancak coloredBox ikonlarda viewBox zaten dönüşüm sonrası doğru set edildi, üstesine yazma
  if (!coloredBox) {
    const cpMatch = s.match(/<clipPath[^>]*>[\s\S]*?<path[^>]*d="M0 0h([\d.]+)v([\d.]+)/);
    if (cpMatch) {
      const cpW = cpMatch[1], cpH = cpMatch[2];
      if (s.includes('viewBox=')) {
        if (derivedW && s.includes(`viewBox="0 0 ${derivedW} ${derivedH}"`)) {
          s = s.replace(`viewBox="0 0 ${derivedW} ${derivedH}"`, `viewBox="0 0 ${cpW} ${cpH}"`);
        }
      } else {
        s = s.replace('<svg', `<svg viewBox="0 0 ${cpW} ${cpH}"`);
      }
    }
  }

  // 17) JSX self-closing /> → /> (zaten uyumlu, koruma)
  // SVG'de bazı elementler self-closing olabilir, react'ta /> kullanıyoruz, SVG de /> destekler

  // 18) Boş attribute değerlerini temizle
  s = s.replace(/\s+\w+=""\s*/g, ' ');

  // 19) <svg> tag'inden width ve height kaldır (boyut CSS'e bırakılır, viewBox yeterli)
  s = s.replace(/(<svg[^>]*?)\s+width="[^"]*"/g, '$1');
  s = s.replace(/(<svg[^>]*?)\s+height="[^"]*"/g, '$1');

  // 19b) <svg fill="currentColor"> → fill="none" : stroke-only ikonlarda fill kalkar
  // Orijinal JSX'te <Svg fill={color ?? "none"}> → dönüşüm sonrası fill="currentColor" olur,
  // ama ikon sadece stroke kullanıyorsa bu tüm yolları doldurur.
  // çözüm: SVG tagı fill="currentColor" && içerde path/rect fill attribute'u yoksa stroke-only demektir
  const svgFillMatch = s.match(/<svg\b[^>]*\bfill="currentColor"/);
  if (svgFillMatch) {
    // İçerideki elementlerde fill attribute var mı? (defs/clipPath hariç)
    const bodyWithoutDefs = s.replace(/<defs>[\s\S]*?<\/defs>/g, '');
    const hasFillInBody = /<(?:path|rect|circle|ellipse|polygon|g)\b[^>]*fill="(?!none|currentColor)[^"]+"/.test(bodyWithoutDefs)
      || /<(?:path|rect|circle|ellipse|polygon|g)\b[^>]*fill="currentColor"/.test(bodyWithoutDefs);
    if (!hasFillInBody) {
      s = s.replace(/(<svg\b[^>]*?)\bfill="currentColor"/, '$1fill="none"');
    }
  }

  // 20) Birden fazla boşluğu temizle (attribute aralarında)
  s = s.replace(/  +/g, ' ');

  // 20) Satır sonlarındaki gereksiz boşluklar
  s = s.replace(/ \n/g, '\n');

  return s.trim();
}

// ============================================================
// MAIN
// ============================================================
function main() {
  const content = fs.readFileSync(FEATURES_PATH, 'utf-8');
  console.log(`📂 features.js okundu: ${content.split('\n').length} satır`);

  const rawBlocks = parseIconBlocks(content);
  console.log(`🔍 ${rawBlocks.length} if(iconName==) bloğu bulundu`);

  // SVG klasörünü temizle ve yeniden oluştur
  if (fs.existsSync(OUTPUT_SVG_DIR)) {
    fs.rmSync(OUTPUT_SVG_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_SVG_DIR, { recursive: true });

  // Canonical isim → ilk occurrence takibi (deduplicate)
  const seenCanonical = new Set();

  // Sonuç toplama
  const exported = [];
  const multiColor = [];
  const skipped = [];
  // Alias map: tüm eski isimler → canonical yeni isim
  const nameMap = {};

  for (const block of rawBlocks) {
    // Tüm isimleri name map'e ekle
    for (const name of block.names) {
      const canonical = NAME_MAP[name] || name;
      nameMap[name] = canonical;
    }

    // Primary canonical name (ilk isim üzerinden)
    const primaryName = block.names[0];
    const canonicalName = NAME_MAP[primaryName] || primaryName;

    // Daha önce işlendi mi?
    if (seenCanonical.has(canonicalName)) {
      // Eğer önceki blokta viewBox yoktu ama bu blokta varsa, bunu tercih et
      const prevIdx = exported.findIndex(e => e.canonical === canonicalName) ??
                      multiColor.findIndex(e => e.canonical === canonicalName);
      const svgJsxNow = extractSvgJsx(block.content);
      if (svgJsxNow && svgJsxNow.includes('viewBox') && !svgJsxNow.includes('transform="translate')) {
        // Önceki entry'yi bul ve güncelle
        const prevEntry = [...exported, ...multiColor].find(e => e.canonical === canonicalName);
        if (prevEntry && !prevEntry._hasViewBox) {
          // Yeniden işle - bu blok daha temiz
          prevEntry._hasViewBox = true;
          const svgContent = convertJsxToSvg(svgJsxNow, canonicalName);
          const filepath = path.join(OUTPUT_SVG_DIR, prevEntry.file);
          fs.writeFileSync(filepath, svgContent, 'utf-8');
          prevEntry._hasViewBox = true;
        }
      }
      continue;
    }
    seenCanonical.add(canonicalName);

    // SVG JSX bloğunu çıkart
    const svgJsx = extractSvgJsx(block.content);
    if (!svgJsx) {
      skipped.push({
        canonical: canonicalName,
        originalNames: block.names,
        reason: 'no-svg-found',
        line: block.line,
      });
      continue;
    }

    // Multi-color kontrolü
    const mcReasons = detectMultiColor(svgJsx);
    const isMulti = mcReasons.length > 0;

    // JSX → SVG dönüşümü
    const svgContent = convertJsxToSvg(svgJsx, canonicalName);

    // SVG dosyasını yaz
    const filename = `${canonicalName}.svg`;
    const filepath = path.join(OUTPUT_SVG_DIR, filename);
    fs.writeFileSync(filepath, svgContent, 'utf-8');

    if (isMulti) {
      multiColor.push({
        canonical: canonicalName,
        originalNames: block.names,
        reasons: mcReasons,
        file: filename,
        note: 'currentColor ile export edildi ama orijinal multi-color idi',
      });
    } else {
      exported.push({
        canonical: canonicalName,
        originalNames: block.names,
        file: filename,
      });
    }
  }

  // Mapper JSON
  const mapper = {
    _meta: {
      generatedAt: new Date().toISOString(),
      totalIconBlocks: rawBlocks.length,
      uniqueCanonicalIcons: seenCanonical.size,
      singleColorExported: exported.length,
      multiColorExported: multiColor.length,
      skipped: skipped.length,
    },
    nameMap,
    singleColorIcons: exported,
    multiColorIcons: multiColor,
    skippedIcons: skipped,
  };

  fs.writeFileSync(OUTPUT_MAPPER_PATH, JSON.stringify(mapper, null, 2), 'utf-8');

  // Özet
  console.log('\n─────────────────────────────────────────');
  console.log(`✅  Tek renk SVG export:  ${exported.length} ikon`);
  console.log(`⚠️   Multi-color SVG:     ${multiColor.length} ikon (currentColor uygulandı)`);
  console.log(`⏭️   Atlanan:             ${skipped.length} ikon`);
  console.log(`📦  Toplam unique:        ${seenCanonical.size} ikon`);
  console.log(`📂  SVG klasörü:          ${OUTPUT_SVG_DIR}`);
  console.log(`📝  Mapper:               ${OUTPUT_MAPPER_PATH}`);
  console.log('─────────────────────────────────────────\n');

  if (multiColor.length > 0) {
    console.log('⚠️  Multi-color olanlar (currentColor ile export edildi):');
    multiColor.forEach(i => console.log(`   • ${i.canonical} [${i.reasons.join(', ')}]`));
    console.log('');
  }

  if (skipped.length > 0) {
    console.log('⏭️  Atlananlar:');
    skipped.forEach(i => console.log(`   • ${i.canonical} → ${i.reason} (satır ${i.line})`));
  }
}

main();
