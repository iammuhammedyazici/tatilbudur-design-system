#!/usr/bin/env node
/**
 * feature.js → SVG extractor
 *
 * Kullanım:
 *   node scripts/extract-icons.mjs <feature.js yolu>
 *
 * Üretir:
 *   - extracted/svg/<icon-name>.svg   (her icon ayrı dosya)
 *   - extracted/inventory.md          (tüm iconların listesi + analiz)
 *   - extracted/raw/<icon-name>.jsx   (orijinal JSX bloğu - debug için)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ ARGS ============
const inputPath = process.argv[2];
if (!inputPath) {
  console.error('❌ Kullanım: node scripts/extract-icons.mjs <feature.js yolu>');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error(`❌ Dosya bulunamadı: ${inputPath}`);
  process.exit(1);
}

// ============ OUTPUT DIRS ============
const outDir = path.join(__dirname, '..', 'extracted');
const svgDir = path.join(outDir, 'svg');
const rawDir = path.join(outDir, 'raw');

fs.mkdirSync(svgDir, { recursive: true });
fs.mkdirSync(rawDir, { recursive: true });

// ============ READ FILE ============
const content = fs.readFileSync(inputPath, 'utf-8');
console.log(`📖 Dosya okundu: ${content.length} karakter, ${content.split('\n').length} satır`);

// ============ EXTRACT ICONS ============
// Pattern: if (iconName == "xxx") { return ( <Svg ...> ... </Svg> ) }
// veya tek tırnak, ===, vs.

const iconBlocks = [];
const namePattern = /if\s*\(\s*iconName\s*[=!]==?\s*["']([^"']+)["']\s*\)/g;

let match;
const matches = [];
while ((match = namePattern.exec(content)) !== null) {
  matches.push({ name: match[1], startIdx: match.index });
}

console.log(`🔍 ${matches.length} icon bloğu bulundu`);

// Her bloğun başlangıç ve bitişini bul
for (let i = 0; i < matches.length; i++) {
  const { name, startIdx } = matches[i];
  const nextStart = matches[i + 1]?.startIdx ?? content.length;
  const block = content.slice(startIdx, nextStart);

  // <Svg ... /> veya <Svg>...</Svg> kısmını bul
  const svgMatch = block.match(/<Svg[\s\S]*?<\/Svg>/);
  if (!svgMatch) {
    console.warn(`  ⚠️  ${name}: SVG bulunamadı, atlanıyor`);
    continue;
  }

  iconBlocks.push({
    originalName: name,
    jsx: svgMatch[0],
  });
}

console.log(`✅ ${iconBlocks.length} SVG çıkarıldı`);

// ============ JSX → SVG CONVERSION ============
function jsxToSvg(jsx) {
  let svg = jsx;

  // 1. React Native component'leri → standart SVG element'lerine
  const componentMap = {
    Svg: 'svg',
    Path: 'path',
    G: 'g',
    Circle: 'circle',
    Rect: 'rect',
    Ellipse: 'ellipse',
    Line: 'line',
    Polygon: 'polygon',
    Polyline: 'polyline',
    Defs: 'defs',
    LinearGradient: 'linearGradient',
    RadialGradient: 'radialGradient',
    Stop: 'stop',
    ClipPath: 'clipPath',
    Mask: 'mask',
    Pattern: 'pattern',
    Use: 'use',
    Image: 'image',
    TSpan: 'tspan',
    Text: 'text',
  };

  // <Svg ...> → <svg ...>
  for (const [rn, std] of Object.entries(componentMap)) {
    svg = svg.replace(new RegExp(`<${rn}(\\s|>|/>)`, 'g'), `<${std}$1`);
    svg = svg.replace(new RegExp(`</${rn}>`, 'g'), `</${std}>`);
  }

  // 2. JSX expression'ları ({color}, {width}, fill={color}) temizle
  // fill={color} → fill="currentColor"
  svg = svg.replace(/fill=\{color[^}]*\}/g, 'fill="currentColor"');
  svg = svg.replace(/stroke=\{color[^}]*\}/g, 'stroke="currentColor"');

  // width={24} → width="24"
  svg = svg.replace(/(\w+)=\{(\d+(?:\.\d+)?)\}/g, '$1="$2"');

  // width={width != undefined ? width : 16} → width="16" (default)
  svg = svg.replace(/(\w+)=\{[^}]*\?\s*[^:]+:\s*(\d+(?:\.\d+)?)[^}]*\}/g, '$1="$2"');

  // Diğer JSX expression'ları kaldır
  svg = svg.replace(/\s+(\w+)=\{[^}]+\}/g, '');

  // 3. camelCase → kebab-case (SVG standart)
  const attrMap = {
    strokeWidth: 'stroke-width',
    strokeLinecap: 'stroke-linecap',
    strokeLinejoin: 'stroke-linejoin',
    strokeDasharray: 'stroke-dasharray',
    strokeMiterlimit: 'stroke-miterlimit',
    fillRule: 'fill-rule',
    clipRule: 'clip-rule',
    clipPath: 'clip-path',
    stopColor: 'stop-color',
    stopOpacity: 'stop-opacity',
    fillOpacity: 'fill-opacity',
    strokeOpacity: 'stroke-opacity',
    gradientUnits: 'gradientUnits', // SVG'de camelCase kalır
    xlinkHref: 'xlink:href',
  };

  for (const [camel, kebab] of Object.entries(attrMap)) {
    svg = svg.replace(new RegExp(`\\b${camel}=`, 'g'), `${kebab}=`);
  }

  // 4. xmlns ekle (yoksa)
  if (!svg.includes('xmlns=')) {
    svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  return svg.trim();
}

// ============ COLOR ANALYSIS ============
function analyzeIcon(svg) {
  // Sabit renkler (currentColor olmayan)
  const hexColors = [...svg.matchAll(/#[0-9A-Fa-f]{3,8}\b/g)].map(m => m[0]);
  const namedColors = [...svg.matchAll(/(?:fill|stroke)="([a-z]+)"/g)]
    .map(m => m[1])
    .filter(c => !['none', 'currentColor', 'transparent', 'inherit'].includes(c));

  const uniqueColors = [...new Set([...hexColors, ...namedColors])];
  const hasGradient = svg.includes('<linearGradient') || svg.includes('<radialGradient');
  const usesCurrentColor = svg.includes('currentColor');

  let type = 'unknown';
  if (hasGradient || uniqueColors.length > 1) {
    type = 'illustration';
  } else if (usesCurrentColor && uniqueColors.length === 0) {
    type = 'mono';
  } else if (uniqueColors.length === 1) {
    type = 'mono-fixed'; // tek renk ama sabit (currentColor değil)
  }

  return { type, colors: uniqueColors, hasGradient };
}

// ============ NAME NORMALIZATION SUGGESTIONS ============
function suggestNewName(oldName) {
  let suggested = oldName.toLowerCase();

  // Tab menu suffix'i kaldır
  suggested = suggested.replace(/-tab-menu$/, '');

  // Türkçe karakter düzeltme
  const trMap = {
    'ı': 'i', 'ş': 's', 'ğ': 'g', 'ü': 'u', 'ö': 'o', 'ç': 'c',
    'İ': 'i', 'Ş': 's', 'Ğ': 'g', 'Ü': 'u', 'Ö': 'o', 'Ç': 'c',
  };
  for (const [tr, en] of Object.entries(trMap)) {
    suggested = suggested.replaceAll(tr, en);
  }

  // Yaygın typo düzeltmeleri
  const typoMap = {
    'calender': 'calendar',
    'stars': 'star',
  };
  if (typoMap[suggested]) suggested = typoMap[suggested];

  return suggested;
}

// ============ PROCESS & WRITE ============
const inventory = [];

for (const { originalName, jsx } of iconBlocks) {
  const suggestedName = suggestNewName(originalName);
  const svg = jsxToSvg(jsx);
  const analysis = analyzeIcon(svg);

  // SVG dosyasını yaz (önerilen isimle, dosya zaten varsa eskisini koru)
  const svgFilename = `${suggestedName}.svg`;
  const svgPath = path.join(svgDir, svgFilename);
  if (fs.existsSync(svgPath)) {
    // Duplicate isim — alias notu düş
    const altPath = path.join(svgDir, `${suggestedName}__${originalName}.svg`);
    fs.writeFileSync(altPath, svg);
  } else {
    fs.writeFileSync(svgPath, svg);
  }

  // Raw JSX kaydet (debug için)
  fs.writeFileSync(path.join(rawDir, `${suggestedName}.jsx`), jsx);

  inventory.push({
    originalName,
    suggestedName,
    type: analysis.type,
    colors: analysis.colors,
    hasGradient: analysis.hasGradient,
  });
}

// ============ INVENTORY REPORT ============
const monoCount = inventory.filter(i => i.type === 'mono').length;
const monoFixedCount = inventory.filter(i => i.type === 'mono-fixed').length;
const illustrationCount = inventory.filter(i => i.type === 'illustration').length;
const unknownCount = inventory.filter(i => i.type === 'unknown').length;

// İsim çakışmaları (alias'lar)
const nameCounts = {};
inventory.forEach(i => {
  nameCounts[i.suggestedName] = (nameCounts[i.suggestedName] || 0) + 1;
});
const duplicates = Object.entries(nameCounts).filter(([, c]) => c > 1);

const md = `# Icon Envanteri

**Toplam:** ${inventory.length} icon

## Kategoriler

| Tip | Adet | Açıklama |
|---|---|---|
| 🟢 Mono | ${monoCount} | \`currentColor\` kullanan, tek renkli — kolay migration |
| 🟡 Mono (sabit renk) | ${monoFixedCount} | Tek renkli ama sabit renk — manuel düzeltme gerekli |
| 🔴 Illustration | ${illustrationCount} | Multi-color / gradient — illustration klasörüne |
| ⚫ Bilinmiyor | ${unknownCount} | Manuel inceleme |

## İsim Çakışmaları (Alias'lar)

${duplicates.length === 0 ? '✅ Çakışma yok' : duplicates.map(([name, count]) => `- **${name}**: ${count} farklı orijinal isim`).join('\n')}

## Tüm İconlar

| Orijinal İsim | Önerilen İsim | Tip | Renkler |
|---|---|---|---|
${inventory.map(i =>
  `| \`${i.originalName}\` | \`${i.suggestedName}\` | ${i.type} | ${i.colors.join(', ') || '-'} |`
).join('\n')}
`;

fs.writeFileSync(path.join(outDir, 'inventory.md'), md);

// JSON da yaz (script'lerle işlemek için)
fs.writeFileSync(
  path.join(outDir, 'inventory.json'),
  JSON.stringify(inventory, null, 2)
);

// ============ SUMMARY ============
console.log('\n📊 Özet:');
console.log(`   🟢 Mono:           ${monoCount}`);
console.log(`   🟡 Mono (sabit):   ${monoFixedCount}`);
console.log(`   🔴 Illustration:   ${illustrationCount}`);
console.log(`   ⚫ Bilinmiyor:     ${unknownCount}`);
console.log(`\n   📁 SVG dosyaları:  ${svgDir}`);
console.log(`   📄 Rapor:          ${path.join(outDir, 'inventory.md')}`);
console.log(`   📄 JSON:           ${path.join(outDir, 'inventory.json')}`);
console.log('\n✅ Tamamlandı!');