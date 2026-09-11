import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactInput } from './ContactInput.web';
import { contactCountries } from './countries';

const label = 'E-posta adresi veya telefon numarası';
describe('ContactInput', () => {
  it('switches after six digits, stays on shorter numbers, and resets on text or clearing', async () => {
    const mode = vi.fn();
    const change = vi.fn();
    render(<ContactInput onModeChange={mode} onChangeText={change} />);
    const input = screen.getByLabelText(label);
    await userEvent.type(input, '53212');
    expect(
      screen.queryByRole('button', { name: /Ülke seç/ })
    ).not.toBeInTheDocument();
    await userEvent.type(input, '3');
    expect(
      screen.getByRole('button', { name: /Ülke seç/ })
    ).toBeInTheDocument();
    expect(mode).toHaveBeenLastCalledWith(true);
    await userEvent.type(input, '{backspace}');
    expect(
      screen.getByRole('button', { name: /Ülke seç/ })
    ).toBeInTheDocument();
    await userEvent.type(input, '@example.com');
    expect(
      screen.queryByRole('button', { name: /Ülke seç/ })
    ).not.toBeInTheDocument();
    expect(input).toHaveValue('53212@example.com');
    expect(change).toHaveBeenLastCalledWith('53212@example.com');
    expect(mode).toHaveBeenLastCalledWith(false);
    await userEvent.clear(input);
    await userEvent.type(input, '53212');
    expect(
      screen.queryByRole('button', { name: /Ülke seç/ })
    ).not.toBeInTheDocument();
  });

  it('detects prefilled controlled values and responds to external resets', () => {
    const code = vi.fn();
    const { rerender } = render(
      <ContactInput value="5321234567" onCallingCodeChange={code} />
    );
    expect(screen.getByLabelText(label)).toHaveValue('5321234567');
    expect(screen.getByRole('button', { name: /Ülke seç/ })).toHaveTextContent(
      '🇹🇷'
    );
    expect(code).toHaveBeenLastCalledWith('+90');
    rerender(<ContactInput value="" onCallingCodeChange={code} />);
    expect(
      screen.queryByRole('button', { name: /Ülke seç/ })
    ).not.toBeInTheDocument();
    rerender(<ContactInput value="12345" onCallingCodeChange={code} />);
    expect(
      screen.queryByRole('button', { name: /Ülke seç/ })
    ).not.toBeInTheDocument();
  });

  it('updates forced mode at runtime without replacing entered text', () => {
    const mode = vi.fn();
    const { rerender } = render(
      <ContactInput value="123456" forcedMode="email" onModeChange={mode} />
    );
    expect(
      screen.queryByRole('button', { name: /Ülke seç/ })
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('E-posta adresi')).toHaveAttribute(
      'inputmode',
      'email'
    );
    rerender(
      <ContactInput value="123456" forcedMode="phone" onModeChange={mode} />
    );
    expect(
      screen.getByRole('button', { name: /Ülke seç/ })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Telefon numarası')).toHaveValue('123456');
    expect(screen.getByLabelText('Telefon numarası')).toHaveAttribute(
      'inputmode',
      'tel'
    );
    expect(mode).toHaveBeenLastCalledWith(true);
  });

  it('supports controlled typing without adding a country prefix to the value', async () => {
    function Form() {
      const [value, setValue] = useState('');
      return <ContactInput value={value} onChangeText={setValue} />;
    }
    render(<Form />);
    await userEvent.type(screen.getByLabelText(label), '5321234567');
    expect(screen.getByLabelText(label)).toHaveValue('5321234567');
    expect(screen.getByText('+90')).toBeInTheDocument();
    expect(screen.getByLabelText(label)).toHaveAttribute('inputmode', 'text');
  });

  it.each([{ disabled: true }, { readOnly: true }, { editable: false }])(
    'locks both country picker and text for %j',
    async (props) => {
      const change = vi.fn();
      render(
        <ContactInput
          {...props}
          defaultValue="5321234567"
          onChangeText={change}
        />
      );
      expect(screen.getByRole('button', { name: /Ülke seç/ })).toBeDisabled();
      await userEvent.type(screen.getByLabelText(label), 'x');
      expect(change).not.toHaveBeenCalled();
    }
  );

  it('forwards form attributes, errors and ref to the actual input', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <ContactInput
        ref={ref}
        name="contact"
        autoComplete="username"
        error="Geçersiz iletişim bilgisi"
      />
    );
    expect(ref.current).toBe(screen.getByLabelText(label));
    expect(ref.current).toHaveAttribute('name', 'contact');
    expect(ref.current).toHaveAttribute('autocomplete', 'username');
    expect(ref.current).toHaveAccessibleDescription(
      'Geçersiz iletişim bilgisi'
    );
    expect(ref.current).toHaveAttribute('aria-invalid', 'true');
  });

  it('preserves pasted email text including numeric prefixes', () => {
    render(<ContactInput />);
    fireEvent.change(screen.getByLabelText(label), {
      target: { value: '123456@example.com' },
    });
    expect(screen.getByLabelText(label)).toHaveValue('123456@example.com');
    expect(
      screen.queryByRole('button', { name: /Ülke seç/ })
    ).not.toBeInTheDocument();
  });

  it('does not repeat mode notifications when a parent recreates its callbacks', () => {
    const mode = vi.fn();
    const code = vi.fn();
    const { rerender } = render(
      <ContactInput
        value=""
        onModeChange={mode}
        onCallingCodeChange={code}
      />
    );
    rerender(
      <ContactInput
        value=""
        onModeChange={(phone) => mode(phone)}
        onCallingCodeChange={(callingCode) => code(callingCode)}
      />
    );
    expect(mode).toHaveBeenCalledTimes(1);
    expect(code).toHaveBeenCalledTimes(1);
    rerender(
      <ContactInput
        value="532123"
        onModeChange={(phone) => mode(phone)}
        onCallingCodeChange={(callingCode) => code(callingCode)}
      />
    );
    expect(mode).toHaveBeenCalledTimes(2);
    expect(mode).toHaveBeenLastCalledWith(true);
    expect(code).toHaveBeenCalledTimes(1);
  });

  it('includes unique countries with usable calling codes and localized search names', () => {
    expect(new Set(contactCountries.map((country) => country.code)).size).toBe(
      contactCountries.length
    );
    expect(
      contactCountries.find((country) => country.code === 'TR')
    ).toMatchObject({ callingCode: '+90' });
    expect(
      contactCountries.find((country) => country.code === 'DE')
    ).toMatchObject({ callingCode: '+49', name: 'Almanya' });
    expect(
      contactCountries.every((country) => /^\+\d+$/.test(country.callingCode))
    ).toBe(true);
    expect(
      contactCountries.find((country) => country.code === 'VA')?.callingCode
    ).toBe('+39');
    expect(
      contactCountries.find((country) => country.code === 'EH')?.callingCode
    ).toBe('+212');
    expect(
      contactCountries.find((country) => country.code === 'UM')
    ).toBeUndefined();
  });
});
