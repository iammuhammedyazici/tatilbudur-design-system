import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
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
      render(
        <Input
          onChangeText={handleChange}
          readOnly
          value="locked"
          testID="input"
        />
      );

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
        <Input status="error" helperText="Error message" placeholder="..." />
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

describe('TBTextInput behavior', () => {
  it('associates label and required state with the real input', () => {
    render(<Input label="Ad" required />);
    const input = screen.getByRole('textbox', { name: 'Ad' });
    expect(input).toBeRequired();
    expect(input).toBeInvalid();
  });

  it('prioritizes error over helper text and describes the invalid field', () => {
    render(
      <Input
        label="E-posta"
        error="Geçersiz adres"
        helperText="Yardım"
        testID="email"
      />
    );
    const input = screen.getByLabelText('E-posta');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Geçersiz adres');
    expect(screen.getByRole('alert')).toHaveAttribute(
      'data-testid',
      'email-error'
    );
    expect(screen.queryByText('Yardım')).not.toBeInTheDocument();
  });

  it('shows the password action only for a non-empty uncontrolled value', async () => {
    const user = userEvent.setup();
    render(<Input type="password" label="Şifre" />);
    const input = screen.getByLabelText('Şifre');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    await user.type(input, 'gizli');
    await user.click(screen.getByRole('button', { name: 'Şifreyi göster' }));
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('gizli');
    await user.click(screen.getByRole('button', { name: 'Şifreyi gizle' }));
    expect(input).toHaveAttribute('type', 'password');
    await user.clear(input);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('responds to controlled password changes without changing the supplied value', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Input type="password" label="Şifre" value="ilk" />
    );
    await user.click(screen.getByRole('button', { name: 'Şifreyi göster' }));
    rerender(<Input type="password" label="Şifre" value="yeni" />);
    expect(screen.getByLabelText('Şifre')).toHaveValue('yeni');
    rerender(<Input type="password" label="Şifre" value="" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('uses the custom right action instead of the automatic password action', async () => {
    const action = vi.fn();
    render(
      <Input
        type="password"
        label="Şifre"
        defaultValue="gizli"
        rightIcon={<span>→</span>}
        onRightIconPress={action}
        rightIconAccessibilityLabel="Devam et"
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Devam et' }));
    expect(action).toHaveBeenCalledOnce();
    expect(screen.getByLabelText('Şifre')).toHaveAttribute('type', 'password');
  });

  it('does not invoke the right action or accept typing when editable is false', async () => {
    const action = vi.fn();
    const change = vi.fn();
    render(
      <Input
        label="Ad"
        editable={false}
        onChangeText={change}
        rightIcon={<span>→</span>}
        onRightIconPress={action}
        rightIconAccessibilityLabel="Devam"
      />
    );
    await userEvent.type(screen.getByLabelText('Ad'), 'Deniz');
    await userEvent.click(screen.getByRole('button', { name: 'Devam' }));
    expect(change).not.toHaveBeenCalled();
    expect(action).not.toHaveBeenCalled();
  });

  it('filters pasted TC text, preserves leading zero, and caps at 11 digits', () => {
    const change = vi.fn();
    render(
      <Input label="Kimlik" type="tc" maxLength={20} onChangeText={change} />
    );
    const input = screen.getByLabelText('Kimlik');
    fireEvent.change(input, { target: { value: 'ab01 234-567890123' } });
    expect(input).toHaveValue('01234567890');
    expect(change).toHaveBeenLastCalledWith('01234567890');
    expect(input).toHaveAttribute('maxlength', '11');
    expect(input).toHaveAttribute('inputmode', 'numeric');
  });

  it('respects maxLength for ordinary text', async () => {
    render(<Input label="Kod" maxLength={3} />);
    await userEvent.type(screen.getByLabelText('Kod'), 'ABCDE');
    expect(screen.getByLabelText('Kod')).toHaveValue('ABC');
  });

  it('forwards ref, focus/blur callbacks, and form attributes', async () => {
    const ref = createRef<HTMLInputElement>();
    const focus = vi.fn();
    const blur = vi.fn();
    render(
      <Input
        ref={ref}
        label="Ad"
        name="firstName"
        autoComplete="given-name"
        onFocus={focus}
        onBlur={blur}
      />
    );
    ref.current?.focus();
    expect(screen.getByLabelText('Ad')).toHaveFocus();
    expect(focus).toHaveBeenCalledOnce();
    await userEvent.tab();
    expect(blur).toHaveBeenCalledOnce();
    expect(ref.current).toHaveAttribute('name', 'firstName');
    expect(ref.current).toHaveAttribute('autocomplete', 'given-name');
  });
});
