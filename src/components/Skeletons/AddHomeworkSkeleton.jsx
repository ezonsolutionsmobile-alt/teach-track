import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "./Skeleton";
import { moderateScale, scale, verticalScale } from "../../themes/sizes";
import themes from "../../themes/colors";

export default function AddHomeworkSkeleton() {
  return (
    <View style={styles.container}>
      
      

      {/* ================= LIST SKELETON ================= */}
      <View style={styles.listContainer}>
        <Skeleton width={"100%"} height={40} style={{ marginVertical: 4 }} />
        {[1].map((item) => (
          <View key={item} style={styles.card}>
            
            {/* Date */}
            <Skeleton width={100} height={8} style={{ marginBottom: 8 }} />

            {/* Description */}
            <Skeleton width={"90%"} height={10} style={{ marginBottom: 6 }} />
            <Skeleton width={"70%"} height={10} style={{ marginBottom: 12 }} />

            

          </View>
        ))}
         <Skeleton width={"100%"} height={40} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* Tabs */
  tabContainer: {
    paddingHorizontal: scale(8),
    paddingVertical: moderateScale(8),
  },

  tabRow: {
    flexDirection: "row",
  },

  /* List */
  listContainer: {
    paddingHorizontal: scale(8),
    paddingTop: moderateScale(4),
  },

  card: {
    backgroundColor: themes.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: themes.borderGrey,
    height:verticalScale(380)
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});