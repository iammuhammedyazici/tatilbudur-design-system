import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Input } from '../Input/Input.native';
import type { PickerProps } from './Picker.types';
import { usePicker } from './usePicker';

const regularFont =
  Platform.OS === 'web' ? 'Poppins, system-ui, sans-serif' : 'Poppins-Regular';
const mediumFont =
  Platform.OS === 'web' ? 'Poppins, system-ui, sans-serif' : 'Poppins-Medium';

export interface NativePickerProps<
  T extends string | number = string | number
> extends PickerProps<T> {
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputTextStyle?: StyleProp<TextStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}

export function Picker<T extends string | number = string | number>(
  props: NativePickerProps<T>
) {
  const state = usePicker(props);
  const placeholder = props.placeholder ?? 'Seçiniz';
  const title = props.modalTitle ?? props.label ?? 'Seçim Yapın';
  return (
    <View style={props.containerStyle}>
      {!!props.label && (
        <Text style={styles.label}>
          {props.label}
          {props.required && <Text style={{ color: '#D6243B' }}> *</Text>}
        </Text>
      )}
      <Pressable
        onPress={state.open}
        disabled={state.locked}
        testID={props.testID}
        accessibilityRole="button"
        accessibilityLabel={
          props.accessibilityLabel ?? props.label ?? placeholder
        }
        accessibilityValue={{ text: state.selectedItem?.label ?? placeholder }}
        accessibilityHint={state.message}
        accessibilityState={{ disabled: state.locked, expanded: state.isOpen }}
        style={[
          styles.trigger,
          props.disabled && styles.disabled,
          props.error && { borderColor: '#D6243B' },
          props.inputContainerStyle,
        ]}
      >
        {!!props.leftIcon && <View>{props.leftIcon}</View>}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.value,
            !state.selectedItem && { color: '#6F7E90' },
            props.inputTextStyle,
          ]}
        >
          {state.selectedItem?.label ?? placeholder}
        </Text>
        <View>
          {props.rightIcon !== undefined ? (
            props.rightIcon
          ) : (
            <Svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              fill="none"
              style={{
                transform: [{ rotate: state.isOpen ? '180deg' : '0deg' }],
              }}
            >
              <Path
                d="m4 6 4 4 4-4"
                stroke="#3F536C"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </View>
      </Pressable>
      {!!state.message && (
        <Text
          accessibilityLiveRegion={props.error ? 'polite' : 'none'}
          style={[styles.helper, props.error && { color: '#D6243B' }]}
        >
          {state.message}
        </Text>
      )}
      <Modal
        transparent
        visible={state.isOpen}
        animationType="slide"
        onRequestClose={state.close}
        testID={props.testID && `${props.testID}-modal`}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.overlay}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            accessible={false}
            onPress={state.close}
          />
          <View style={styles.sheet} accessibilityViewIsModal>
            <View style={styles.header}>
              <Text accessibilityRole="header" style={styles.title}>
                {title}
              </Text>
              <Pressable
                onPress={state.confirm}
                disabled={!state.canConfirm}
                accessibilityRole="button"
                accessibilityLabel="Tamamla"
                accessibilityState={{ disabled: !state.canConfirm }}
                hitSlop={8}
              >
                <Text
                  style={[styles.done, !state.canConfirm && { opacity: 0.4 }]}
                >
                  Tamamla
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                alignItems: 'flex-end',
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Vazgeç"
                onPress={state.close}
                hitSlop={8}
              >
                <Text style={styles.helper}>Vazgeç</Text>
              </Pressable>
            </View>
            {props.searchable && (
              <Input
                accessibilityLabel="Seçenek ara"
                placeholder={props.searchPlaceholder ?? 'Ara...'}
                value={state.query}
                onChangeText={state.setQuery}
                autoCorrect={false}
                autoCapitalize="none"
                containerStyle={{ marginHorizontal: 16, marginBottom: 16 }}
              />
            )}
            <FlatList
              style={{ flexGrow: 0, flexShrink: 1 }}
              data={state.filteredItems}
              keyExtractor={(item) => `${typeof item.value}:${item.value}`}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.empty}>Kayıt bulunamadı.</Text>
              }
              renderItem={({ item }) => {
                const selected = item.value === state.draftValue;
                return (
                  <Pressable
                    onPress={() => state.select(item)}
                    disabled={item.disabled}
                    accessibilityRole="radio"
                    accessibilityLabel={item.label}
                    accessibilityState={{
                      checked: selected,
                      disabled: !!item.disabled,
                    }}
                    style={[
                      styles.row,
                      selected && { backgroundColor: '#F3F7FE' },
                      item.disabled && { opacity: 0.5 },
                      props.itemStyle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.itemLabel,
                        selected && {
                          color: '#115BB9',
                          fontFamily: mediumFont,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {selected && (
                      <Svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <Path
                          d="m3 8 3 3 7-7"
                          stroke="#115BB9"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  label: {
    fontFamily: mediumFont,
    fontSize: 11,
    color: '#3F536C',
    marginBottom: 4,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    borderWidth: 1,
    borderColor: '#CFD4DA',
    borderRadius: 6,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  disabled: { backgroundColor: '#F0F4FA', opacity: 0.7 },
  value: {
    flex: 1,
    fontFamily: mediumFont,
    fontSize: 14,
    color: '#3F536C',
  },
  helper: {
    fontFamily: regularFont,
    fontSize: 12,
    color: '#6F7E90',
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingBottom: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EAF0',
  },
  title: {
    flex: 1,
    fontFamily: mediumFont,
    fontSize: 16,
    color: '#3F536C',
  },
  done: {
    fontFamily: mediumFont,
    fontSize: 16,
    color: '#115BB9',
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4FA',
  },
  itemLabel: {
    flex: 1,
    fontFamily: regularFont,
    fontSize: 15,
    color: '#3F536C',
  },
  empty: {
    fontFamily: regularFont,
    fontSize: 14,
    color: '#8A92A6',
    textAlign: 'center',
    padding: 24,
  },
});
