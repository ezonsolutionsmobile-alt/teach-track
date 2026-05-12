import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { moderateScale } from '../themes/sizes';
import { splashLogo } from '../assets';
import CustomStatusBar from './CustomStatusBar';
import themes from '../themes/colors';
import { useThemeStore } from '../store/useThemeStore';

const SplashComponent = () => {
  // Get theme safely
  const { theme } = useThemeStore();

  return (
    <View style={[
      styles.container,
      { backgroundColor: "#fff" }
    ]}
    >
      <CustomStatusBar
        backgroundColor={'#fff'}
        barStyle="light-content"
      />

      <View style={styles.logoContainer}>
        <Image
          source={splashLogo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default SplashComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: moderateScale(150),
    height: moderateScale(150),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});