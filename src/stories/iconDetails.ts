import { name as packageName } from '../../package.json';

export function getIconMetadata(svg: string) {
  const values = svg
    .match(/viewBox="([^"]+)"/)?.[1]
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const width = values?.[2] && values[2] > 0 ? values[2] : 24;
  const height = values?.[3] && values[3] > 0 ? values[3] : 24;
  // Maske ve kırpma alanlarının beyaz dolguları görünür çizimin rengi değildir.
  const artwork = svg.replace(/<(mask|clipPath)\b[\s\S]*?<\/\1>/g, '');
  const paints = [...artwork.matchAll(/(?:fill|stroke|stop-color)="([^"]+)"/g)]
    .map((match) => match[1].toLowerCase())
    .filter(
      (color) =>
        !['none', 'transparent'].includes(color) && !color.startsWith('url(')
    );
  const customizable = paints.includes('currentcolor');
  const fixedColors = paints.filter((color) => color !== 'currentcolor');
  return {
    viewBox: values?.join(' ') ?? `0 0 ${width} ${height}`,
    width,
    height,
    colorMode: customizable
      ? fixedColors.length
        ? 'mixed'
        : 'dynamic'
      : 'fixed',
    whiteArtwork:
      !customizable &&
      fixedColors.length > 0 &&
      fixedColors.every((color) =>
        ['#fff', '#ffffff', 'white'].includes(color)
      ),
  } as const;
}

export function getIconDimensions(
  metadata: { width: number; height: number },
  size: number
) {
  const scale = size / Math.max(metadata.width, metadata.height);
  return {
    width: Math.max(1, Math.round(metadata.width * scale)),
    height: Math.max(1, Math.round(metadata.height * scale)),
  };
}

export function getIconUsage(
  name: string,
  platform: 'web' | 'native',
  width: number,
  height: number,
  color?: string
) {
  const colorProp = color ? ` color="${color}"` : '';
  return `import { ${name} } from '${packageName}/${platform}';\n\nexport function Example() {\n  return (\n    <${name} width={${width}} height={${height}}${colorProp} />\n  );\n}`;
}

export function normalizeHex(value: string): string | null {
  const hex = value.trim().replace(/^#/, '');
  if (/^[\da-f]{3}$/i.test(hex))
    return `#${hex
      .split('')
      .map((char) => char + char)
      .join('')
      .toUpperCase()}`;
  if (/^[\da-f]{6}$/i.test(hex)) return `#${hex.toUpperCase()}`;
  return null;
}

export function downloadIconBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Tarayıcının indirmeyi devralmasına izin ver, ardından URL'yi serbest bırak.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function createIconPng(
  svg: string,
  width: number,
  height: number
): Promise<Blob> {
  const url = URL.createObjectURL(
    new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  );
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('SVG görüntüsü yüklenemedi.'));
      image.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = width * 4;
    canvas.height = height * 4;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('PNG oluşturulamadı.');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error('PNG oluşturulamadı.')),
        'image/png'
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
