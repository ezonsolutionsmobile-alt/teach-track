// NoDataFound.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';
import AppText from './AppText'; // your custom Text component
import themes from '../themes/colors';
import { moderateScale } from '../themes/sizes';

const NoDataFound = ({
  message = 'No Data Found',
  iconSize = 70,
  themeColors = { primary: themes?.purple, secondary: themes?.lightBlue },
}) => {
  return (
    <View style={styles.container}>
      <Svg
        width={moderateScale(iconSize)}
        height={moderateScale(iconSize)}
        viewBox="0 0 64 64"
        fill="none"
      >
        {/* Box */}
        <Rect
          x="8"
          y="20"
          width="48"
          height="36"
          rx="4"
          stroke={themeColors.primary}
          strokeWidth="3"
          fill={themeColors.secondary}
        />
        {/* Sad Face */}
        <Circle cx="24" cy="34" r="3" fill="#999" />
        <Circle cx="40" cy="34" r="3" fill="#999" />
        <Path
          d="M22 44 Q32 50 42 44"
          stroke="#999"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Shadow line for box lid */}
        <Path d="M8 20 H56" stroke="#ccc" strokeWidth="2" />
      </Svg>

      <AppText style={styles.text}>{message}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                  
    justifyContent: 'center', 
    alignItems: 'center',     
  },
  text: {
    fontSize: moderateScale(16),
    color: themes?.mediumText,
    textAlign: 'center',
  },
});

export default NoDataFound;
