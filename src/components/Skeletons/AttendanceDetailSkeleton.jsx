import React from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Skeleton from './Skeleton';
import themes from '../../themes/colors';
import globalStyles from '../../themes/globalStyles';
import { moderateScale, scale, verticalScale } from '../../themes/sizes';

const { width } = Dimensions.get('window');

export default function AttendanceDetailSkeleton() {
    return (
        <View style={styles.container}>
            {/* Stats Cards Skeleton */}
            <View style={styles.statsWrapper}>
                {[1, 2].map((item) => (
                    <LinearGradient
                        key={item}
                        colors={['#f2f2f2', '#e8e8e8']}
                        style={styles.statCard}
                    >
                        {/* Matching the Real UI Inner Wrapper */}
                        <View style={styles.cardInner}>
                            <View style={{ flex: 1 }}>
                                <Skeleton width={60} height={10} borderRadius={4} />
                                <View style={{ height: 8 }} />
                                <Skeleton width={40} height={16} borderRadius={4} />
                                <View style={{ height: 8 }} />
                                <Skeleton width={'80%'} height={4} borderRadius={4} />
                            </View>
                            {/* Icon Circle Skeleton */}
                            <Skeleton width={30} height={30} borderRadius={15} />
                        </View>
                    </LinearGradient>
                ))}
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Title Skeleton */}
                <View style={styles.titleWrapper}>
                    <Skeleton width={150} height={18} borderRadius={4} />
                </View>

                {/* Attendance List Skeleton */}
                {Array.from({ length: 8 }).map((_, index) => (
                    <View key={index} style={styles.listCard}>
                        {/* Date Section */}
                        <View style={styles.dateSection}>
                            <Skeleton width={25} height={15} borderRadius={4} />
                            <View style={{ height: 6 }} />
                            <Skeleton width={30} height={10} borderRadius={4} />
                        </View>

                        {/* Divider */}
                        <View style={styles.verticalDivider} />

                        {/* Status Info */}
                        <View style={{ flex: 1 }}>
                            <Skeleton width={80} height={10} borderRadius={4} />
                            <View style={{ height: 10 }} />
                            <Skeleton width={120} height={14} borderRadius={4} />
                        </View>

                        {/* Eye Icon Area Skeleton */}
                        <Skeleton width={20} height={20} borderRadius={10} />
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Summary Skeleton */}
            <View style={styles.bottomSummary}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <View key={index} style={{ alignItems: 'center', width: width / 5 }}>
                        <Skeleton width={8} height={8} borderRadius={4} />
                        <View style={{ height: 6 }} />
                        <Skeleton width={15} height={12} borderRadius={4} />
                        <View style={{ height: 4 }} />
                        <Skeleton width={30} height={8} borderRadius={4} />
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.white,
    },
    statsWrapper: {
        flexDirection: 'row',
        marginTop: verticalScale(12),
        paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal || scale(15),
        gap: scale(8),
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardInner: {
        flexDirection: 'row',
        padding: scale(12),
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    scrollContent: {
        paddingBottom: verticalScale(100),
        paddingTop: verticalScale(15),
    },
    titleWrapper: {
        paddingHorizontal: scale(15),
        marginBottom: verticalScale(15),
    },
    listCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themes.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(12),
        marginBottom: verticalScale(10),
        marginHorizontal: scale(15),
    },
    dateSection: {
        width: scale(45),
        alignItems: 'center',
    },
    verticalDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#ececec',
        marginHorizontal: scale(12),
    },
    bottomSummary: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#333',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: verticalScale(12),
    },
});