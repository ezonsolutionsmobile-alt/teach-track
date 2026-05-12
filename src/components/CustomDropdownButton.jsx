import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ForwardIcon } from '../assets/Icons';
import themes from '../themes/colors';
import { moderateScale, scale, verticalScale } from '../themes/sizes';
import AppText from './AppText';

export default function CustomDropdownButton({ title, titleSize,activetitleColor,inActivetitleColor, onPress }) {
  return (
    <Pressable onPress={onPress} android_ripple={{ color: '#ddd' }}>
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            { borderColor: pressed ? activetitleColor : themes.borderGrey }
          ]}
        >
          <AppText weight='SemiBold' style={{ color: pressed ? activetitleColor : inActivetitleColor, fontSize: moderateScale(titleSize) }}>
            {title}
          </AppText>

          <ForwardIcon
            size={scale(22)}
            color={pressed ? activetitleColor : themes.mediumText}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(11),
    paddingHorizontal: scale(14),   // responsive
    borderWidth: 1,
    borderRadius: scale(10),
    marginVertical: verticalScale(4),
    backgroundColor: themes.overlayGrey,
  },

  title: {
    // fontSize: moderateScale(16),
  },
});
