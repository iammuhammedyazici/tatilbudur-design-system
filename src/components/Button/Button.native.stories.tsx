import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button.native';

const meta: Meta<typeof Button> = {
  title: 'Components/Button (Native Preview)',
  component: Button,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'react-native-web üzerinden render edilen NATIVE (Button.native.tsx) önizlemesi. ' +
          'Bu, Storybook/Components/Button altındaki hikayelerden farklı bir dosyayı ' +
          '(Button.native.tsx, mobil uygulamanın gerçekten kullandığı kod) çalıştırır. ' +
          '⚠️ react-native-web bir DOM/CSS simülasyonudur — Android/iOS\'a özgü font metriği, ' +
          'includeFontPadding gibi platform davranışlarını birebir yansıtmaz. Layout/renk/spacing ' +
          'hatalarını erken yakalamak içindir; nihai doğrulama her zaman gerçek cihaz/emülatörde yapılmalı.',
      },
    },
  },
  argTypes: {
    buttonStyle: { control: 'select', options: ['filled', 'outline', 'ghost', 'link'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  tags: ['autodocs'],
  decorators: [
    // RN'de root View'ler her zaman flex container'dır; react-native-web
    // DOM'da bunu varsaymaz, o yüzden alignSelf/flex davranışının gerçek
    // uygulamadakiyle aynı görünmesi için burada elle sarmalıyoruz.
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {
  args: {
    children: 'Devam Et',
    buttonStyle: 'filled',
    variant: 'primary',
    size: 'lg',
  },
};

// ============ Boyut karşılaştırması (Figma spec: sm 32 / md 40 / lg 48) ============
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 32, fontSize: 12, color: '#6B7280' }}>{size}</span>
          <Button buttonStyle="filled" variant="primary" size={size}>
            Devam Et
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Loading: Story = {
  args: { children: 'Devam Et', loading: true, size: 'lg' },
};

export const Disabled: Story = {
  args: { children: 'Devam Et', disabled: true, size: 'lg' },
};
