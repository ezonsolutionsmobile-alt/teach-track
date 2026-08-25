import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton";
import { moderateScale, scale, verticalScale } from "../../themes/sizes";

export default function LogoBoxSkeleton({ width = 180, height = 180 }) {
  return (
    <View style={{ alignItems: "center" }}>
      
      {/* Logo Skeleton */}
      <Skeleton
        width={scale(width)}
        height={verticalScale(height)}
        borderRadius={scale(width / 2)}
      style={{ marginBottom: verticalScale(32) }}
      />

      {/* Title Skeleton */}
      <Skeleton
        width={220}
        height={moderateScale(32)}
        borderRadius={6}
        style={{ marginTop: verticalScale(24),marginBottom:verticalScale(6) }}
      />
    </View>
  );
}