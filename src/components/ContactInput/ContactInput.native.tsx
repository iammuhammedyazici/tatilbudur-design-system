import { forwardRef, useEffect } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Input } from '../Input/Input.native';
import type { NativeInputProps } from '../Input/Input.native';
import { inputTokens as tokens } from '../Input/Input.tokens';
import type { ContactInputProps } from './ContactInput.types';
import { useContactInput } from './useContactInput';
import Svg, { Path } from 'react-native-svg';

export interface NativeContactInputProps
  extends ContactInputProps,
    Omit<NativeInputProps, keyof ContactInputProps | 'type' | 'prefix'> {}

export const ContactInput = forwardRef<
  TextInput,
  NativeContactInputProps
>(function ContactInput(
  {
    value,
    defaultValue,
    onChangeText,
    onModeChange,
    onCallingCodeChange,
    forcedMode,
    defaultCountry,
    label,
    placeholder,
    disabled,
    readOnly,
    editable,
    ...props
  },
  ref
) {
  const state = useContactInput({
    value,
    defaultValue,
    onChangeText,
    onModeChange,
    onCallingCodeChange,
    forcedMode,
    defaultCountry,
  });
  const locked = disabled || readOnly || editable === false;
  const pickerOpen = state.pickerVisible && state.isPhoneMode && !locked;
  useEffect(() => {
    if (locked || !state.isPhoneMode) state.setPickerVisible(false);
  }, [locked, state.isPhoneMode, state.setPickerVisible]);

  return (
    <>
      <Input
        {...props}
        ref={ref}
        label={label ?? state.label}
        placeholder={placeholder ?? state.placeholder}
        value={state.value}
        onChangeText={state.changeText}
        disabled={disabled}
        readOnly={readOnly}
        editable={editable}
        keyboardType={
          props.keyboardType ??
          (forcedMode === 'phone'
            ? 'phone-pad'
            : forcedMode === 'email'
            ? 'email-address'
            : 'default')
        }
        autoCapitalize={props.autoCapitalize ?? 'none'}
        autoCorrect={props.autoCorrect ?? false}
        prefix={
          state.isPhoneMode ? (
            <View style={styles.prefix}>
              <Pressable
                style={styles.countryButton}
                disabled={locked}
                onPress={state.openPicker}
                accessibilityRole="button"
                accessibilityLabel={`Ülke seç: ${state.country.name} (${state.country.callingCode})`}
                accessibilityState={{ disabled: locked, expanded: pickerOpen }}
                testID={props.testID && `${props.testID}-country-button`}
              >
                <Text style={styles.flag}>{state.country.flag}</Text>
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <Path
                    d="m4 6 4 4 4-4"
                    stroke={tokens.text}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </Pressable>
              <View style={styles.divider} />
              <Text style={styles.code}>{state.country.callingCode}</Text>
            </View>
          ) : undefined
        }
      />
      <Modal
        transparent
        visible={pickerOpen}
        animationType="slide"
        onRequestClose={() => state.setPickerVisible(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            accessible={false}
            onPress={() => state.setPickerVisible(false)}
          />
          <View style={styles.sheet} accessibilityViewIsModal>
            <View style={styles.header}>
              <Text accessibilityRole="header" style={styles.title}>
                Ülke Seç
              </Text>
              <Pressable
                style={styles.close}
                accessibilityRole="button"
                accessibilityLabel="Ülke seçimini kapat"
                onPress={() => state.setPickerVisible(false)}
              >
                <Text style={{ color: tokens.text, fontSize: 24 }}>×</Text>
              </Pressable>
            </View>
            <Input
              containerStyle={{ marginHorizontal: 16, marginBottom: 12 }}
              accessibilityLabel="Ülke ara"
              placeholder="Ülke adı veya telefon kodu"
              value={state.search}
              onChangeText={state.setSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <FlatList
              data={state.filteredCountries}
              keyExtractor={(item) => item.code}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.empty}>Ülke bulunamadı</Text>
              }
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${item.name} ${item.callingCode}`}
                  accessibilityState={{
                    selected: state.country.code === item.code,
                  }}
                  style={[
                    styles.row,
                    state.country.code === item.code && {
                      backgroundColor: '#EDF4FE',
                    },
                  ]}
                  onPress={() => state.selectCountry(item)}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.code}>{item.callingCode}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginRight: -6,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
  },
  flag: { fontSize: 20 },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: tokens.border,
    marginHorizontal: 8,
  },
  code: { fontSize: 14, fontFamily: tokens.fontRegular, color: tokens.text },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(20,26,36,0.4)',
  },
  sheet: {
    height: '55%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: { fontFamily: tokens.fontMedium, fontSize: 16, color: tokens.text },
  close: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F6FA',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F3',
  },
  countryName: {
    flex: 1,
    fontFamily: tokens.fontRegular,
    fontSize: 14,
    color: tokens.text,
  },
  empty: {
    padding: 24,
    textAlign: 'center',
    fontFamily: tokens.fontRegular,
    color: tokens.text,
  },
});
