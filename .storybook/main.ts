import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Öncelik mobil: şimdilik sadece *.native.stories.* dosyaları gösteriliyor.
  // Web story'leri (Button.stories.tsx, Input.stories.tsx, Icons.stories.tsx)
  // silinmedi, sadece bu listeden çıkarıldı — web tarafına dönüldüğünde
  // ikinci satırı geri eklemek yeterli.
  "stories": [
    "../src/**/*.native.stories.@(js|jsx|mjs|ts|tsx)"
    // "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  // Native (.native.tsx) bileşenlerini tarayıcıda önizleyebilmek için
  // 'react-native' importlarını react-native-web'e yönlendiriyoruz.
  // Not: bu sadece bir DOM/CSS simülasyonudur — Android/iOS'a özgü
  // font-metrik/clipping davranışlarını birebir yansıtmaz, gerçek
  // cihaz testinin yerini tutmaz.
  async viteFinal(viteConfig) {
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = [
      ...(Array.isArray(viteConfig.resolve.alias) ? viteConfig.resolve.alias : []),
      { find: /^react-native$/, replacement: 'react-native-web' },
    ];
    viteConfig.resolve.extensions = [
      '.web.tsx', '.web.ts', '.web.jsx', '.web.js',
      ...(viteConfig.resolve.extensions ?? ['.tsx', '.ts', '.jsx', '.js', '.json']),
    ];
    return viteConfig;
  },
};
export default config;