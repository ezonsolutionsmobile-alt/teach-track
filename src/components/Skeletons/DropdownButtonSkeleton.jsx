import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "./Skeleton";
import themes from "../../themes/colors";
import { moderateScale, scale, verticalScale } from "../../themes/sizes";

export default function DropdownButtonSkeleton({ count = 1 }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.button}>
          
          {/* Title Skeleton */}
          <Skeleton 
            width={scale(140)} 
            height={moderateScale(16)} 
          />

          {/* Icon Skeleton (circle) */}
          <Skeleton 
            width={scale(22)} 
            height={scale(20)} 
            style={{ borderRadius: scale(11) }} 
          />

        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:8,
    // paddingHorizontal: scale(8),
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(11),
    paddingHorizontal: scale(14),
    borderWidth: 1,
    borderRadius: scale(10),
    marginVertical: verticalScale(4),
    borderColor: themes.borderGrey,
    backgroundColor: themes.overlayGrey,
  },
});