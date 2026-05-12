import React from "react";
import { View, StyleSheet } from "react-native";
import Skeleton from "./Skeleton";
import { scale, verticalScale } from "../../themes/sizes";

export default function LoginHistorySkeleton() {
    return (
        <View style={styles.container}>
            {[1, 2, 3, 4].map((key) => (
                <View key={key} style={styles.card}>
                    {/* Left Content */}
                    <View style={{ flex: 1 }}>
                        <Skeleton width={scale(120)} height={16} />
                        <Skeleton width={scale(180)} height={12} style={{ marginTop: 8 }} />
                    </View>

                    {/* Right Content */}
                    <View style={{ alignItems: "flex-end" }}>
                        <Skeleton width={60} height={12} />
                        <Skeleton width={50} height={12} style={{ marginTop: 8 }} />
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginVertical: 6,
        borderRadius: 12,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
});