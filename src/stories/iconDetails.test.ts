import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TbClub2 } from '../icons/web';
import {
  getIconDimensions,
  getIconMetadata,
  getIconUsage,
  normalizeHex,
} from './iconDetails';

describe('icon usage and export details', () => {
  it('preserves the real club banner proportions and fixed white artwork', () => {
    const metadata = getIconMetadata(
      renderToStaticMarkup(createElement(TbClub2))
    );
    expect(metadata).toMatchObject({
      width: 74,
      height: 42,
      colorMode: 'fixed',
      whiteArtwork: true,
    });
    const dimensions = getIconDimensions(metadata, 128);
    expect(dimensions).toEqual({ width: 128, height: 73 });
    const usage = getIconUsage(
      'TbClub2',
      'web',
      dimensions.width,
      dimensions.height
    );
    expect(usage).toContain(
      "import { TbClub2 } from '@iammuhammedyazici/tatilbudur-design-system/web'"
    );
    expect(usage).toContain('<TbClub2 width={128} height={73} />');
    expect(usage).not.toContain('color=');
  });

  it('uses the native named export and selected color', () => {
    expect(getIconUsage('Check', 'native', 32, 32, '#004CAA')).toContain(
      "import { Check } from '@iammuhammedyazici/tatilbudur-design-system/native'"
    );
    expect(getIconUsage('Check', 'native', 32, 32, '#004CAA')).toContain(
      'color="#004CAA"'
    );
  });

  it('ignores mask paint when deciding whether an icon has fixed colors', () => {
    const metadata = getIconMetadata(
      '<svg viewBox="0 0 16 32"><mask id="a"><path fill="white" /></mask><path fill="currentColor" mask="url(#a)" /></svg>'
    );
    expect(metadata.colorMode).toBe('dynamic');
    expect(getIconDimensions(metadata, 64)).toEqual({ width: 32, height: 64 });
  });

  it('distinguishes partially customizable artwork', () => {
    expect(
      getIconMetadata(
        '<svg viewBox="0 0 24 24"><path fill="currentColor"/><path stroke="#fff"/></svg>'
      ).colorMode
    ).toBe('mixed');
  });

  it('normalizes valid hex values and rejects invalid colors', () => {
    expect(normalizeHex(' #abc ')).toBe('#AABBCC');
    expect(normalizeHex('004caa')).toBe('#004CAA');
    for (const value of [
      '',
      '#12',
      '#zzzzzz',
      'red',
      '#1234567',
      '" onload=',
    ]) {
      expect(normalizeHex(value)).toBeNull();
    }
  });
});
