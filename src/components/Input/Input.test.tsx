import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input.web';

describe('Input', () => {
  describe('Rendering', () => {
    it('renders with placeholder', () => {
      render(<Input placeholder="Type here" />);
      expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Input label="Email" placeholder="..." />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders helper text when provided', () => {
      render(<Input helperText="This is a hint" placeholder="..." />);
      expect(screen.getByText('This is a hint')).toBeInTheDocument();
    });

    it('renders required asterisk when required', () => {
      render(<Input label="Name" required placeholder="..." />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders left icon when provided', () => {
      render(
        <Input
          placeholder="search"
          leftIcon={<span data-testid="left-icon">🔍</span>}
        />
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders right icon when provided', () => {
      render(
        <Input
          placeholder="search"
          rightIcon={<span data-testid="right-icon">❌</span>}
        />
      );
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onChangeText when typing', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input onChangeText={handleChange} testID="input" />);

      await user.type(screen.getByTestId('input'), 'hello');
      expect(handleChange).toHaveBeenCalled();
      expect(handleChange).toHaveBeenCalledTimes(5);
    });

    it('does not allow typing when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input onChangeText={handleChange} disabled testID="input" />);

      await user.type(screen.getByTestId('input'), 'hello');
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not allow typing when readOnly', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input onChangeText={handleChange} readOnly value="locked" testID="input" />);

      await user.type(screen.getByTestId('input'), 'hello');
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('reflects controlled value', () => {
      render(<Input value="Antalya" testID="input" />);
      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe('Antalya');
    });
  });

  describe('States', () => {
    it('disables input when disabled prop is true', () => {
      render(<Input disabled testID="input" />);
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('marks input as readonly when readOnly is true', () => {
      render(<Input readOnly testID="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('readonly');
    });

    it('shows error helper text with error status', () => {
      render(
        <Input
          status="error"
          helperText="Error message"
          placeholder="..."
        />
      );
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('shows success helper text with success status', () => {
      render(
        <Input
          status="success"
          helperText="Success message"
          placeholder="..."
        />
      );
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
  });

  describe('Types', () => {
    const types = ['text', 'email', 'password', 'number', 'tel'] as const;
    types.forEach((type) => {
      it(`renders ${type} type`, () => {
        render(<Input type={type} testID={`input-${type}`} />);
        const input = screen.getByTestId(`input-${type}`);
        expect(input).toHaveAttribute('type', type);
      });
    });
  });

  describe('Sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach((size) => {
      it(`renders ${size} size`, () => {
        render(<Input size={size} testID={`input-${size}`} />);
        expect(screen.getByTestId(`input-${size}`)).toBeInTheDocument();
      });
    });
  });
});
