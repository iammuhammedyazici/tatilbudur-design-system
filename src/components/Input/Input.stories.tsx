import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { Input } from './Input.web';
import { CodeBlock } from '../../stories/CodeBlock';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'TatilBudur Design System Input. 3 sizes, error/success states, icons, label, helper text.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    status: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    required: { control: 'boolean' },
    onChangeText: { action: 'changed' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

// ============ Single states ============
export const Default: Story = {
  args: {
    placeholder: 'Otel, Şehir, Bölge veya Tema Adı',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Otel Ara',
    placeholder: 'Nereye gitmek istiyorsun?',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'E-posta',
    placeholder: 'ornek@email.com',
    helperText: 'Rezervasyon bilgileri bu adrese gönderilecek',
    type: 'email',
  },
};

export const Required: Story = {
  args: {
    label: 'Ad Soyad',
    placeholder: 'Lütfen adınızı yazın',
    required: true,
  },
};

// ============ Statuses ============
export const Error: Story = {
  args: {
    label: 'E-posta',
    value: 'gecersiz-mail',
    status: 'error',
    helperText: 'Geçerli bir e-posta adresi girin',
  },
};

export const Success: Story = {
  args: {
    label: 'Telefon',
    value: '+90 555 123 45 67',
    status: 'success',
    helperText: 'Doğrulandı',
  },
};

// ============ Sizes ============
export const Small: Story = {
  args: { placeholder: 'Filtrele', size: 'sm' },
};

export const Medium: Story = {
  args: { placeholder: 'Otel ara', size: 'md' },
};

export const Large: Story = {
  args: { placeholder: 'Nereye gidelim?', size: 'lg' },
};

// ============ States ============
export const Disabled: Story = {
  args: {
    label: 'Devre Dışı',
    placeholder: 'Bu alan kapalı',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Salt Okunur',
    value: 'Değiştirilemez değer',
    readOnly: true,
  },
};

export const Password: Story = {
  args: {
    label: 'Şifre',
    placeholder: 'Şifrenizi girin',
    type: 'password',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Tam Genişlik',
    placeholder: 'Container genişliği kadar',
    fullWidth: true,
  },
  parameters: { layout: 'padded' },
};

// ============ Controlled example ============
export const Controlled: Story = {
  render: () => {
    const [val, setVal] = useState('');
    return (
      <div style={{ width: 320 }}>
        <Input
          label="Kontrol Edilmiş"
          placeholder="Yazın..."
          value={val}
          onChangeText={setVal}
          helperText={`${val.length} karakter`}
        />
      </div>
    );
  },
};

// ============ Showcase ============
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Input placeholder="Default" />
      <Input label="With Label" placeholder="Label var" />
      <Input label="Required" placeholder="Zorunlu" required />
      <Input label="Error" value="hata" status="error" helperText="Hatalı giriş" />
      <Input label="Success" value="başarılı" status="success" helperText="Doğru" />
      <Input label="Disabled" value="kapalı" disabled />
      <Input label="Read Only" value="readonly" readOnly />
    </div>
  ),
};

// ============ Interaction tests ============
export const TypeInteraction: Story = {
  args: {
    placeholder: 'Type here',
    onChangeText: fn(),
    testID: 'test-input',
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('test-input');

    await step('Input\'a yazı yazılır', async () => {
      await userEvent.type(input, 'Antalya');
    });

    await step('onChangeText her karakter için çağrılır', async () => {
      await expect(args.onChangeText).toHaveBeenCalled();
    });
  },
};

export const DisabledNoType: Story = {
  args: {
    placeholder: 'Disabled',
    disabled: true,
    onChangeText: fn(),
    testID: 'disabled-input',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('disabled-input');

    await expect(input).toBeDisabled();

    // Disabled'a yazılamaz
    await userEvent.type(input, 'test');
    await expect(args.onChangeText).not.toHaveBeenCalled();
  },
};

// ============ Code Examples ============
export const CodeExamples: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ maxWidth: 800 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 600 }}>
        Kullanım Örnekleri
      </h3>
      <p style={{ margin: '0 0 16px', color: '#6B7280', fontSize: 14 }}>
        Aşağıdaki kodu kopyalayıp projenize yapıştırabilirsiniz.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, marginBottom: 24 }}>
        <Input label="Otel Ara" placeholder="Nereye gitmek istiyorsun?" />
        <Input label="E-posta" type="email" placeholder="ornek@email.com" required />
        <Input label="Hata" value="hata" status="error" helperText="Geçersiz giriş" />
      </div>

      <CodeBlock
        tabs={[
          {
            label: 'React (Web)',
            language: 'tsx',
            code: `import { Input } from '@iammuhammedyazici/tatilbudur-design-system';
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
            label: 'HTML/CSS',
            language: 'html',
            code: `<!-- Input with label -->
<div style="display: flex; flex-direction: column; gap: 4px;">
  <label style="font-size: 14px; font-weight: 500; color: #374151;">
    Otel Ara
  </label>
  <div
    style="
      display: flex;
      align-items: center;
      border: 1.5px solid #D1D5DB;
      border-radius: 8px;
      padding: 12px 16px;
      background: white;
    "
  >
    <input
      type="text"
      placeholder="Nereye gitmek istiyorsun?"
      style="
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        font-size: 16px;
      "
    />
  </div>
</div>`,
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