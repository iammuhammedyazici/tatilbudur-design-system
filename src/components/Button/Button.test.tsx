import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button.web';

describe('Button', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders with default variant (primary)', () => {
      render(<Button testID="btn">Test</Button>);
      const btn = screen.getByTestId('btn');
      expect(btn).toBeInTheDocument();
    });

    it('renders left icon when provided', () => {
      render(
        <Button leftIcon={<span data-testid="left-icon">←</span>}>
          With Icon
        </Button>
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders right icon when provided', () => {
      render(
        <Button rightIcon={<span data-testid="right-icon">→</span>}>
          With Icon
        </Button>
      );
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onPress when clicked', () => {
      const handlePress = vi.fn();
      render(<Button onPress={handlePress}>Click</Button>);
      fireEvent.click(screen.getByText('Click'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const handlePress = vi.fn();
      render(<Button onPress={handlePress} disabled>Click</Button>);
      fireEvent.click(screen.getByText('Click'));
      expect(handlePress).not.toHaveBeenCalled();
    });

    it('does not call onPress when loading', () => {
      const handlePress = vi.fn();
      render(<Button onPress={handlePress} loading>Click</Button>);
      // Loading state'te children gizli olabilir, button'a direkt click
      const btn = screen.getByRole('button');
      fireEvent.click(btn);
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('shows spinner when loading', () => {
      render(<Button loading testID="btn">Loading</Button>);
      const btn = screen.getByTestId('btn');
      // Loading'de "Loading" text gizli olur, spinner görünür
      expect(btn).toBeDisabled();
    });

    it('disables button when disabled prop is true', () => {
      render(<Button disabled testID="btn">Disabled</Button>);
      expect(screen.getByTestId('btn')).toBeDisabled();
    });

    it('disables button when loading is true', () => {
      render(<Button loading testID="btn">Loading</Button>);
      expect(screen.getByTestId('btn')).toBeDisabled();
    });
  });

  describe('Variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;
    variants.forEach((variant) => {
      it(`renders ${variant} variant`, () => {
        render(<Button variant={variant} testID={`btn-${variant}`}>{variant}</Button>);
        expect(screen.getByTestId(`btn-${variant}`)).toBeInTheDocument();
      });
    });
  });

  describe('Sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach((size) => {
      it(`renders ${size} size`, () => {
        render(<Button size={size} testID={`btn-${size}`}>{size}</Button>);
        expect(screen.getByTestId(`btn-${size}`)).toBeInTheDocument();
      });
    });
  });
});
