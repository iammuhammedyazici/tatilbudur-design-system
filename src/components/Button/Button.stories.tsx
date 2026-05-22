import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button.web';
import { expect, userEvent, within, fn } from 'storybook/test';
import { CodeBlock } from '../../stories/CodeBlock';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'TatilBudur Design System Button. 5 variants, 3 sizes, loading + disabled states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

// ============ Single variants ============
export const Primary: Story = {
  args: {
    children: 'Otel Ara',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Otelleri İncele',
    variant: 'secondary',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    children: 'Rezervasyonlarım',
    variant: 'outline',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Giriş Yapın',
    variant: 'ghost',
    size: 'md',
  },
};

export const Danger: Story = {
  args: {
    children: 'İptal Et',
    variant: 'danger',
    size: 'md',
  },
};

// ============ Sizes ============
export const Small: Story = {
  args: { children: 'Filtrele', variant: 'primary', size: 'sm' },
};

export const Medium: Story = {
  args: { children: 'Otel Ara', variant: 'primary', size: 'md' },
};

export const Large: Story = {
  args: { children: 'Rezervasyon Yap', variant: 'primary', size: 'lg' },
};

// ============ States ============
export const Loading: Story = {
  args: { children: 'Yükleniyor...', variant: 'primary', loading: true },
};

export const Disabled: Story = {
  args: { children: 'Devre Dışı', variant: 'primary', disabled: true },
};

export const FullWidth: Story = {
  args: { children: 'Tam Genişlik', variant: 'primary', fullWidth: true },
  parameters: { layout: 'padded' },
};

// ============ All variants showcase ============
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  ),
};

// ============ Interaction tests ============
export const ClickInteraction: Story = {
  args: {
    children: 'Test Click',
    variant: 'primary',
    onPress: fn(),
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /test click/i });

    await step('Butona tıklanır', async () => {
      await userEvent.click(button);
    });

    await step('onPress 1 kez çağrılır', async () => {
      await expect(args.onPress).toHaveBeenCalledTimes(1);
    });
  },
};

export const DisabledNoClick: Story = {
  args: {
    children: 'Disabled Click',
    variant: 'primary',
    disabled: true,
    onPress: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await expect(args.onPress).not.toHaveBeenCalled();
  },
};

export const LoadingShowsSpinner: Story = {
  args: {
    children: 'Loading Test',
    variant: 'primary',
    loading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // Loading'de button disabled
    await expect(button).toBeDisabled();

    // Loading text gizli
    await expect(canvas.queryByText('Loading Test')).not.toBeInTheDocument();
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

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Button variant="primary">Otel Ara</Button>
        <Button variant="outline">İptal</Button>
        <Button variant="primary" loading>Yükleniyor</Button>
      </div>

      <CodeBlock
        tabs={[
          {
            label: 'React (Web)',
            language: 'tsx',
            code: `import { Button } from '@iammuhammedyazici/tatilbudur-design-system';

export const Example = () => {
  return (
    <>
      <Button variant="primary" onPress={() => console.log('clicked')}>
        Otel Ara
      </Button>

      <Button variant="outline">
        İptal
      </Button>

      <Button variant="primary" loading>
        Yükleniyor
      </Button>
    </>
  );
};`,
          },
          {
            label: 'React Native',
            language: 'tsx',
            code: `import { Button } from '@iammuhammedyazici/tatilbudur-design-system/native';

export const Example = () => {
  return (
    <>
      <Button variant="primary" onPress={() => console.log('clicked')}>
        Otel Ara
      </Button>

      <Button variant="outline">
        İptal
      </Button>

      <Button variant="primary" loading>
        Yükleniyor
      </Button>
    </>
  );
};`,
          },
          {
            label: 'HTML/CSS',
            language: 'html',
            code: `<!-- Primary Button -->
<button
  style="
    background: #1D4ED8;
    color: white;
    border: none;
    border-radius: 999px;
    padding: 12px 20px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    min-height: 40px;
  "
>
  Otel Ara
</button>

<!-- Outline Button -->
<button
  style="
    background: white;
    color: #1D4ED8;
    border: 1.5px solid #1D4ED8;
    border-radius: 999px;
    padding: 12px 20px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  "
>
  İptal
</button>`,
          },
          {
            label: 'Tüm Props',
            language: 'tsx',
            code: `<Button
  variant="primary"        // primary | secondary | outline | ghost | danger
  size="md"                // sm | md | lg
  onPress={() => {}}       // Click handler
  disabled={false}         // Devre dışı
  loading={false}          // Spinner gösterir
  fullWidth={false}        // Tam genişlik
  leftIcon={<Icon />}      // Sol ikon
  rightIcon={<Icon />}     // Sağ ikon
  testID="my-button"       // Test için
>
  Buton Metni
</Button>`,
          },
        ]}
      />
    </div>
  ),
};