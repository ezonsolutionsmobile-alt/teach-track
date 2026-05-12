import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import themes from '../themes/colors';
import { BackIcon, HamburgerIcon } from '../assets/Icons';
import { moderateScale } from '../themes/sizes';

const CustomHeader = ({ title, titleSize, containerStyle,
  isBack = false,
  isMenu = false,
  onBackPress = () => { },
  onLeftPress = () => { }
}) => {
  return (
    <View style={[styles.container, containerStyle]}>

      {/* Left back button placeholder */}
      <Pressable
        style={styles.left}
        onPress={(!isBack && isMenu) ? onLeftPress : onBackPress}
        disabled={!isBack && !isMenu} // prevent touch when back not visible
      >
        {isBack && <BackIcon color={themes.white} />}
        {isMenu && <HamburgerIcon color={themes.white} />}
      </Pressable>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text numberOfLines={1} style={[styles.title, { fontSize: moderateScale(titleSize) }]}>
          {title}
        </Text>
      </View>
      {/* Right empty view to balance flex */}
      <View style={styles.right} />
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    height: moderateScale(34),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    // backgroundColor: themes.purple,
    paddingBottom: 4
  },
  left: {
    width: moderateScale(70), // fixed width for left icon
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    width: moderateScale(70), // same width as left to center title
  },
  title: {
    color: themes.white,
    // fontSize: moderateScale(20),
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});
