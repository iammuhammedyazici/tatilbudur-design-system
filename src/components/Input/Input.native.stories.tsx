import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Input } from './Input.native';
import { CodeBlock } from '../../stories/CodeBlock';

const meta: Meta<typeof Input> = {
  title: 'Components/Input (Native Preview)',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'react-native-web üzerinden render edilen NATIVE (Input.native.tsx) önizlemesi — ' +
          'mobil uygulamanın gerçekten kullandığı kod. ⚠️ Bu bir DOM/CSS simülasyonudur, ' +
          'Android/iOS\'a özgü davranışları birebir yansıtmaz; nihai doğrulama gerçek cihazda yapılmalı.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    status: { control: 'select', options: ['default', 'error', 'success'] },
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'tel'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'Otel, Şehir, Bölge veya Tema Adı' },
};

export const WithLabel: Story = {
  args: { label: 'Otel Ara', placeholder: 'Nereye gitmek istiyorsun?' },
};

export const Required: Story = {
  args: { label: 'E-posta', placeholder: 'ornek@email.com', type: 'email', required: true },
};

export const Error: Story = {
  args: { label: 'E-posta', value: 'gecersiz-mail', status: 'error', helperText: 'Geçerli bir e-posta adresi girin' },
};

export const Success: Story = {
  args: { label: 'Telefon', value: '+90 555 123 45 67', status: 'success', helperText: 'Doğrulandı' },
};

export const Disabled: Story = {
  args: { label: 'Devre Dışı', placeholder: 'Bu alan kapalı', disabled: true },
};

// ============ Boyut karşılaştırması (sm 36 / md 44 / lg 52) ============
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Input key={size} label={size} placeholder="Nereye gidelim?" size={size} />
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [val, setVal] = useState('');
    return (
      <Input
        label="Kontrol Edilmiş"
        placeholder="Yazın..."
        value={val}
        onChangeText={setVal}
        helperText={`${val.length} karakter`}
      />
    );
  },
};

// ============ Code Examples ============
export const CodeExamples: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Kullanım Örnekleri (Native)</h3>
      <CodeBlock
        tabs={[
          {
            label: 'React Native',
            language: 'tsx',
            code: `import { Input } from '@iammuhammedyazici/tatilbudur-design-system/native';
import { useState } from 'react';

export const Example = () => {
  const [value, setValue] = useState('');

  return (
    <>
      <Input
        label="Otel Ara"
        placeholder="Nereye gitmek istiyorsun?"
        value={value}
        onChangeText={setValue}
      />

      <Input
        label="E-posta"
        type="email"
        placeholder="ornek@email.com"
        required
      />

      <Input
        label="Hata"
        value="hata"
        status="error"
        helperText="Geçersiz giriş"
      />
    </>
  );
};`,
          },
          {
            label: 'Tüm Props',
            language: 'tsx',
            code: `<Input
  value={value}              // Controlled value
  onChangeText={setValue}    // Değişim handler
  placeholder="..."          // Placeholder text
  label="Otel Ara"           // Üstte label
  helperText="Yardım metni"  // Altta açıklama
  size="md"                  // sm | md | lg
  status="default"           // default | error | success
  type="text"                // text | email | password | number | tel
  disabled={false}           // Devre dışı
  readOnly={false}           // Salt okunur
  required={false}           // Zorunlu (* gösterir)
  fullWidth={false}          // Tam genişlik
  leftIcon={<Icon />}        // Sol ikon
  rightIcon={<Icon />}       // Sağ ikon
  testID="my-input"          // Test için
/>`,
          },
        ]}
      />
    </div>
  ),
};
