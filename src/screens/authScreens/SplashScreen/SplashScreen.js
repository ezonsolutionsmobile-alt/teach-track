import React, { useEffect } from 'react';
import { StyleSheet, Image, View, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomStatusBar from '../../../components/CustomStatusBar';
import { moderateScale, verticalScale } from '../../../themes/sizes';
import { useThemeStore } from '../../../store/useThemeStore';
import { splashLogo, bg_pattern } from '../../../assets';
import { useAuthStore } from '../../../store/useAuthStore';
import RNBootSplash from "react-native-bootsplash";
const SplashScreen = () => {
  const navigation = useNavigation();

  // Retrieve current app theme from Zustand global store
  const { theme } = useThemeStore();

console.log(theme)
  const isCodeScreen = useAuthStore((state) => state?.isCodeScreen);


  const branding = theme?.branding || {};

  useEffect(() => {
    const timer = setTimeout(() => {
        RNBootSplash.hide({ fade: true });
      navigation.replace(isCodeScreen ? 'LoginScreen' : 'CodeScreen');
    }, 300);

    return () => clearTimeout(timer);
  }, [navigation]);

  // 🔹 Splash background decision
  const isColorBg = branding?.is_splash_background_type === 1;
  const isImageBg = branding?.is_splash_background_type === 2;

  const Container = isImageBg ? ImageBackground : View;

  return (
    <Container
      style={[
        styles.container,
        isColorBg && { backgroundColor: branding?.splash_background }
      ]}
      source={isImageBg ? bg_pattern : undefined}
      // source={isImageBg ? { uri: branding?.splash_image } : undefined}
      resizeMode="cover"
    >
      <CustomStatusBar
        backgroundColor={theme?.theme?.primary || '#000'}
        barStyle="light-content"
      />

      <View style={styles.logoContainer}>
        <Image source={splashLogo} style={styles.logo} resizeMode="contain" />
        {/* {branding?.logo ? (
          <Image
            source={{ uri: branding.logo }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : null} */}
      </View>
    </Container>
  );
};

export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: moderateScale(115),
    height: moderateScale(115),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    marginBottom:verticalScale(20),
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Android shadow
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});