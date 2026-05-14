import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal, // ✅ Added for iOS
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarIcon } from '../assets/Icons';
import themes from '../themes/colors';
import { moderateScale, verticalScale } from '../themes/sizes';
import AppText from './AppText';

export default function CustomDatePicker({
  placeholder = "Select Date",
  date,
  onDateChange,
  strokeWidth,
  fontWeight = 'Bold',
  paddingVertical = 14,
  theme,
  disabled = false,
  maximumDate = true
}) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event, selectedDate) => {
    // Android par select karte hi band ho jaye
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      onDateChange && onDateChange(selectedDate);
    }
  };

  const parsedDate =
    date instanceof Date
      ? date
      : date
        ? new Date(date + "T00:00:00")
        : null;

  const formattedDate = parsedDate
    ? parsedDate.toLocaleDateString()
    : placeholder;

  // ✅ iOS ke liye Picker UI
  const renderPicker = () => {
    const picker = (
      <DateTimePicker
        value={parsedDate || new Date()}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={handleChange}
        maximumDate={maximumDate ? new Date(2100, 11, 31) : new Date()}
        minimumDate={new Date(2000, 0, 1)}
      />
    );

    if (Platform.OS === 'ios') {
      return (
        <Modal transparent animationType="slide" visible={showPicker}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* iOS Header with Done Button */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <AppText weight="Bold" style={{ color: theme?.theme?.primary, fontSize: 18 }}>
                    Done
                  </AppText>
                </TouchableOpacity>
              </View>
              {picker}
            </View>
          </View>
        </Modal>
      );
    }

    return picker;
  };

  return (
    <View>
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.button,
          {
            borderColor: parsedDate && !disabled
              ? theme?.theme?.primary
              : themes.borderGrey,
            paddingVertical: verticalScale(paddingVertical),
          },
        ]}
        onPress={() => {
          if (!disabled) setShowPicker(true);
        }}
        activeOpacity={0.8}
      >
        <AppText
          weight={fontWeight}
          style={{
            fontSize: moderateScale(theme?.text_font_size?.large_medium),
            color: disabled
              ? themes.mediumText
              : parsedDate
                ? theme?.theme?.primary
                : theme?.theme?.dark_text
          }}
        >
          {formattedDate}
        </AppText>

        <CalendarIcon
          width={20}
          height={18}
          strokeWidth={strokeWidth}
          color={
            disabled
              ? themes.mediumText
              : parsedDate
                ? theme?.theme?.primary
                : theme?.theme?.medium_text
          }
        />
      </TouchableOpacity>

      {showPicker && !disabled && renderPicker()}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: themes.white,
  },
  // ✅ iOS Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});