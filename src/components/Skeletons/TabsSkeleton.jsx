import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "./Skeleton";
import { moderateScale, scale, verticalScale } from "../../themes/sizes";
import themes from "../../themes/colors";

export default function TabsSkeleton() {
  return (
    <View style={styles.container}>

      {/* ================= TABS SKELETON ================= */}
      <View style={styles.tabContainer}>
        <View style={styles.tabRow}>
          <Skeleton style={styles.tab} height={46} borderRadius={8} />
          <Skeleton style={styles.tab} height={46} borderRadius={8} />
          <Skeleton style={styles.tab} height={46} borderRadius={8} />
        </View>
      </View>
  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },

  /* Tabs */
  tabContainer: {
    paddingHorizontal: scale(8),
    paddingVertical: moderateScale(8),
  },

  tabRow: {
    flexDirection: "row",
    gap: scale(3),
  },

  tab: {
    flex: 1,
    marginVertical:verticalScale(-6)
  },
 

  

   
});