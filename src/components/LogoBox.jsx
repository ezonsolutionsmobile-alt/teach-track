import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import AppText from './AppText';
import { moderateScale, scale, verticalScale } from '../themes/sizes';
import { splashLogo } from '../assets';
import { useApiRoutesStore } from '../store/useApiRoutesStore';
import { useThemeStore } from '../store/useThemeStore';

const LogoBox = ({ isCodeScreen = false, appLogo = false, title, titleSize = 28, titleColor = "#292D34", width = 150, height = 150 }) => {
  // Retrieve current app theme from Zustand global store
  const { theme } = useThemeStore();
  const { assetRoutes } = useApiRoutesStore();
  // console.log(theme?.school_logo?.logo,appLogo,isCodeScreen)
  return (
    <View> 
      <Image
        // source={splashLogo}
        source={
         !appLogo && theme?.school_logo?.logo
            ? { uri: assetRoutes?.logo + theme?.school_logo?.logo }
            : splashLogo
        }
        style={[styles.logo, { width: scale(width), height: verticalScale(height) }]} resizeMode="contain" />

      {/* Title */}
      <AppText type="title" weight="Bold" style={[styles.title, { color: titleColor, fontSize: moderateScale(titleSize) }]}>
        {title}
      </AppText>
      {isCodeScreen && <AppText type="title" weight="Bold" style={[styles.title, { color: titleColor, fontSize: moderateScale(14) }]}>
        Demo Code: 1018
      </AppText>}
    </View>
  );
};

export default LogoBox;

const styles = StyleSheet.create({
  logo: {

    alignSelf: 'center',
    marginBottom: 25,
  },
  title: {
    // fontSize: moderateScale(28), // font size remains
    textAlign: 'center',
    // color: themes.darkText,
    marginBottom: 0,
  },
});
