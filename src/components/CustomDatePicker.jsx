import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
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
  disabled = false,  // ✅ Added
  maximumDate = true
}) {

  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event, selectedDate) => {

    if (event?.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    setShowPicker(Platform.OS === 'ios');

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

  return (
    <View>
      <TouchableOpacity
        disabled={disabled}   // ✅ Disable touch
        style={[
          styles.button,
          {
            borderColor: parsedDate && !disabled
              ? theme?.theme?.primary
              : themes.borderGrey,
            paddingVertical: verticalScale(paddingVertical),

            opacity: disabled ? 1 : 1,   // ✅ Visual feedback
          },
        ]}
        onPress={() => {
          if (!disabled) setShowPicker(true);  // ✅ Extra safety
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

      {/* ✅ Picker will not render if disabled */}
      {showPicker && !disabled && (
        <DateTimePicker
          value={parsedDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={maximumDate ? new Date(2100, 11, 31) : new Date()}
          minimumDate={new Date(2000, 0, 1)}
        />
      )}
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
});