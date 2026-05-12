import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import themes from '../themes/colors';
import { moderateScale, scale, verticalScale } from '../themes/sizes';
import AppText from './AppText';

export default function SubjectCard({ subject, theme, title,titleSize, onPress }) {
  return (
    <View style={styles.card}>
      <AppText weight='SemiBold' style={[styles.subjectName, { color: theme?.theme?.dark_text, fontSize: moderateScale(titleSize) }]}>{subject}</AppText>

      <Pressable onPress={onPress} android_ripple={{ color: '#ffffff30' }}>
        {({ pressed }) => (
          <View
            style={[
              styles.addButton,
              { backgroundColor: theme?.theme?.primary, borderRadius: scale(10),opacity: pressed ? 0.8 : 1 }
            ]}
          >
        <AppText weight='Medium' style={{ color: themes.white, fontSize: moderateScale(theme?.text_font_size?.small) }}>{title}</AppText>
    </View>
  )
}
      </Pressable >
    </View >
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: themes.white,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: themes.borderGrey,
    marginVertical: verticalScale(4),
  },

  subjectName: {
    // fontSize: moderateScale(14),
    flexShrink: 1,
  },

  addButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(18),
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
