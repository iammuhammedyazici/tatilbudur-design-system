import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, fn } from 'storybook/test';
import { Button as WebButton } from './Button.web';
import { Button as NativeButton } from './Button.native';
import type { ButtonProps } from './Button.types';
import Svg, { Path } from 'react-native-svg';
import { CompareDecorator, usePreviewPlatform } from '../../stories/CompareDecorator';
import { CodeBlock } from '../../stories/CodeBlock';

const Button = (props: ButtonProps) => {
  const platform = usePreviewPlatform();
  return platform === 'native'
    ? <NativeButton {...props} textStyle={[{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: '500' }, props.textStyle]} />
    : <WebButton {...props} />;
};

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: WebButton,
  render: (args) => <Button {...args} />,
  decorators: [CompareDecorator],
  parameters: {
    layout: 'padded',
    usage: UsageExamples,
    docs: {
      description: {
        component:
          'TatilBudur Button. 4 style × 3 variant × 3 size × 4 icon layout = 144 kombinasyon.',
      },
    },
  },
  argTypes: {
    buttonStyle: {
      control: 'select',
      options: ['filled', 'outline', 'ghost', 'link'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

// ============ Helper: Basit ok ikonu ============
const ArrowRight = ({ size = 16 }: { size?: number }) => {
  const platform = usePreviewPlatform();
  if (platform === 'native') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  return (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14m0 0l-6-6m6 6l-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  );
};

// ============ DEFAULT (Playground) ============
export const Playground: Story = {
  args: {
    children: 'Button',
    buttonStyle: 'filled',
    variant: 'primary',
    size: 'md',
  },
};

// ============ FILLED VARIANTS ============
export const FilledPrimary: Story = {
  args: { children: 'Button', buttonStyle: 'filled', variant: 'primary' },
};

export const FilledSecondary: Story = {
  args: { children: 'Button', buttonStyle: 'filled', variant: 'secondary' },
};

export const FilledTertiary: Story = {
  args: { children: 'Button', buttonStyle: 'filled', variant: 'tertiary' },
};

// ============ OUTLINE VARIANTS ============
export const OutlinePrimary: Story = {
  args: { children: 'Button', buttonStyle: 'outline', variant: 'primary' },
};

export const OutlineSecondary: Story = {
  args: { children: 'Button', buttonStyle: 'outline', variant: 'secondary' },
};

export const OutlineTertiary: Story = {
  args: { children: 'Button', buttonStyle: 'outline', variant: 'tertiary' },
};

// ============ GHOST VARIANTS ============
export const GhostPrimary: Story = {
  args: { children: 'Button', buttonStyle: 'ghost', variant: 'primary' },
};

export const GhostSecondary: Story = {
  args: { children: 'Button', buttonStyle: 'ghost', variant: 'secondary' },
};

export const GhostTertiary: Story = {
  args: { children: 'Button', buttonStyle: 'ghost', variant: 'tertiary' },
};

// ============ LINK VARIANTS ============
export const LinkPrimary: Story = {
  args: { children: 'Button', buttonStyle: 'link', variant: 'primary' },
};

export const LinkSecondary: Story = {
  args: { children: 'Button', buttonStyle: 'link', variant: 'secondary' },
};

export const LinkTertiary: Story = {
  args: { children: 'Button', buttonStyle: 'link', variant: 'tertiary' },
};

// ============ ICON LAYOUTS ============
export const WithLeftIcon: Story = {
  args: {
    children: 'Button',
    leftIcon: <ArrowRight />,
    buttonStyle: 'filled',
    variant: 'primary',
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Button',
    rightIcon: <ArrowRight />,
    buttonStyle: 'filled',
    variant: 'primary',
  },
};

export const IconOnly: Story = {
  args: {
    leftIcon: <ArrowRight />,
    iconOnly: true,
    buttonStyle: 'filled',
    variant: 'primary',
  },
};

// ============ STATES ============
export const Disabled: Story = {
  args: { children: 'Button', disabled: true },
};

export const Loading: Story = {
  args: { children: 'Loading', loading: true },
};

export const FullWidth: Story = {
  args: { children: 'Tam Genişlik', fullWidth: true },
  parameters: { layout: 'padded' },
};

// ============ FULL MATRIX (Figma'ya tıpatıp aynı) ============
const StyleSection: React.FC<{
  title: string;
  buttonStyle: 'filled' | 'outline' | 'ghost' | 'link';
  variant: 'primary' | 'secondary' | 'tertiary';
}> = ({ title, buttonStyle, variant }) => {
  const native = usePreviewPlatform() === 'native';
  const sizes: Array<'lg' | 'md' | 'sm'> = ['lg', 'md', 'sm'];
  const sizeLabels = { lg: 'Large', md: 'Medium', sm: 'Small' };

  return (
    <div style={{ marginBottom: 48 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1F2937' }}>
        /{title.toUpperCase()}
      </h3>

      {sizes.map((size) => (
        <div key={size} style={{ marginBottom: 24 }}>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#6B7280' }}>{sizeLabels[size]}</p>

          {/* Default row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8, alignItems: 'center' }}>
            <span style={{ width: native ? '100%' : 80, fontSize: 12, color: '#9CA3AF' }}>Default</span>
            <Button buttonStyle={buttonStyle} variant={variant} size={size}>Button</Button>
            <Button buttonStyle={buttonStyle} variant={variant} size={size} leftIcon={<ArrowRight />}>Button</Button>
            <Button buttonStyle={buttonStyle} variant={variant} size={size} rightIcon={<ArrowRight />}>Button</Button>
            <Button buttonStyle={buttonStyle} variant={variant} size={size} leftIcon={<ArrowRight />} iconOnly />
          </div>

          {/* Disabled row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <span style={{ width: native ? '100%' : 80, fontSize: 12, color: '#9CA3AF' }}>Disabled</span>
            <Button buttonStyle={buttonStyle} variant={variant} size={size} disabled>Button</Button>
            <Button buttonStyle={buttonStyle} variant={variant} size={size} disabled leftIcon={<ArrowRight />}>Button</Button>
            <Button buttonStyle={buttonStyle} variant={variant} size={size} disabled rightIcon={<ArrowRight />}>Button</Button>
            <Button buttonStyle={buttonStyle} variant={variant} size={size} disabled leftIcon={<ArrowRight />} iconOnly />
          </div>
        </div>
      ))}
    </div>
  );
};

export const FilledMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div>
      <StyleSection title="filled/primary" buttonStyle="filled" variant="primary" />
      <StyleSection title="filled/secondary" buttonStyle="filled" variant="secondary" />
      <StyleSection title="filled/tertiary" buttonStyle="filled" variant="tertiary" />
    </div>
  ),
};

export const OutlineMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div>
      <StyleSection title="outline/primary" buttonStyle="outline" variant="primary" />
      <StyleSection title="outline/secondary" buttonStyle="outline" variant="secondary" />
      <StyleSection title="outline/tertiary" buttonStyle="outline" variant="tertiary" />
    </div>
  ),
};

export const GhostMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div>
      <StyleSection title="ghost/primary" buttonStyle="ghost" variant="primary" />
      <StyleSection title="ghost/secondary" buttonStyle="ghost" variant="secondary" />
      <StyleSection title="ghost/tertiary" buttonStyle="ghost" variant="tertiary" />
    </div>
  ),
};

export const LinkMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div>
      <StyleSection title="link/primary" buttonStyle="link" variant="primary" />
      <StyleSection title="link/secondary" buttonStyle="link" variant="secondary" />
      <StyleSection title="link/tertiary" buttonStyle="link" variant="tertiary" />
    </div>
  ),
};

// ============ Code Examples ============
function UsageExamples() {
  return (
    <div style={{ maxWidth: 800 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 600 }}>
        Kullanım Örnekleri
      </h3>
      <p style={{ margin: '0 0 8px', color: '#6B7280', fontSize: 14 }}>
        Aşağıdaki kodu kopyalayıp projenize yapıştırabilirsiniz.
      </p>
      <p style={{ margin: '0 0 16px', color: '#9CA3AF', fontSize: 12, maxWidth: 640 }}>
        Not (Migration Mapping): Secondary (pembe) varyant yalnızca Faz 2&apos;de ve tasarım
        ekibinin özel talebiyle kullanılmalı — mevcut ikincil aksiyonlar Faz 1&apos;de Primary
        ile gösterilmeye devam eder. Ghost varyantın TatilBudur ürünlerinde henüz karşılığı
        yok; sadece tasarım ekibinin yeni ekranlarda onayladığı senaryolarda uygulanmalı.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <Button buttonStyle="filled" variant="primary" size="lg">Rez Yap</Button>
        <Button buttonStyle="outline" variant="primary" size="lg">Oteli İncele</Button>
        <Button buttonStyle="link" variant="primary">Devamını Oku</Button>
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
      {/* Ana aksiyon (CTA) — Primary CTA Rules */}
      <Button buttonStyle="filled" variant="primary" size="lg" onPress={() => {}}>
        Rez Yap
      </Button>

      {/* Primary'ye yakın, daha düşük vurgu — Outlined CTA Rules */}
      <Button buttonStyle="outline" variant="primary" size="lg" onPress={() => {}}>
        Oteli İncele
      </Button>

      {/* Metin bazlı yönlendirme — Link CTA Rules */}
      <Button buttonStyle="link" variant="primary" onPress={() => {}}>
        Devamını Oku
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
      <Button buttonStyle="filled" variant="primary" size="lg" onPress={() => {}}>
        Rez Yap
      </Button>

      <Button buttonStyle="outline" variant="primary" size="lg" onPress={() => {}}>
        Oteli İncele
      </Button>

      <Button buttonStyle="link" variant="primary" onPress={() => {}}>
        Devamını Oku
      </Button>
    </>
  );
};`,
          },
          {
            label: 'HTML/CSS',
            language: 'html',
            code: `<!-- Filled / Primary / Large -->
<button
  style="
    height: 48px;
    padding: 0 24px;
    background: #004CAA;
    color: #FFFFFF;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  "
>
  Rez Yap
</button>

<!-- Outline / Primary / Large -->
<button
  style="
    height: 48px;
    padding: 0 24px;
    background: transparent;
    color: #004CAA;
    border: 1.5px solid #004CAA;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  "
>
  Oteli İncele
</button>

<!-- Link / Primary -->
<button
  style="
    background: transparent;
    color: #004CAA;
    border: none;
    text-decoration: underline;
    text-underline-offset: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  "
>
  Devamını Oku
</button>`,
          },
          {
            label: 'Tüm Props',
            language: 'tsx',
            code: `<Button
  children="Rez Yap"          // Buton içeriği
  buttonStyle="filled"        // filled | outline | ghost | link
  variant="primary"           // primary | secondary | tertiary
  size="lg"                   // sm (32px) | md (40px) | lg (48px)
  onPress={() => {}}          // Tıklama handler
  disabled={false}            // Devre dışı
  loading={false}             // Yükleniyor (spinner)
  fullWidth={false}           // Tam genişlik
  leftIcon={<Icon />}         // Sol ikon
  rightIcon={<Icon />}        // Sağ ikon
  iconOnly={false}            // Sadece ikon (kare buton)
  testID="my-button"          // Test için
/>`,
          },
        ]}
      />
    </div>
  );
}

// ============ INTERACTION TESTS ============
export const ClickInteraction: Story = {
  args: {
    children: 'Test Click',
    onPress: fn(),
    testID: 'click-btn',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(within(canvasElement).getByRole('region', { name: 'Web önizlemesi' }));
    const button = canvas.getByTestId('click-btn');

    await userEvent.click(button);
    await expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};

export const DisabledNoClick: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
    onPress: fn(),
    testID: 'disabled-btn',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(within(canvasElement).getByRole('region', { name: 'Web önizlemesi' }));
    const button = canvas.getByTestId('disabled-btn');

    await userEvent.click(button);
    await expect(args.onPress).not.toHaveBeenCalled();
  },
};
