import { forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type {
  KeyboardTypeOptions,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import ErrorIcon from '../../icons/native/Warning';
import EyeIcon from '../../icons/native/Eye';
import EyeOffIcon from '../../icons/native/EyeOff';
import type { InputProps, InputType } from './Input.types';
import { inputHeights, inputTokens as tokens } from './Input.tokens';
import { useInputState } from './useInputState';

export interface NativeInputProps
  extends InputProps,
    Omit<TextInputProps, keyof InputProps | 'secureTextEntry'> {
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  helperTextStyle?: StyleProp<TextStyle>;
}

const keyboardMap: Record<InputType, KeyboardTypeOptions> = {
  text: 'default',
  password: 'default',
  tc: 'number-pad',
  email: 'email-address',
  number: 'numeric',
  tel: 'phone-pad',
};

export const Input = forwardRef<TextInput, NativeInputProps>(function Input(
  {
    type = 'text',
    label,
    error,
    helperText,
    status = 'default',
    size = 'md',
    rightIcon,
    leftIcon,
    onRightIconPress,
    rightIconAccessibilityLabel,
    containerStyle,
    style,
    labelStyle,
    helperTextStyle,
    testID,
    onChangeText,
    maxLength,
    keyboardType,
    value,
    defaultValue,
    disabled = false,
    readOnly = false,
    editable = true,
    fullWidth = false,
    required = false,
    accessibilityLabel,
    accessibilityState,
    ...props
  },
  ref
) {
  const state = useInputState({
    type,
    value,
    defaultValue,
    onChangeText,
    maxLength,
    error,
    helperText,
    status,
  });
  const icon =
    rightIcon ??
    (state.showPasswordIcon ? (
      state.passwordVisible ? (
        <EyeIcon />
      ) : (
        <EyeOffIcon />
      )
    ) : undefined);
  const iconAction =
    onRightIconPress ?? (state.isPassword ? state.togglePassword : undefined);
  const iconLabel =
    rightIconAccessibilityLabel ??
    (state.isPassword
      ? state.passwordVisible
        ? 'Şifreyi gizle'
        : 'Şifreyi göster'
      : 'Alan işlemi');

  return (
    <View
      style={[
        fullWidth && { width: '100%' },
        disabled && { opacity: 0.6 },
        containerStyle,
        styles.container,
      ]}
    >
      {!!label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={{ color: tokens.error }}> *</Text>}
        </Text>
      )}
      <View
        style={[
          styles.box,
          { height: inputHeights[size] },
          status === 'success' && { borderColor: '#10B981' },
          state.hasError && styles.boxError,
        ]}
      >
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <TextInput
          {...props}
          ref={ref}
          testID={testID}
          accessibilityLabel={accessibilityLabel ?? label ?? props.placeholder}
          accessibilityState={{
            ...accessibilityState,
            disabled: disabled || !editable,
          }}
          accessibilityHint={state.error ?? props.accessibilityHint}
          style={[styles.input, style]}
          placeholderTextColor={
            props.placeholderTextColor ?? tokens.placeholder
          }
          keyboardType={
            state.isTc ? 'number-pad' : keyboardType ?? keyboardMap[type]
          }
          secureTextEntry={state.isPassword && !state.passwordVisible}
          maxLength={state.maxLength}
          onChangeText={state.changeText}
          value={state.value}
          editable={!disabled && !readOnly && editable}
          readOnly={readOnly}
        />
        {!!icon &&
          (iconAction ? (
            <TouchableOpacity
              onPress={iconAction}
              disabled={disabled || !editable}
              style={styles.icon}
              accessibilityRole="button"
              accessibilityLabel={iconLabel}
              accessibilityState={{ disabled: disabled || !editable }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID={testID && `${testID}-right-icon`}
            >
              {icon}
            </TouchableOpacity>
          ) : (
            <View style={styles.icon} testID={testID && `${testID}-right-icon`}>
              {icon}
            </View>
          ))}
      </View>
      {!!state.message && (
        <View
          style={styles.messageRow}
          accessibilityLiveRegion={state.hasError ? 'polite' : 'none'}
          testID={state.hasError && testID ? `${testID}-error` : undefined}
        >
          {state.hasError && (
            <ErrorIcon width={12} height={12} color={tokens.error} style={styles.errorIcon} />
          )}
          <Text
            style={[
              styles.message,
              status === 'success' && { color: '#10B981' },
              state.hasError && { color: tokens.error },
              helperTextStyle,
            ]}
          >
            {state.message}
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { gap: tokens.gap },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: tokens.radius,
    borderWidth: tokens.borderWidth,
    borderColor: tokens.border,
    backgroundColor: tokens.background,
    paddingHorizontal: tokens.paddingHorizontal,
    gap: tokens.iconGap,
  },
  boxError: {
    borderColor: tokens.error,
    backgroundColor: tokens.errorBackground,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    padding: 0,
    fontFamily: tokens.fontRegular,
    fontSize: tokens.fontSize,
    color: tokens.text,
  },
  label: {
    fontSize: tokens.fontSize,
    fontFamily: tokens.fontMedium,
    color: tokens.text,
    marginBottom: 2,
  },
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginTop: 4,
  },
  errorIcon: { marginTop: 2 },
  message: {
    flex: 1,
    color: tokens.placeholder,
    fontFamily: tokens.fontRegular,
    fontSize: tokens.helperFontSize,
  },
});
