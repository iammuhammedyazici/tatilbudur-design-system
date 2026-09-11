import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within, fn, waitFor } from 'storybook/test';
import { ContactInput as WebInput } from './ContactInput.web';
import { ContactInput as NativeInput } from './ContactInput.native';
import type { WebContactInputProps } from './ContactInput.web';
import {
  CompareDecorator,
  usePreviewPlatform,
} from '../../stories/CompareDecorator';
import { CodeBlock } from '../../stories/CodeBlock';

type PreviewProps = Pick<
  WebContactInputProps,
  | 'value'
  | 'defaultValue'
  | 'label'
  | 'placeholder'
  | 'error'
  | 'helperText'
  | 'disabled'
  | 'readOnly'
  | 'editable'
  | 'forcedMode'
  | 'defaultCountry'
  | 'testID'
  | 'onChangeText'
  | 'onModeChange'
  | 'onCallingCodeChange'
>;
function PreviewInput(props: PreviewProps) {
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
}
const meta = {
  title: 'Components/ContactInput',
  component: WebInput,
  render: (args) => <PreviewInput {...args} />,
  decorators: [CompareDecorator],
  parameters: {
    layout: 'padded',
    usage: UsageExamples,
    docs: {
      description: {
        component:
          'Mobil uygulamanın Giriş Yap / Hesap Oluştur alanı. Altı rakamdan sonra telefon ülke kodu açılır; harf veya @ girildiğinde e-posta görünümüne döner. Telefon/e-posta doğrulaması form tarafından yapılır.',
      },
    },
  },
  argTypes: {
    forcedMode: { control: 'select', options: [undefined, 'phone', 'email'] },
    defaultCountry: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    onChangeText: { action: 'changed' },
    onModeChange: { action: 'mode changed' },
    onCallingCodeChange: { action: 'calling code changed' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WebInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Phone: Story = { args: { defaultValue: '5321234567' } };
export const Email: Story = { args: { defaultValue: 'deniz@example.com' } };
export const Error: Story = {
  args: {
    defaultValue: 'deniz@',
    error: 'Geçerli bir e-posta adresi giriniz.',
  },
};
export const PhoneError: Story = {
  args: {
    forcedMode: 'phone',
    defaultValue: '532',
    error: 'Geçerli bir telefon numarası giriniz.',
  },
};
export const ForcedPhone: Story = { args: { forcedMode: 'phone' } };
export const ForcedEmail: Story = { args: { forcedMode: 'email' } };
export const International: Story = {
  args: {
    forcedMode: 'phone',
    defaultCountry: 'DE',
    defaultValue: '15123456789',
  },
};
export const Disabled: Story = {
  args: { defaultValue: '5321234567', disabled: true },
};
export const ReadOnly: Story = {
  args: { defaultValue: '5321234567', readOnly: true },
};

function ControlledExample() {
  const [value, setValue] = useState('');
  const [phone, setPhone] = useState(false);
  const [callingCode, setCallingCode] = useState('+90');
  return (
    <PreviewInput
      value={value}
      onChangeText={setValue}
      onModeChange={setPhone}
      onCallingCodeChange={setCallingCode}
      helperText={
        phone
          ? `Telefon numarası · ${callingCode}`
          : 'E-posta adresinizi veya telefon numaranızı girin.'
      }
    />
  );
}
export const Controlled: Story = { render: () => <ControlledExample /> };
export const AutomaticModeInteraction: Story = {
  args: { testID: 'contact-input', onChangeText: fn(), onModeChange: fn() },
  play: async ({ canvasElement, args }) => {
    for (const name of ['Web önizlemesi', 'Native önizlemesi']) {
      const canvas = within(
        within(canvasElement).getByRole('region', { name })
      );
      const input = canvas.getByTestId('contact-input');
      await userEvent.type(input, '53212');
      await expect(
        canvas.queryByTestId('contact-input-country-button')
      ).not.toBeInTheDocument();
      await userEvent.type(input, '3');
      await expect(
        canvas.getByTestId('contact-input-country-button')
      ).toBeVisible();
      await userEvent.type(input, '{backspace}');
      await expect(
        canvas.getByTestId('contact-input-country-button')
      ).toBeVisible();
      await userEvent.type(input, '@example.com');
      await expect(
        canvas.queryByTestId('contact-input-country-button')
      ).not.toBeInTheDocument();
      await expect(input).toHaveValue('53212@example.com');
      await userEvent.clear(input);
      await expect(input).toHaveValue('');
    }
    await expect(args.onModeChange).toHaveBeenCalledWith(true);
    await expect(args.onModeChange).toHaveBeenLastCalledWith(false);
  },
};

export const CountrySelection: Story = {
  args: {
    defaultValue: '5321234567',
    testID: 'country-contact',
    onCallingCodeChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);
    for (const name of ['Web önizlemesi', 'Native önizlemesi']) {
      const canvas = within(
        within(canvasElement).getByRole('region', { name })
      );
      const trigger = canvas.getByTestId('country-contact-country-button');
      await userEvent.click(trigger);
      const search = body.getByRole('textbox', { name: 'Ülke ara' });
      await userEvent.type(search, 'Almanya');
      await userEvent.click(body.getByRole('button', { name: 'Almanya +49' }));
      await waitFor(() =>
        expect(
          body.queryByRole('textbox', { name: 'Ülke ara' })
        ).not.toBeInTheDocument()
      );
      await expect(trigger).toHaveAccessibleName('Ülke seç: Almanya (+49)');
      await expect(canvas.getByTestId('country-contact')).toHaveValue(
        '5321234567'
      );
      await expect(args.onCallingCodeChange).toHaveBeenLastCalledWith('+49');
      if (name === 'Web önizlemesi') {
        await userEvent.click(trigger);
        await userEvent.click(
          body.getByRole('button', { name: 'Ülke seçimini kapat' })
        );
        await waitFor(() => expect(trigger).toHaveFocus());
      }
    }
  },
};

function UsageExamples() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Telefon veya e-posta ile giriş</h3>
      <p style={{ color: '#6F7E90' }}>
        Altı rakam girildiğinde ülke seçimi açılır. Telefon modunda birkaç rakam
        silmek modu değiştirmez; alanı boşaltmak veya harf girmek e-posta
        görünümüne döndürür.
      </p>
      <CodeBlock
        tabs={(['web', 'native'] as const).map((platform) => ({
          label: platform === 'web' ? 'React (Web)' : 'React Native',
          language: 'tsx',
          code: `import { useState } from 'react';
import { ContactInput } from '@iammuhammedyazici/tatilbudur-design-system/${platform}';

export function LoginContact() {
  const [value, setValue] = useState('');
  const [isPhone, setIsPhone] = useState(false);
  const [callingCode, setCallingCode] = useState('+90');

  return (
    <ContactInput
      value={value}
      onChangeText={setValue}
      onModeChange={setIsPhone}
      onCallingCodeChange={setCallingCode}
      helperText={isPhone ? 'Telefon kodu: ' + callingCode : 'E-posta veya telefon girin'}
    />
  );
}
// value, ülke kodundan ayrı tutulur; bileşen maskeleme/doğrulama yapmaz.
// Gönderirken telefon için callingCode + value kullanın ve formda doğrulayın.
// E-posta için value.trim() kullanın.`,
        }))}
      />
      <h4>Kayıt adımında tek bir iletişim türü iste</h4>
      <CodeBlock
        tabs={[
          {
            label: 'Sabit mod',
            language: 'tsx',
            code: `<ContactInput forcedMode="phone" defaultCountry="TR" />
<ContactInput forcedMode="email" />
// forcedMode otomatik geçişi kapatır ve uygun klavyeyi seçer.
// Otomatik modda harf yazabilmek için karma klavye korunur.
// Ülke listesinde Türkçe/İngilizce isim, ISO kodu veya +90 ile arayın.
// disabled, readOnly ve editable={false} ülke seçimini de kilitler.`,
          },
        ]}
      />
      <p style={{ color: '#6F7E90' }}>
        Native uygulamada Poppins fontları ve react-native-svg kurulu olmalıdır.
        Ülke listesi bileşene dahildir.
      </p>
    </div>
  );
}
