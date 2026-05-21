#!/usr/bin/env node
/**
 * Duplicate temizler + TR→EN naming önerileri üretir.
 *
 * Kullanım:
 *   node scripts/cleanup-and-translate.mjs
 *
 * Input:
 *   extracted/inventory.json
 *   extracted/svg/*.svg
 *
 * Output:
 *   cleaned/svg/*.svg                  ← duplicate'siz, unique iconlar
 *   cleaned/naming-review.md           ← gözden geçirme dokümanı
 *   cleaned/naming-map.json            ← TR→EN mapping (sonra edit edeceğiz)
 *   cleaned/legacy-mapper.json         ← eski-yeni alias mapping
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ INPUT ============
const inventoryPath = path.join(__dirname, '..', 'extracted', 'inventory.json');
const svgDir = path.join(__dirname, '..', 'extracted', 'svg');
const outDir = path.join(__dirname, '..', 'cleaned');
const outSvgDir = path.join(outDir, 'svg');

fs.mkdirSync(outSvgDir, { recursive: true });

const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));

// ============ TR → EN SÖZLÜK ============
// Yaygın TatilBudur terimleri için manuel sözlük.
// Eksik kalan kelimeler "REVIEW" olarak işaretlenecek, sen elle dolduracaksın.
const trToEn = {
  // Otel özellikleri
  'banyo': 'bathroom',
  'dus': 'shower',
  'kuvet': 'bathtub',
  'jakuzi': 'jacuzzi',
  'sauna': 'sauna',
  'spa': 'spa',
  'spa-merkezi': 'spa-center',
  'havuz': 'pool',
  'havuz-ve-plaj': 'pool-and-beach',
  'su-kaydiragi': 'water-slide',
  'aquapark': 'aquapark',
  'plaj': 'beach',
  'ozel-plaj': 'private-beach',
  'denize-sifir': 'beachfront',
  'deniz-manzarali': 'sea-view',
  'denizi-kademeli-derinlesen-otel': 'gradual-depth-sea',
  'kademeli-deniz': 'gradual-depth-sea',

  // Konaklama
  'balkon': 'balcony',
  'fransiz-balkon': 'french-balcony',
  'somine': 'fireplace',
  'klima': 'air-conditioning',
  'isitma': 'heating',
  'minibar': 'minibar',
  'kasa': 'safe-box',
  'televizyon': 'television',
  'tv': 'television',
  'telefon': 'phone',
  'internet': 'wifi',
  'wifi': 'wifi',
  'sac-kurutma-makinasi': 'hair-dryer',

  // Yemek / Restoran
  'restoran': 'restaurant',
  'a-la-carte-restoran': 'a-la-carte-restaurant',
  'kahvalti': 'breakfast',
  'aksam-yemegi': 'dinner',
  'ogle-yemegi': 'lunch',
  'her-sey-dahil': 'all-inclusive',

  // Aile / Çocuk
  'aile-oteli': 'family-hotel',
  'cocuk-dostu': 'kid-friendly',
  '2-cocuk-ucretsiz': 'two-kids-free',
  'yetiskin-oteli': 'adults-only',
  'evcil-hayvan-dostu': 'pet-friendly',
  'pet-friendly': 'pet-friendly',
  'balayi': 'honeymoon',
  'balayi-konsepti': 'honeymoon',

  // Yasak/Uyarı
  'sigara-icilmez': 'no-smoking',
  'no-smoke': 'no-smoking',

  // Din
  'cami': 'mosque',
  'namaz': 'prayer',

  // Aktivite
  'tesis-aktiviteleri': 'facility-activities',
  'fitness': 'fitness',
  'spor': 'sports',

  // Tur kategorileri
  'kultur-turlari': 'culture-tours',
  'gemi-turlari': 'cruise-tours',
  'yurtdisi-turlar': 'international-tours',
  'yurtici-turlar': 'domestic-tours',

  // Diğer
  'metrekare': 'square-meter',
  'ucretsiz-iptal': 'free-cancellation',
  'kesin-kalkis': 'guaranteed-departure',
  'guvenli-turizm-sertifikali': 'safe-tourism-certified',
  'guvenli-turizm-sertifikasi': 'safe-tourism-certified',
  'covid': 'covid',
  'visa-program': 'visa-program',
  'konsept-ozellikleri': 'concept-features',
  'tour-condition': 'tour-conditions',
  'tour-hotels': 'tour-hotels',
  'yakinimdaki-oteller': 'nearby-hotels',
  'otel': 'hotel',
  'otel-icon': 'hotel',
  'sale-office': 'sale-office',
  'about-us': 'about-us',
  'corporate': 'corporate',
  'authorise': 'authorise',
  'call-center': 'call-center',
  'discount-icon': 'discount',
  'campaign-percentage': 'discount-percentage',
  'campaign-arrow-down': 'campaign-arrow-down',
  'campaign-arrow-right': 'campaign-arrow-right',
  'fill-timer': 'timer-filled',
  'credit-timer': 'timer-credit',
  'reservation-calender': 'calendar-reservation',
  'reservations': 'bookmark',
  'reservations-tab-menu': 'bookmark',
  'favorites-heart': 'heart',
  'heart-filled': 'heart-filled',
  'heart': 'heart-outline',
  'pin-filled': 'pin',
  'plane-icon': 'plane',
  'flight': 'flight',
  'flight-and-transfer': 'flight-and-transfer',
  'fly-room': 'flight-room',
  'round-trip': 'round-trip',
  'passenger': 'passenger',
  'bed': 'bed',
  'car': 'car',
  'bus': 'bus',
  'world': 'globe',
  'plane': 'plane',

  // Tab menu — suffix'leri kaldır
  'search-tab-menu': 'search',
  'home-tab-menu': 'home-brand',
  'categories-tab-menu': 'grid',
  'profile-tab-menu': 'user',
  'tb-club-menu': 'tb-club',

  // UI elements
  'close-circle': 'close-circle',
  'close-button': 'close',
  'close-modal': 'close-modal',
  'angle-down': 'chevron-down',
  'chevron-right': 'chevron-right',
  'arrow-right': 'arrow-right',
  'arrow-left': 'arrow-left',
  'vector-right': 'arrow-right',
  'plus-filled': 'plus-filled',
  'plus-empty': 'plus',
  'show-more': 'chevron-down',
  'show-less': 'chevron-up',
  'edit': 'edit',
  'copy': 'copy',
  'check': 'check',
  'cancel': 'cancel',
  'eye': 'eye',
  'lock': 'lock',
  'heart-outline': 'heart-outline',
  'bell': 'bell',
  'bell-2': 'bell-active',
  'settings': 'settings',
  'logout': 'logout',
  'info': 'info',
  'information': 'info',
  'information-orange': 'info-warning',
  'comment': 'comment',
  'clock': 'clock',
  'timer': 'timer',
  'file-upload': 'file-upload',
  'badge': 'badge',
  'frame': 'frame',
  'phone': 'phone',
  'marker': 'pin',
  'map-marker': 'pin',
  'map-icon': 'map',
  'map-trip': 'map-trip',
  'pin-filled': 'pin-filled',
  'person': 'user',
  'profile': 'user',
  'share': 'share',
  'premium': 'premium',
  'sharepremium': 'share-premium',
  'upgrade': 'upgrade',

  // Status icons
  'warning-icon': 'warning',
  'success-icon': 'success',
  'error-icon': 'error',

  // Brand / TB özel
  'tbicon-premium': 'tb-premium',
  '4te1-pay': '4in1-pay',
  'best-price': 'best-price',
  'best-price-new': 'best-price-new',
  'best-price-new-premium': 'best-price-premium',
  'tb-short-logo': 'tb-logo-short',
  'tb-club-1': 'tb-club-tier-1',
  'tb-club-2': 'tb-club-tier-2',
  'tb-club-3': 'tb-club-tier-3',
  'tb-baggage': 'tb-baggage',
  'tb-building': 'tb-building',
  'tb-cable-car': 'tb-cable-car',
  'tb-airport': 'tb-airport',
  'tb-star-01': 'tb-star',
  'premium-danisman': 'premium-advisor',
  'premium-whatsapp': 'premium-whatsapp',
  'premium-transfer': 'premium-transfer',

  // Room detail
  'room-detail-campaign': 'room-campaign',
  'calendar-white': 'calendar',
  'calendar': 'calendar',
  'calender': 'calendar',

  // Search / categories
  'search': 'search',
  'categories': 'grid',
  'chevron-right': 'chevron-right',
};

// ============ NORMALIZE ============
function normalize(name) {
  // Sözlükte varsa direkt
  if (trToEn[name]) return trToEn[name];

  // -tab-menu suffix'i kaldır
  let n = name.replace(/-tab-menu$/, '');
  if (trToEn[n]) return trToEn[n];

  // -icon suffix'i kaldır
  n = n.replace(/-icon$/, '');
  if (trToEn[n]) return trToEn[n];

  // Bilinmiyor — orijinal döner, REVIEW işareti için ayrı tut
  return { unknown: true, original: name };
}

// ============ DEDUPLICATE + NAMING ============
const uniqueIcons = new Map(); // newName → { originalNames[], type, colors, svgPath }
const needsReview = [];

for (const item of inventory) {
  const result = normalize(item.originalName);

  if (typeof result === 'object' && result.unknown) {
    needsReview.push(item.originalName);
    // Yine de ekleyelim, "REVIEW_" prefix ile
    const reviewName = `REVIEW_${item.originalName}`;
    if (!uniqueIcons.has(reviewName)) {
      uniqueIcons.set(reviewName, {
        newName: reviewName,
        originalNames: [item.originalName],
        type: item.type,
        colors: item.colors,
      });
    }
    continue;
  }

  const newName = result;

  if (uniqueIcons.has(newName)) {
    // Duplicate — orijinal isimleri topla
    const existing = uniqueIcons.get(newName);
    if (!existing.originalNames.includes(item.originalName)) {
      existing.originalNames.push(item.originalName);
    }
  } else {
    uniqueIcons.set(newName, {
      newName,
      originalNames: [item.originalName],
      type: item.type,
      colors: item.colors,
    });
  }
}

// ============ COPY SVG FILES TO CLEANED DIR ============
let copiedCount = 0;
let missingCount = 0;
for (const [newName, info] of uniqueIcons) {
  // Orijinal SVG dosyalarından birini al (genelde ilk)
  const sourceName = info.originalNames[0];
  // Önceki script'te dosya adı normalize edilmişti, o yüzden hem orijinal hem normalize'i dene
  const candidates = [
    path.join(svgDir, `${sourceName}.svg`),
    path.join(svgDir, `${sourceName.toLowerCase()}.svg`),
  ];

  let found = null;
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      found = candidate;
      break;
    }
  }

  if (found) {
    const dest = path.join(outSvgDir, `${newName}.svg`);
    fs.copyFileSync(found, dest);
    copiedCount++;
  } else {
    missingCount++;
    console.warn(`  ⚠️  SVG bulunamadı: ${sourceName}`);
  }
}

// ============ REPORTS ============
const allIcons = [...uniqueIcons.values()];
const reviewIcons = allIcons.filter(i => i.newName.startsWith('REVIEW_'));
const cleanIcons = allIcons.filter(i => !i.newName.startsWith('REVIEW_'));

// 1) naming-map.json — sen edit edeceksin
const namingMap = {};
for (const icon of cleanIcons) {
  namingMap[icon.newName] = {
    originalNames: icon.originalNames,
    type: icon.type,
  };
}
fs.writeFileSync(
  path.join(outDir, 'naming-map.json'),
  JSON.stringify(namingMap, null, 2)
);

// 2) legacy-mapper.json — eski isim → yeni isim
const legacyMapper = {};
for (const icon of cleanIcons) {
  for (const oldName of icon.originalNames) {
    legacyMapper[oldName] = icon.newName;
  }
}
fs.writeFileSync(
  path.join(outDir, 'legacy-mapper.json'),
  JSON.stringify(legacyMapper, null, 2)
);

// 3) Markdown rapor
const md = `# Cleanup & Naming Review

**Toplam:** ${inventory.length} icon bloğu (duplicate dahil)
**Unique:** ${cleanIcons.length} icon
**Review gerekli:** ${reviewIcons.length} icon

## ✅ Temiz Iconlar (${cleanIcons.length})

Sözlükteki kelimelerle başarıyla yeni isim aldı. Aşağıdaki tabloyu kontrol et — yanlış varsa söyle.

| Yeni İsim | Eski İsim(ler) | Tip | Renkler |
|---|---|---|---|
${cleanIcons
  .sort((a, b) => a.newName.localeCompare(b.newName))
  .map(i => `| \`${i.newName}\` | ${i.originalNames.map(n => `\`${n}\``).join(', ')} | ${i.type} | ${(i.colors || []).join(', ') || '-'} |`)
  .join('\n')}

## ⚠️ Review Gerekli (${reviewIcons.length})

Sözlükte yoktu, manuel naming lazım:

${reviewIcons.map(i => `- \`${i.originalNames[0]}\` (${i.type}) — kolonlar: ${(i.colors || []).join(', ') || 'yok'}`).join('\n')}
`;

fs.writeFileSync(path.join(outDir, 'naming-review.md'), md);

// ============ SUMMARY ============
console.log('\n📊 Sonuç:');
console.log(`   📦 Inventory:     ${inventory.length} kayıt`);
console.log(`   ✨ Unique:        ${cleanIcons.length} icon`);
console.log(`   ⚠️  Review:        ${reviewIcons.length} icon`);
console.log(`   📁 Kopyalandı:    ${copiedCount} SVG`);
console.log(`   ❌ Eksik:         ${missingCount} SVG`);
console.log(`\n   📄 Rapor:         ${path.join(outDir, 'naming-review.md')}`);
console.log(`   📄 Naming map:    ${path.join(outDir, 'naming-map.json')}`);
console.log(`   📄 Legacy mapper: ${path.join(outDir, 'legacy-mapper.json')}`);
console.log(`\n   📁 SVG'ler:       ${outSvgDir}`);
console.log('\n✅ Tamamlandı!');