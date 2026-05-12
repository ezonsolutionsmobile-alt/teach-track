import React, { useRef, useEffect } from 'react';
import { Animated, View, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function SlideWrapper({ children }) {
  const translateX = useRef(new Animated.Value(width)).current;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused]);

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
      {children}
    </Animated.View>
  );
}