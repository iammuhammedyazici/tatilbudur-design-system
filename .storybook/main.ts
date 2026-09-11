import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'node:url';

const config: StorybookConfig = {
  // Web ve native örnekleri aynı bileşen sayfasında karşılaştırılır.
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  // Varsayılan 'react-docgen' JSDoc yorumlarını okumuyor, sadece basit tip
  // tahmini yapıyor (Description sütununda "array"/"string" gibi çıkıyordu).
  // 'react-docgen-typescript' .types.ts dosyalarındaki /** ... */ yorumlarını
  // gerçek açıklama olarak gösterir.
  "typescript": {
    reactDocgen: "react-docgen-typescript",
  },
  // Native (.native.tsx) bileşenlerini tarayıcıda önizleyebilmek için
  // 'react-native' importlarını react-native-web'e yönlendiriyoruz.
  // Not: bu sadece bir DOM/CSS simülasyonudur — Android/iOS'a özgü
  // font-metrik/clipping davranışlarını birebir yansıtmaz, gerçek
  // cihaz testinin yerini tutmaz.
  async viteFinal(viteConfig) {
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = [
      ...(Array.isArray(viteConfig.resolve.alias) ? viteConfig.resolve.alias : []),
      { find: /^react-native$/, replacement: fileURLToPath(new URL('./react-native-preview.jsx', import.meta.url)) },
    ];
    viteConfig.resolve.extensions = [
      '.web.tsx', '.web.ts', '.web.jsx', '.web.js',
      ...(viteConfig.resolve.extensions ?? ['.tsx', '.ts', '.jsx', '.js', '.json']),
    ];
    // Bağımlılık ön derlemesi de aynı web platform uzantılarını kullanmalı.
    viteConfig.optimizeDeps = viteConfig.optimizeDeps ?? {};
    viteConfig.optimizeDeps.rolldownOptions = {
      ...viteConfig.optimizeDeps.rolldownOptions,
      resolve: {
        ...viteConfig.optimizeDeps.rolldownOptions?.resolve,
        extensions: viteConfig.resolve.extensions,
      },
    };
    return viteConfig;
  },
};
export default config;
