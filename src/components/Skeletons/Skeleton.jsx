import React from "react";
import { View, Animated, StyleSheet } from "react-native";

export default function Skeleton({ width, height, borderRadius = 6, style }) {

  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#E0E0E0",
          opacity
        },
        style
      ]}
    />
  );
}

const styles = StyleSheet.create({});