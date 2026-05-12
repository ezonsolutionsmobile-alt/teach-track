import React from "react";
import { View } from "react-native";
import Skeleton from "./Skeleton";
import themes from '../../themes/colors';
import { moderateScale } from "../../themes/sizes";


export default function ProfileSkeleton() {

    return (
        <View style={{ padding: moderateScale(12) }}>


            {/* List Skeleton */}
            <View style={{ marginTop: 6,paddingHorizontal:4 }}>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                    <View
                        key={item}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 28
                        }}
                    >
                        <Skeleton width={120} height={8} />
                        <Skeleton width={100} height={8} />
                    </View>
                ))}

            </View>

        </View>
    );
}