import type { Meta, StoryObj } from '@storybook/react-vite';
import SvgPlane from '../icons/Plane';

const meta = {
  title: 'Icons/Plane',
  component: SvgPlane,
  tags: ['autodocs'],
  argTypes: {
    width: { control: { type: 'number' } },
    height: { control: { type: 'number' } },
    color: { control: { type: 'color' } },
  },
} satisfies Meta<typeof SvgPlane>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 48,
    height: 48,
    color: '#000000',
  },
};

export const Large: Story = {
  args: {
    width: 96,
    height: 96,
    color: '#FF6B00',
  },
};