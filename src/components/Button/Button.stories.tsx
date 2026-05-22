import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, fn } from 'storybook/test';
import { Button } from './Button.web';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
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
const ArrowRight = ({ size = 16 }: { size?: number }) => (
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
          <div style={{ display: 'flex', gap: 12, marginBottom: 8, alignItems: 'center' }}>
            <span style={{ width: 80, fontSize: 12, color: '#9CA3AF' }}>Default</span>
            <Button buttonStyle={buttonStyle} variant={variant} size={size}>Button</Button>
            <Button buttonStyle={buttonStyle} variant={variant} size={size} leftIcon={<ArrowRight />}>Button</Button>
            <Button buttonStyle={buttonStyle} variant={variant} size={size} rightIcon={<ArrowRight />}>Button</Button>
            <Button buttonStyle={buttonStyle} variant={variant} size={size} leftIcon={<ArrowRight />} iconOnly />
          </div>

          {/* Disabled row */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ width: 80, fontSize: 12, color: '#9CA3AF' }}>Disabled</span>
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

// ============ INTERACTION TESTS ============
export const ClickInteraction: Story = {
  args: {
    children: 'Test Click',
    onPress: fn(),
    testID: 'click-btn',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
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
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('disabled-btn');

    await userEvent.click(button);
    await expect(args.onPress).not.toHaveBeenCalled();
  },
};
