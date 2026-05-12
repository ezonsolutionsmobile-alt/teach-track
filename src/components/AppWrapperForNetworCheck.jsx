import React, { useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { verticalScale } from '../themes/sizes';

const BANNER_HEIGHT = verticalScale(30);

const AppWrapperForNetworkCheck = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnect, setShowReconnect] = useState(false);
  const [bannerAnim] = useState(new Animated.Value(-BANNER_HEIGHT)); // start hidden below

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setIsOffline(true);
        slideUp(); // red banner up
      } else {
        if (isOffline) {
          setIsOffline(false);
          slideUp(true); // green reconnect banner
        }
      }
    });

    return () => unsubscribe();
  }, [isOffline]);

  const slideUp = (reconnect = false) => {
    Animated.timing(bannerAnim, {
      toValue: 0, // slide up from bottom
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (reconnect) {
        setShowReconnect(true);
        setTimeout(() => {
          slideDown();
          setShowReconnect(false);
        }, 1500); // green banner for 2 sec
      }
    });
  };

  const slideDown = () => {
    Animated.timing(bannerAnim, {
      toValue: -BANNER_HEIGHT, // hide below
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={{ flex: 1 }}>
      {children}

      {/* Offline Banner */}
      {isOffline && (
        <Animated.View style={[styles.banner, { backgroundColor: '#ff3b30', bottom: bannerAnim }]}>
          <Text style={styles.text}>No Internet Connection</Text>
        </Animated.View>
      )}

      {/* Reconnect Banner */}
      {showReconnect && (
        <Animated.View style={[styles.banner, { backgroundColor: '#4BB543', bottom: bannerAnim }]}>
          <Text style={styles.text}>Back Online</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    width: '100%',
    height: BANNER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  text: {
    color: '#fff',
  },
});

export default AppWrapperForNetworkCheck;