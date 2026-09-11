import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Picker as WebPicker } from './Picker.web';
import { Picker as NativePicker } from './Picker.native';
import type { PickerProps } from './Picker.types';
import {
  CompareDecorator,
  usePreviewPlatform,
} from '../../stories/CompareDecorator';
import { CodeBlock } from '../../stories/CodeBlock';

// Sizi Arayalım ekranındaki gerçek konu ve talep detayı seçenekleri.
const topics = [
  'Yurtiçi Otel veya Paket Tur Rezervasyon Talebi',
  'Yurtdışı Otel veya Paket Tur Rezervasyon Talebi',
  'Uçak Bileti Rezervasyon Talebi',
  'Değişiklik Talebi',
  'İptal Talebi',
  'Ek Hizmet Ekleme/Çıkarma',
  'Tur Bilgilendirmesi',
  'Eksik Evrak Talebi',
  'Eksik Ödeme Tamamlama Talebi',
].map((label) => ({ label, value: label }));
const details = [
  'İsim Değişikliği',
  'Tarih Değişikliği',
  'Tesis/Ürün Değişikliği',
  'Oda Tipi Değişikliği',
  'Kişi Ekleme/Çıkarma',
  'Konsept Değişikliği',
  'İptal Sigortası Ekleme',
].map((label) => ({ label, value: label }));

function PreviewPicker(props: PickerProps) {
  const platform = usePreviewPlatform();
  return platform === 'native' ? (
    <NativePicker
      {...props}
      inputTextStyle={{ fontFamily: 'Poppins, system-ui, sans-serif' }}
    />
  ) : (
    <WebPicker {...props} />
  );
}
const meta = {
  title: 'Components/Picker',
  component: WebPicker,
  render: (args) => <PreviewPicker {...args} />,
  decorators: [CompareDecorator],
  parameters: {
    layout: 'padded',
    usage: UsageExamples,
    docs: {
      description: {
        component:
          'Sizi Arayalım sayfasındaki Picker. Seçenekler geçici olarak işaretlenir; Tamamla seçimi kaydeder. Vazgeç, dışarı tıklama veya geri/Escape seçimi kaydetmeden kapatır.',
      },
    },
  },
  args: { items: topics, placeholder: 'Konu seçin', modalTitle: 'Konu seçin' },
  argTypes: {
    onChange: { action: 'selection confirmed' },
    searchable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    error: { control: 'boolean' },
    required: { control: 'boolean' },
    leftIcon: { control: false },
    rightIcon: { control: false },
    onPress: { control: false },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WebPicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Selected: Story = {
  args: { defaultValue: 'Uçak Bileti Rezervasyon Talebi' },
};
export const TopicDetail: Story = {
  args: {
    items: details,
    placeholder: 'Talep detayı seçin',
    modalTitle: 'Talep detayı seçin',
  },
};
export const Searchable: Story = {
  args: { searchable: true, searchPlaceholder: 'Konu ara...' },
};
export const WithLabel: Story = {
  args: { label: 'İletişim konusu', required: true },
};
export const Error: Story = {
  args: { error: true, helperText: 'Lütfen bir konu seçiniz.' },
};
export const Disabled: Story = {
  args: { disabled: true, defaultValue: topics[0].value },
};
export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: topics[0].value },
};
export const DisabledOption: Story = {
  args: {
    items: topics.map((item, index) => ({ ...item, disabled: index === 2 })),
  },
};
export const Empty: Story = { args: { items: [], searchable: true } };
export const NumericValues: Story = {
  args: {
    items: [
      { label: 'Bugün', value: 0 },
      { label: 'Yarın', value: 1 },
    ],
    defaultValue: 0,
    placeholder: 'Arama zamanı',
    modalTitle: 'Arama zamanı',
  },
};

function CallMeExample() {
  const [topic, setTopic] = useState<string | number | null>(null);
  const [detail, setDetail] = useState<string | number | null>(null);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <PreviewPicker
        items={topics}
        value={topic}
        onChange={(item) => {
          setTopic(item.value);
          setDetail(null);
        }}
        placeholder="Konu seçin"
        modalTitle="Konu seçin"
      />
      {topic === 'Değişiklik Talebi' && (
        <PreviewPicker
          items={details}
          value={detail}
          onChange={(item) => setDetail(item.value)}
          placeholder="Talep detayı seçin"
          modalTitle="Talep detayı seçin"
        />
      )}
    </div>
  );
}
export const CallMe: Story = { render: () => <CallMeExample /> };

export const ConfirmAndCancel: Story = {
  args: {
    onChange: fn(),
    testID: 'topic-picker',
    searchable: true,
    items: [
      { label: 'Değişiklik Talebi', value: 'change' },
      { label: 'İptal Talebi', value: 'cancel', disabled: true },
    ],
    defaultValue: undefined,
  },
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);
    for (const name of ['Web önizlemesi', 'Native önizlemesi']) {
      const canvas = within(
        within(canvasElement).getByRole('region', { name })
      );
      const trigger = canvas.getByTestId('topic-picker');
      await userEvent.click(trigger);
      await expect(
        body.getByRole('button', { name: 'Tamamla' })
      ).toBeDisabled();
      const search = body.getByRole('textbox', { name: 'Seçenek ara' });
      await userEvent.type(search, 'zzzz');
      await expect(body.getByText('Kayıt bulunamadı.')).toBeVisible();
      await userEvent.clear(search);
      await userEvent.type(search, 'degisiklik');
      await userEvent.click(
        body.getByRole('radio', { name: 'Değişiklik Talebi' })
      );
      await expect(trigger).toHaveTextContent('Konu seçin');
      await userEvent.click(body.getByRole('button', { name: 'Vazgeç' }));
      await waitFor(() =>
        expect(
          body.queryByRole('button', { name: 'Tamamla' })
        ).not.toBeInTheDocument()
      );
      await expect(trigger).toHaveTextContent('Konu seçin');
      await userEvent.click(trigger);
      await expect(
        body.getByRole('textbox', { name: 'Seçenek ara' })
      ).toHaveValue('');
      await expect(
        body.getByRole('radio', { name: 'Değişiklik Talebi' })
      ).not.toBeChecked();
      await userEvent.click(
        body.getByRole('radio', { name: 'Değişiklik Talebi' })
      );
      await userEvent.click(body.getByRole('button', { name: 'Tamamla' }));
      await waitFor(() =>
        expect(
          body.queryByRole('button', { name: 'Tamamla' })
        ).not.toBeInTheDocument()
      );
      await expect(trigger).toHaveTextContent('Değişiklik Talebi');
      if (name === 'Web önizlemesi')
        await waitFor(() => expect(trigger).toHaveFocus());
    }
    await expect(args.onChange).toHaveBeenCalledTimes(2);
    await expect(args.onChange).toHaveBeenLastCalledWith({
      label: 'Değişiklik Talebi',
      value: 'change',
    });
  },
};

function UsageExamples() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Konu ve talep seçimi</h3>
      <p style={{ color: '#6F7E90' }}>
        Satıra basmak geçici seçimi değiştirir. Tamamla seçilen nesneyi onChange
        ile döndürür; Vazgeç veya dışarı tıklamak değişikliği iptal eder.
      </p>
      <CodeBlock
        tabs={(['web', 'native'] as const).map((platform) => ({
          label: platform === 'web' ? 'React (Web)' : 'React Native',
          language: 'tsx',
          code: `import { useState } from 'react';
import { Picker } from '@iammuhammedyazici/tatilbudur-design-system/${platform}';

const topics = [
  { label: 'Değişiklik Talebi', value: 'change' },
  { label: 'İptal Talebi', value: 'cancel' },
];

export function ContactTopic() {
  const [topic, setTopic] = useState<string | null>(null);
  return (
    <PreviewPicker
      items={topics}
      value={topic}
      onChange={item => setTopic(item.value)}
      placeholder="Konu seçin"
      modalTitle="Konu seçin"
      searchable
    />
  );
}
// value={null}: seçimi temizler. defaultValue: kontrolsüz başlangıç değeri.
// error ve helperText ile form doğrulama hatasını gösterin.
// onChange yalnızca Tamamla ile çağrılır; items içindeki nesneyi döndürür.`,
        }))}
      />
      <p style={{ color: '#6F7E90' }}>
        Seçenek değerleri benzersiz string veya number olmalıdır. disabled ve
        readOnly alanın açılmasını engeller; item.disabled tek bir seçeneği
        kilitler. Native uygulamada Poppins fontları ve react-native-svg kurulu
        olmalıdır.
      </p>
    </div>
  );
}
