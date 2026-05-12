import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { TextStyles } from '../themes/typography';
import themes from '../themes/colors';


const AppText = ({ type = 'body', weight = 'Regular', style, children, color }) => {
  const fontFamily = `Inter-${weight}`; // automatically sets Inter font weight
  return (
    <Text
      allowFontScaling={false}
      selectable={true}
      style={[
        styles.default,
        TextStyles[type],
        { fontFamily }, // Inter font applied here
        color && { color }, // optional color override
        style, // custom styles
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  default: {
    fontSize: TextStyles.body.fontSize, // default font size from TextStyles
    color: themes.darkText, // default color
  },
});

export default AppText;


