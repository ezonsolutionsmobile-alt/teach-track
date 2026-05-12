import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "./Skeleton";
import { moderateScale, scale } from "../../themes/sizes";
import themes from "../../themes/colors";

export default function HomeworkScreenSkeleton() {
  return (
    <View style={styles.container}>

      {/* ================= TABS SKELETON ================= */}
      {/* <View style={styles.tabContainer}>
        <View style={styles.tabRow}>
          <Skeleton style={styles.tab} height={35} borderRadius={8} />
          <Skeleton style={styles.tab} height={35} borderRadius={8} />
          <Skeleton style={styles.tab} height={35} borderRadius={8} />
        </View>
      </View> */}

      {/* ================= LIST SKELETON ================= */}
      <View style={styles.listContainer}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.card}>

            {/* Date */}
            <Skeleton width={100} height={8} style={{ marginBottom: 8 }} />

            {/* Description */}
            <Skeleton width={"90%"} height={10} style={{ marginBottom: 6 }} />
            <Skeleton width={"70%"} height={10} style={{ marginBottom: 12 }} />

            {/* Actions */}
            <View style={styles.actions}>
              <Skeleton width={20} height={20} borderRadius={4} />
              <Skeleton
                width={20}
                height={20}
                borderRadius={4}
                style={{ marginLeft: 12 }}
              />
              <Skeleton
                width={20}
                height={20}
                borderRadius={4}
                style={{ marginLeft: 12 }}
              />
            </View>

          </View>
        ))}
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
    gap: scale(6),
  },

  tab: {
    flex: 1,
  },

  /* List */
  listContainer: {
    paddingHorizontal: scale(8),
    paddingTop: moderateScale(9),
  },

  card: {
    backgroundColor: themes.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: themes.borderGrey,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});