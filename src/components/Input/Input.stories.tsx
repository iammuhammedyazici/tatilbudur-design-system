import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { Input as WebInput } from './Input.web';
import { Input as NativeInput } from './Input.native';
import type { InputProps } from './Input.types';
import WebArrow from '../../icons/web/ArrowRight';
import NativeArrow from '../../icons/native/ArrowRight';
import {
  CompareDecorator,
  usePreviewPlatform,
} from '../../stories/CompareDecorator';
import { CodeBlock } from '../../stories/CodeBlock';

const Input = (props: InputProps) => {
  const platform = usePreviewPlatform();
  return platform === 'native' ? (
    <NativeInput
      {...props}
      style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}
      labelStyle={{
        fontFamily: 'Poppins, system-ui, sans-serif',
        fontWeight: '500',
      }}
      helperTextStyle={{ fontFamily: 'Poppins, system-ui, sans-serif' }}
    />
  ) : (
    <WebInput {...props} />
  );
};

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: WebInput,
  render: (args) => <Input {...args} />,
  decorators: [CompareDecorator],
  parameters: {
    layout: 'padded',
    usage: UsageExamples,
    docs: {
      description: {
        component:
          'Uygulamadaki TBTextInput tasarımı. 48 px alan, etiket, ikonlu hata mesajı, şifre göster/gizle ve T.C. kimlik numarası girişi.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'tc', 'email', 'number', 'tel'],
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    editable: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    required: { control: 'boolean' },
    size: { table: { disable: true } },
    status: { table: { disable: true } },
    onChangeText: { action: 'changed' },
    onRightIconPress: { control: false },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: 'Ad', placeholder: 'Adınızı giriniz' },
};
export const WithLabel: Story = {
  args: { label: 'Soyad', placeholder: 'Soyadınızı giriniz' },
};
export const Filled: Story = { args: { label: 'Ad', defaultValue: 'Deniz' } };
export const Error: Story = {
  args: {
    label: 'E-posta',
    type: 'email',
    defaultValue: 'gecersiz-mail',
    error: 'Geçerli bir e-posta adresi giriniz.',
    testID: 'email-input',
  },
};
export const WithHelperText: Story = {
  args: {
    label: 'E-posta',
    type: 'email',
    placeholder: 'ornek@email.com',
    helperText: 'Rezervasyon bilgileri bu adrese gönderilir.',
  },
};
export const Required: Story = {
  args: {
    label: 'Ad Soyad',
    placeholder: 'Adınızı ve soyadınızı giriniz',
    required: true,
  },
};
export const Password: Story = {
  args: {
    label: 'Şifre',
    type: 'password',
    placeholder: 'Şifrenizi giriniz',
    defaultValue: 'Tatilbudur123',
    testID: 'password-input',
  },
};
export const EmptyPassword: Story = {
  args: { label: 'Şifre', type: 'password', placeholder: 'Şifrenizi giriniz' },
};
export const PasswordError: Story = {
  args: {
    label: 'Şifre',
    type: 'password',
    defaultValue: '123',
    error: 'Şifreniz en az 8 karakter olmalıdır.',
  },
};
export const IdentityNumber: Story = {
  args: {
    label: 'T.C. Kimlik Numarası',
    type: 'tc',
    placeholder: '11 haneli kimlik numaranız',
    helperText: 'Yalnızca rakam girilebilir.',
    testID: 'tc-input',
  },
};
export const Disabled: Story = {
  args: { label: 'E-posta', defaultValue: 'ornek@email.com', disabled: true },
};
export const ReadOnly: Story = {
  args: { label: 'Üyelik numarası', value: 'TB-123456', readOnly: true },
};
export const FullWidth: Story = {
  args: {
    label: 'Ad Soyad',
    placeholder: 'Adınızı ve soyadınızı giriniz',
    fullWidth: true,
  },
};

function CustomAction() {
  const platform = usePreviewPlatform();
  const Arrow = platform === 'native' ? NativeArrow : WebArrow;
  const [searched, setSearched] = useState(false);
  const [value, setValue] = useState('');
  return (
    <Input
      label="Otel Ara"
      placeholder="Otel veya şehir adı"
      value={value}
      onChangeText={setValue}
      rightIcon={<Arrow width={24} height={24} color="#3F546C" />}
      rightIconAccessibilityLabel="Aramayı başlat"
      onRightIconPress={() => setSearched(true)}
      helperText={
        searched
          ? `${value || 'Tüm oteller'} için arama başlatıldı.`
          : undefined
      }
    />
  );
}
export const RightIconAction: Story = { render: () => <CustomAction /> };

function ControlledInput() {
  const [value, setValue] = useState('');
  return (
    <Input
      label="Ad Soyad"
      placeholder="Adınızı ve soyadınızı giriniz"
      value={value}
      onChangeText={setValue}
      helperText={`${value.length} karakter`}
    />
  );
}
export const Controlled: Story = { render: () => <ControlledInput /> };
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: '100%',
      }}
    >
      <Input label="Ad" placeholder="Adınızı giriniz" />
      <Input label="Soyad" defaultValue="Yılmaz" />
      <Input
        label="E-posta"
        defaultValue="gecersiz-mail"
        error="Geçerli bir e-posta adresi giriniz."
      />
      <Input label="Şifre" type="password" defaultValue="Tatilbudur123" />
      <Input
        label="T.C. Kimlik Numarası"
        type="tc"
        placeholder="11 haneli kimlik numaranız"
      />
      <Input label="Üyelik numarası" value="TB-123456" readOnly />
      <Input label="Devre dışı" placeholder="Bu alan düzenlenemez" disabled />
    </div>
  ),
};

export const TypeInteraction: Story = {
  args: {
    label: 'Ad',
    placeholder: 'Type here',
    onChangeText: fn(),
    testID: 'test-input',
  },
  play: async ({ args, canvasElement }) => {
    for (const name of ['Web önizlemesi', 'Native önizlemesi']) {
      const canvas = within(
        within(canvasElement).getByRole('region', { name })
      );
      await userEvent.type(canvas.getByTestId('test-input'), 'Antalya');
      await expect(canvas.getByTestId('test-input')).toHaveValue('Antalya');
    }
    await expect(args.onChangeText).toHaveBeenCalledWith('Antalya');
  },
};
export const DisabledNoType: Story = {
  args: {
    label: 'Devre dışı',
    disabled: true,
    onChangeText: fn(),
    testID: 'disabled-input',
  },
  play: async ({ args, canvasElement }) => {
    for (const name of ['Web önizlemesi', 'Native önizlemesi']) {
      const canvas = within(
        within(canvasElement).getByRole('region', { name })
      );
      await userEvent.type(canvas.getByTestId('disabled-input'), 'test');
      await expect(canvas.getByTestId('disabled-input')).toHaveValue('');
    }
    await expect(args.onChangeText).not.toHaveBeenCalled();
  },
};
export const PasswordToggle: Story = {
  args: {
    label: 'Şifre',
    type: 'password',
    defaultValue: 'Tatilbudur123',
    testID: 'password-toggle',
  },
  play: async ({ canvasElement }) => {
    for (const name of ['Web önizlemesi', 'Native önizlemesi']) {
      const canvas = within(
        within(canvasElement).getByRole('region', { name })
      );
      const input = canvas.getByTestId('password-toggle');
      await expect(input).toHaveAttribute('type', 'password');
      await userEvent.click(
        canvas.getByRole('button', { name: 'Şifreyi göster' })
      );
      await expect(input).toHaveAttribute('type', 'text');
      await expect(input).toHaveValue('Tatilbudur123');
      await userEvent.click(
        canvas.getByRole('button', { name: 'Şifreyi gizle' })
      );
      await expect(input).toHaveAttribute('type', 'password');
    }
  },
};
export const IdentityNumberInteraction: Story = {
  args: {
    label: 'T.C. Kimlik Numarası',
    type: 'tc',
    testID: 'tc-test',
    onChangeText: fn(),
  },
  play: async ({ canvasElement, args }) => {
    for (const name of ['Web önizlemesi', 'Native önizlemesi']) {
      const canvas = within(
        within(canvasElement).getByRole('region', { name })
      );
      const input = canvas.getByTestId('tc-test');
      await userEvent.type(input, 'ab01234567890123');
      await expect(input).toHaveValue('01234567890');
    }
    await expect(args.onChangeText).toHaveBeenLastCalledWith('01234567890');
  },
};

function UsageExamples() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Input kullanımı</h3>
      <p style={{ color: '#6F7E90' }}>
        Metin, şifre ve T.C. kimlik alanları için ortak bileşen. Varsayılan
        yükseklik 48 px.
      </p>
      <CodeBlock
        tabs={[
          {
            label: 'React (Web)',
            language: 'tsx',
            code: `import { useRef, useState } from 'react';
import { Input } from '@iammuhammedyazici/tatilbudur-design-system/web';

export function Example() {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Input
      ref={inputRef}
      label="Ad"
      placeholder="Adınızı giriniz"
      value={value}
      onChangeText={setValue}
      onBlur={() => { /* Form doğrulaması */ }}
      name="firstName"
      autoComplete="given-name"
      required
    />
  );
}`,
          },
          {
            label: 'React Native',
            language: 'tsx',
            code: `import { useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { Input } from '@iammuhammedyazici/tatilbudur-design-system/native';

// Uygulamada Poppins-Regular ve Poppins-Medium fontları yüklü olmalı.
export function Example() {
  const [value, setValue] = useState('');
  const inputRef = useRef<TextInput>(null);

  return (
    <Input
      ref={inputRef}
      label="Ad"
      placeholder="Adınızı giriniz"
      value={value}
      onChangeText={setValue}
      onBlur={() => { /* Form doğrulaması */ }}
      autoCapitalize="words"
      returnKeyType="next"
      editable
    />
  );
}`,
          },
          {
            label: 'Şifre ve T.C.',
            language: 'tsx',
            code: `<Input
  type="password"
  label="Şifre"
  placeholder="Şifrenizi giriniz"
  value={password}
  onChangeText={setPassword}
  error={passwordError}
/>
// Dolu şifre alanında göster/gizle ikonu otomatik görünür.

<Input
  type="tc"
  label="T.C. Kimlik Numarası"
  placeholder="11 haneli kimlik numaranız"
  value={identityNumber}
  onChangeText={setIdentityNumber}
  error={identityError}
/>
// Yalnızca rakam kabul eder, baştaki sıfırı korur ve 11 hanede sınırlar.
// Kimlik numarasının geçerliliğini formunuzda ayrıca doğrulayın.`,
          },
          {
            label: 'Sağ ikon',
            language: 'tsx',
            code: `<Input
  label="Otel Ara"
  placeholder="Otel veya şehir adı"
  value={query}
  onChangeText={setQuery}
  rightIcon={<SearchIcon width={24} height={24} />}
  onRightIconPress={handleSearch}
  rightIconAccessibilityLabel="Aramayı başlat"
/>
// Native kullanımda react-native-svg uyumlu ikon kullanın.
// containerStyle dış alanı, style metin girişini özelleştirir.`,
          },
        ]}
      />
    </div>
  );
}
