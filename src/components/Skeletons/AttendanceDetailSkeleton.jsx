import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Skeleton from './Skeleton';
import themes from '../../themes/colors';
import globalStyles from '../../themes/globalStyles';
import { moderateScale, scale, verticalScale } from '../../themes/sizes';

const { width } = Dimensions.get('window');

export default function AttendanceDetailSkeleton() {
    return (
        <View style={{ flex: 1, backgroundColor: themes.white }}>
            {/* Stats Cards */}
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: verticalScale(12),
                    marginHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
                    gap: scale(8),
                }}
            >
                {[1, 2].map((item) => (
                    <LinearGradient
                        key={item}
                        colors={['#f2f2f2', '#e8e8e8']}
                        style={{
                            flex: 1,
                            borderRadius: moderateScale(16),
                            padding: moderateScale(12),
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1 }}>
                                <Skeleton width={70} height={10} borderRadius={4} />
                                <View style={{ height: verticalScale(10) }} />
                                <Skeleton width={50} height={16} borderRadius={4} />
                                <View style={{ height: verticalScale(10) }} />
                                <Skeleton width={'100%'} height={5} borderRadius={4} />
                                {/* <View style={{ height: verticalScale(10) }} /> */}
                                {/* <Skeleton width={90} height={10} borderRadius={4} /> */}
                            </View>

                            <Skeleton width={50} height={0} borderRadius={15} />
                        </View>
                    </LinearGradient>
                ))}
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: verticalScale(100),
                    paddingTop: verticalScale(8),
                }}
            >
                {/* Attendance History Title */}
                <View
                    style={{
                        paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
                        marginBottom: verticalScale(10),
                    }}
                >
                    <Skeleton width={140} height={16} borderRadius={4} />
                </View>

                {/* Attendance List */}
                {Array.from({ length: 8 }).map((_, index) => (
                    <View
                        key={index}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: themes.white,
                            borderRadius: moderateScale(12),
                            borderWidth: 1,
                            borderColor: '#f0f0f0',
                            paddingVertical: verticalScale(10),
                            paddingHorizontal: scale(10),
                            marginBottom: verticalScale(8),
                            marginHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
                        }}
                    >
                        {/* Date Section */}
                        <View style={{ width: scale(45), alignItems: 'center' }}>
                            <Skeleton width={22} height={14} borderRadius={4} />
                            <View style={{ height: verticalScale(6) }} />
                            <Skeleton width={28} height={8} borderRadius={4} />
                        </View>

                        {/* Divider */}
                        <View
                            style={{
                                width: 1,
                                height: verticalScale(30),
                                backgroundColor: '#ececec',
                                marginHorizontal: scale(15),
                            }}
                        />

                        {/* Status Info */}
                        <View style={{ flex: 1 }}>
                            <Skeleton width={70} height={8} borderRadius={4} />
                            <View style={{ height: verticalScale(8) }} />
                            <Skeleton width={90} height={12} borderRadius={4} />
                        </View>

                        {/* Right Indicator */}
                        <Skeleton width={4} height={32} borderRadius={4} />
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Summary */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: themes.darkGrey,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    paddingVertical: verticalScale(10),
                }}
            >
                {Array.from({ length: 6 }).map((_, index) => (
                    <View
                        key={index}
                        style={{
                            width: width / 6,
                            alignItems: 'center',
                        }}
                    >
                        <Skeleton width={10} height={10} borderRadius={5} />
                        <View style={{ height: verticalScale(6) }} />
                        <Skeleton width={18} height={12} borderRadius={4} />
                        <View style={{ height: verticalScale(4) }} />
                        <Skeleton width={35} height={8} borderRadius={4} />
                    </View>
                ))}
            </View>
        </View>
    );
}
