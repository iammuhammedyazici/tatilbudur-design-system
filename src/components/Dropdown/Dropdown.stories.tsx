import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dropdown as WebDropdown } from './Dropdown.web';
import { Dropdown as NativeDropdown } from './Dropdown.native';
import type { DropdownItem, DropdownProps, DropdownSingleProps, DropdownValue } from './Dropdown.types';
import { CompareDecorator, usePreviewPlatform } from '../../stories/CompareDecorator';
import { CodeBlock } from '../../stories/CodeBlock';

const cities: DropdownItem<string>[] = [
  'İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Muğla', 'Nevşehir', 'Trabzon',
].map((label) => ({ id: label, label, value: label }));

function PreviewDropdown<T extends DropdownValue>(props: DropdownProps<T>) {
  const platform = usePreviewPlatform();
  return platform === 'native' ? (
    <NativeDropdown {...props} />
  ) : (
    <WebDropdown {...props} />
  );
}

const meta = {
  title: 'Components/Dropdown',
  component: PreviewDropdown,
  decorators: [CompareDecorator],
  parameters: {
    layout: 'padded',
    usage: UsageExamples,
    docs: {
      description: {
        component:
          'Tekli/çoklu seçim, arama, chip, 3 render modu (default/modal/inline) ve tema varyantları destekleyen dropdown. Kaynak: tatilbudurapp-v82 / src/components/Dropdown.',
      },
    },
  },
  args: { items: cities, placeholder: 'Şehir seçin', value: null, onChange: () => {} },
  argTypes: {
    onChange: { action: 'changed' },
    mode: { control: 'select', options: ['default', 'modal', 'inline'] },
    theme: { control: 'select', options: ['default', 'light', 'dark', 'outline', 'filled', 'danger', 'success'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    searchable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    loading: { control: 'boolean' },
    clearable: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PreviewDropdown>;
export default meta;
type Story = StoryObj<typeof meta>;

function Controlled(
  props: Omit<Partial<DropdownSingleProps<string>>, 'value' | 'onChange' | 'multiple'> & {
    items: DropdownItem<string>[];
    value?: string | null;
  }
) {
  const [value, setValue] = useState<string | null>(props.value ?? null);
  return (
    <PreviewDropdown
      {...props}
      multiple={false}
      value={value}
      onChange={(v) => setValue(v)}
    />
  );
}

export const Default: Story = { render: () => <Controlled items={cities} placeholder="Şehir seçin" /> };

export const Searchable: Story = {
  render: () => <Controlled items={cities} placeholder="Şehir seçin" searchable searchPlaceholder="Şehir ara..." />,
};

export const ModalMode: Story = {
  render: () => <Controlled items={cities} placeholder="Şehir seçin" mode="modal" />,
};

export const InlineMode: Story = {
  render: () => <Controlled items={cities} placeholder="Şehir seçin" mode="inline" />,
};

function MultipleExample() {
  const [value, setValue] = useState<string[] | null>(null);
  return (
    <PreviewDropdown
      items={cities}
      multiple
      value={value}
      onChange={(v) => setValue(v as string[] | null)}
      placeholder="Şehirleri seçin"
      showChips
      clearable
    />
  );
}
export const Multiple: Story = { render: () => <MultipleExample /> };

export const WithLabel: Story = {
  render: () => <Controlled items={cities} label="Şehir" required placeholder="Şehir seçin" />,
};

export const ErrorState: Story = {
  render: () => (
    <Controlled items={cities} placeholder="Şehir seçin" error="Bir şehir seçmelisiniz." theme="danger" />
  ),
};

export const Disabled: Story = {
  render: () => <Controlled items={cities} value={cities[0].value} placeholder="Şehir seçin" disabled />,
};

export const Loading: Story = { render: () => <Controlled items={cities} placeholder="Şehir seçin" loading /> };

export const Clearable: Story = {
  render: () => <Controlled items={cities} value={cities[2].value} placeholder="Şehir seçin" clearable />,
};

export const DisabledOption: Story = {
  render: () => (
    <Controlled items={cities.map((item, i) => ({ ...item, disabled: i === 1 }))} placeholder="Şehir seçin" />
  ),
};

export const ThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
      {(['default', 'outline', 'filled', 'dark', 'danger', 'success'] as const).map((theme) => (
        <PreviewDropdown key={theme} items={cities} theme={theme} placeholder={theme} value={null} onChange={() => {}} />
      ))}
    </div>
  ),
};

function UsageExamples() {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Şehir seçimi</h3>
      <p style={{ color: '#6F7E90' }}>
        Tekli seçim varsayılandır; <code>multiple</code> ile çoklu seçime, <code>showChips</code> ile seçili
        değerlerin chip olarak gösterimine geçilir. <code>mode</code> ile açılan listenin nasıl render edileceği
        (tetikleyicinin altında/modal/inline) belirlenir.
      </p>
      <CodeBlock
        tabs={(['web', 'native'] as const).map((platform) => ({
          label: platform === 'web' ? 'React (Web)' : 'React Native',
          language: 'tsx',
          code: `import { useState } from 'react';
import { Dropdown } from '@iammuhammedyazici/tatilbudur-design-system/${platform}';

const cities = [
  { id: 'ist', label: 'İstanbul', value: 'ist' },
  { id: 'ank', label: 'Ankara', value: 'ank' },
];

export function CitySelect() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Dropdown
      items={cities}
      value={value}
      onChange={setValue}
      placeholder="Şehir seçin"
      searchable
      mode="modal"
    />
  );
}
// multiple + showChips ile çoklu seçim; theme ile 7 varyanttan biri seçilir.
// clearable seçim temizleme × butonu ekler; loading yükleniyor göstergesi gösterir.`,
        }))}
      />
    </div>
  );
}
