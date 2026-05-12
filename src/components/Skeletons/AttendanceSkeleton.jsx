import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton";
import { moderateScale } from "../../themes/sizes";

export default function AttendanceSkeleton() {

    const columnWidths = [35, 50, 160, 55, 55, 55, 55, 55, 55];

    return (
        <View style={{ backgroundColor: "#fff" }} >

            {/* HEADER SKELETON */}
            <View style={{
                flexDirection: "row",
                paddingVertical: 10,
                backgroundColor: "#eee",
                alignItems: "center"
            }}>

                {columnWidths.map((width, index) => (
                    <View
                        key={index}
                        style={{
                            width,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Skeleton width={index === 2 ? 120 : 20} height={10} />
                    </View>
                ))}

            </View>


            {/* ROW SKELETON LIST */}
            {
                Array.from({ length: 10 }).map((_, rowIndex) => (
                    <View
                        key={rowIndex}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: moderateScale(10),
                            borderBottomWidth: 0.5,
                            borderColor: "#f0f0f0"
                        }}
                    >

                        {/* Serial */}
                        <View style={{ width: columnWidths[0], alignItems: "center" }}>
                            <Skeleton width={12} height={8} />
                        </View>

                        {/* ID */}
                        <View style={{ width: columnWidths[1], alignItems: "center" }}>
                            <Skeleton width={30} height={8} />
                        </View>

                        {/* Name */}
                        <View style={{ width: columnWidths[2], alignItems: "center" }}>
                            <Skeleton width={120} height={8} />
                        </View>

                        {/* Attendance Radio Columns */}
                        {columnWidths.slice(3).map((width, i) => (
                            <View
                                key={i}
                                style={{
                                    width,
                                    alignItems: "center"
                                }}
                            >
                                <Skeleton width={18} height={18} borderRadius={9} />
                            </View>
                        ))}

                    </View>
                ))
            }

            {/* FOOTER SKELETON */}
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: moderateScale(12)
            }}>
                <Skeleton width={80} height={30} borderRadius={6} />
                <Skeleton width={120} height={10} />
                <Skeleton width={100} height={30} borderRadius={6} />
            </View>

        </View>
    );
}