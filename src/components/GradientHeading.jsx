import React, { useEffect } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import AppText from "./AppText";
import { moderateScale, verticalScale } from "../themes/sizes";
import { useThemeStore } from "../store/useThemeStore";

const AnimatedLinearGradient =
  Animated.createAnimatedComponent(LinearGradient);

const { width } = Dimensions.get("window");

export default function Heading({ title }) {
  // Retrieve current app theme from Zustand global store
  const { theme } = useThemeStore();

  const colorList = theme?.company_name_animated_linear_gradient?.colors || [
    "#0300cc",
    "#ca6628",
    "#068c04",
    "#f716dd",
    "#e75ba1",
    "#13070d",
  ]


  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-width, {
        duration: 3000,
        easing: Easing.linear, // ⭐ Must be linear for smooth flow
      }),
      -1,
      true // ⭐ No reverse bounce
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <MaskedView maskElement={<AppText style={[styles.topLogoText, { color: theme?.theme?.primary, fontSize: moderateScale(theme?.heading_font_size?.h3 || 24) }]}>{title}</AppText>}>
        <AnimatedLinearGradient
          colors={colorList}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, animatedStyle]}
        />
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: "100%",
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
  },
  gradient: {
    width: width * 3, // ⭐ Important for smooth animation
    height: verticalScale(30),
  },
  topLogoText: {
    // fontSize: moderateScale(18),
    fontFamily: 'Inter-Bold',
    letterSpacing: 1.2,
    textAlign: 'center'
  },
});