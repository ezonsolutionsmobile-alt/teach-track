import React from 'react';
import { TouchableOpacity, StyleSheet, View, ActivityIndicator, Pressable } from 'react-native';
import themes from '../themes/colors'; // your color file
import { moderateScale } from '../themes/sizes';
import AppText from './AppText'; // use AppText for consistent Inter fonts
import { useThemeStore } from '../store/useThemeStore';

export default function AppButton({
  title,
  onPress,
  style,
  textStyle,
  disabled,
  isLoading = false,
  fullWidth = false,
  btnStyle,
  spinnerSize = 25,
  spinnerHorizontalPadding = 12
}) {

  // Retrieve current app theme from Zustand global store
  const { theme } = useThemeStore();
  // console.log(theme, "theme-------- button component")

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonWrapper,
        fullWidth && { width: '100%' },
        style,
        disabled && styles.disabled,
        pressed && !disabled && { opacity: 0.6 }, // opacity feedback on press
      ]}
      // activeOpacity={0.8}
      disabled={disabled || isLoading}
    >
      <View style={[styles.button, { backgroundColor: theme?.theme?.primary }, disabled && styles.disabledButton, btnStyle]}>
        {isLoading ? (
          <View style={{ paddingHorizontal: spinnerHorizontalPadding }}>
            <ActivityIndicator size={moderateScale(spinnerSize)} color={themes.white} />
          </View>
        ) : (
          <AppText
            type="body"
            weight="Medium" // Inter Medium for button text
            style={[styles.buttonText, { fontSize: moderateScale(theme?.heading_font_size?.h5 - 1) }, textStyle]}
          >
            {title}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  button: {
    // backgroundColor: themes.purple, // ClickUp purple
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: themes.white,
  },
  disabled: {
    opacity: 0.7,
  },
  disabledButton: {
    backgroundColor: themes?.lightPurple, // lighter purple for disabled
  },
});
