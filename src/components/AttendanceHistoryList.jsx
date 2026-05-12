import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Animated, Dimensions, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../components/AppText';
import themes from '../themes/colors';
import { moderateScale, scale, verticalScale } from '../themes/sizes';
import globalStyles from '../themes/globalStyles';
import { useThemeStore } from '../store/useThemeStore';
import { AdjustmentsIcon, CalendarIcon1, EyeIcon, ForwardIcon, LeaveIcon } from '../assets/Icons';
import { formatDate } from '../utils/formatDateType';
import { GetEmployeeAttendanceHistory, GetEmployeeAttendanceHistoryDetails } from '../services/attendance/staffAttendanceServices';
import CheckHistoryModal from './Modals/CheckHistoryModal';
import AttendanceDetailSkeleton from './Skeletons/AttendanceDetailSkeleton';
import NoDataFound from './NoDataFound';

const { width } = Dimensions.get('window');

const AttendanceHistoryList = ({
    refreshing = false,
    onRefresh = () => { },
    setShowPicker,
    selectedDate,
    CheckInOutTime
}) => {
    const { theme } = useThemeStore();
    const punctualityAnim = useRef(new Animated.Value(0)).current;
    const statusConfig = {
        Present: { color: '#2baa5a', label: 'Present' },
        Absent: { color: '#F87171', label: 'Absent' },
        Leave: { color: '#FB923C', label: 'On Leave' },
        Weekend: { color: '#94A3B8', label: 'Weekend' },
        Holiday: { color: '#60A5FA', label: 'Holiday' },
        Other: { color: '#A78BFA', label: 'Other' },
    };

    const [attendanceHistoryList, setAttendanceHistoryList] = useState([])
    const [attendanceTypes, setAttendanceTypes] = useState([])
    const [attendanceStats, setAttendanceStats] = useState(null)
    const [showCheckHistory, setShowCheckHistory] = useState(false)
    const [historyItem, setHistoryItem] = useState([])
    const [selectedDay, setSelectedDay] = useState({})
    const [historyLoading, setHistoryLoading] = useState(true)
    const [loading, setLoading] = useState(true)



    const getEmployeeAttendanceHistory = async () => {
        const body = {
            year: selectedDate.getFullYear().toString(),
            month: (selectedDate.getMonth() + 1).toString(),
        };
        setHistoryLoading(true)
        try {
            const res = await GetEmployeeAttendanceHistory(body)
            if (res?.status) {
                setAttendanceHistoryList(res?.data?.attendance || [])
                setAttendanceTypes(res?.data?.type_total || [])
                setAttendanceStats({ punctuality: res?.data?.punctuality, month_summery: res?.data?.month_summery })
            } else {
                setAttendanceHistoryList([])
                setAttendanceTypes([])
                setAttendanceStats({})
            }
        } catch (error) {
            console.error(error);
        } finally {
            setHistoryLoading(false)
        }
    }

    useEffect(() => {
        if (!attendanceStats?.punctuality) return;

        const value = parseFloat(String(attendanceStats?.punctuality).replace('%', '')) || 0;

        punctualityAnim.setValue(0); // reset

        setTimeout(() => {
            Animated.timing(punctualityAnim, {
                toValue: value,
                duration: 1000,
                useNativeDriver: false,
            }).start();
        }, 300);

    }, [attendanceStats?.punctuality]);


    useEffect(() => {
        getEmployeeAttendanceHistory()
    }, [selectedDate])

    const renderDailyItem = ({ item }) => {
        const config = statusConfig[item.status] || statusConfig.Other;
        const onPressHistory = async () => {
            setHistoryItem([])
            const body = {
                year: selectedDate.getFullYear().toString(),
                month: (selectedDate.getMonth() + 1).toString(),
                date: item?.date
            };
            setSelectedDay(body)
            try {
                setLoading(true)
                setShowCheckHistory(true);
                const res = await GetEmployeeAttendanceHistoryDetails(body)
                if (res?.status) {
                    setHistoryItem(res?.data?.data);   // 👈 correct item
                } else {
                    setHistoryItem([]);   // 👈 correct item
                }
                console.log(res)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false)

            }
        };

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={onPressHistory}   // 👈 CLICK ENABLE
                style={styles.modernCard}
            >
                {/* DATE SECTION */}
                <View style={styles.dateSection}>
                    <AppText
                        weight='SemiBold'
                        style={{
                            fontSize: moderateScale(theme?.heading_font_size?.h4),
                            color: theme?.theme?.primary
                        }}
                    >
                        {item?.date}
                    </AppText>

                    <AppText
                        weight='Bold'
                        style={{ fontSize: moderateScale(theme?.text_font_size?.small), color: theme?.theme?.medium_text, textTransform: 'uppercase' }}
                    >
                        {item?.day?.slice(0, 3) || "--"}
                    </AppText>
                </View>

                {/* DIVIDER */}
                <View
                    style={[
                        styles.verticalDivider,
                        { backgroundColor: theme?.theme?.light_text }
                    ]}
                />

                {/* INFO */}
                <View style={styles.infoSection}>
                    <AppText
                        weight='Bold'
                        style={{
                            fontSize: moderateScale(theme?.text_font_size?.medium),
                            color: theme?.theme?.medium_text
                        }}
                    >
                        Daily Status
                    </AppText>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View style={{ flexDirection: 'colummn', }}>

                            {/* Check In - Green */}
                            <AppText
                                weight="Medium"
                                style={{
                                    fontSize: moderateScale(theme?.text_font_size?.small),
                                    color: "#50C878"
                                }}
                            >
                                {`Last Check In: ${CheckInOutTime(item?.last_check_in) ? item?.last_check_in : "--:--"}`}
                            </AppText>

                            {/* Check Out - Red */}
                            <AppText
                                weight="Medium"
                                style={{
                                    fontSize: moderateScale(theme?.text_font_size?.small),
                                    color: "red"
                                }}
                            >
                                {`Last Check Out: ${CheckInOutTime(item?.last_check_out) ? item?.last_check_out : "--:--"}`}
                            </AppText>

                        </View>
                        <View style={{ marginRight: scale(8) }}>
                            <EyeIcon width={18} height={18} stroke={3} color={theme?.theme?.primary} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        (historyLoading ?
            <AttendanceDetailSkeleton />
            : <View style={styles.mainWrapper}>
                <CheckHistoryModal visible={showCheckHistory} onClose={() => setShowCheckHistory(false)} data={historyItem} selectedDay={selectedDay} loading={loading} />
                {/* FIXED SECTION: Stats will not scroll */}
                <View style={styles.fixedHeader}>
                    <View style={styles.statsWrapper}>
                        <LinearGradient colors={['#1b763f', '#1b763f']} style={styles.imageStyleCard}>
                            <View style={styles.cardLeft}>
                                <AppText weight='SemiBold' style={styles.cardLabel}>PUNCTUALITY</AppText>
                                <AppText weight='Bold' style={styles.cardValue}>{attendanceStats?.punctuality}</AppText>
                                <View style={styles.progressBarContainer}>
                                    <Animated.View
                                        style={[styles.progressBarFill, {
                                            width: punctualityAnim.interpolate({
                                                inputRange: [0, 100],
                                                outputRange: ['0%', '100%'],
                                            }),
                                        }]}
                                    />
                                </View>
                            </View>
                            <View style={styles.iconCircle}>
                                <LeaveIcon width={18} height={18} color={'#fff'} />
                            </View>
                        </LinearGradient>

                        <LinearGradient colors={['#e26c18', '#e26c18']} style={styles.imageStyleCard}>
                            <View style={styles.cardLeft}>
                                <AppText weight='SemiBold' style={[styles.cardLabel, { marginBottom: verticalScale(0) }]}>SCHOOL DAYS</AppText>
                                <AppText weight='Bold' style={styles.cardValue}>{attendanceStats?.month_summery?.days_in_month}</AppText>
                                <AppText style={[styles.sinceText, { fontSize: moderateScale(theme?.text_font_size?.extraSmall), color: 'rgba(255,255,255,0.9)' }]}>
                                    Total Working Days: {attendanceStats?.month_summery?.school_days}
                                </AppText>
                            </View>

                            <View style={styles.iconCircle}>
                                <CalendarIcon1 color={'#fff'} width={18} height={18} />
                            </View>
                        </LinearGradient>
                    </View>
                    <View style={styles.listTitleWrapper}>
                        <AppText
                            weight="SemiBold"
                            style={[
                                styles.listTitle,
                                { color: theme?.theme?.dark_text },
                            ]}
                        >
                            Attendance History{'  '}
                            <AppText weight='Medium' style={{ fontSize: theme?.text_font_size?.medium, color: theme?.theme?.primary }}>
                                ({formatDate(selectedDate, null, true, "monthShortYear")})
                            </AppText>
                        </AppText>

                        <TouchableOpacity onPress={() => setShowPicker(true)}>
                            <AdjustmentsIcon width={28} height={28} color={theme?.theme?.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* SCROLLABLE SECTION: Only the list scrolls */}
                <View style={styles.listContainer}>
                    <FlatList
                        data={attendanceHistoryList}
                        keyExtractor={(item) => item?.date?.toString()}
                        renderItem={renderDailyItem}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        contentContainerStyle={
                            attendanceHistoryList?.length === 0
                                ? styles.emptyListContent
                                : styles.listContent
                        }
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            attendanceHistoryList?.length == 0 && (
                                <NoDataFound message={"No Data Found"} />
                            )
                        }
                    />
                </View>

                {/* FIXED BOTTOM: Summary Bar */}
                <View style={styles.bottomSummary}>
                    <View style={styles.summaryRow}>
                        {attendanceTypes?.sort((a, b) => Number(a?.sort) - Number(b?.sort))?.map((item, index) => {
                            const status = statusConfig[item?.status] || statusConfig?.Other;
                            return (
                                <View key={index} style={styles.summaryItem}>
                                    <View style={[styles.dot, { backgroundColor: status.color }]} />
                                    <AppText weight='Bold' style={styles.summaryIndex}>{item?.count}</AppText>
                                    <AppText weight='Medium' style={styles.summaryStatus}>{item?.status}</AppText>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>)
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
    },
    fixedHeader: {
        backgroundColor: themes.white, // Keep background solid so list doesn't show behind it
        zIndex: 10,
    },
    listContainer: {
        flex: 1, // This allows the FlatList area to expand and become scrollable
    },
    listContent: {
        paddingTop: verticalScale(6),
        paddingBottom: verticalScale(55) // Space for bottom summary
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statsWrapper: {
        flexDirection: 'row',
        marginTop: verticalScale(12),
        marginBottom: verticalScale(8),
        gap: 8,
        paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal || scale(15),
    },

    imageStyleCard: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 16,
        padding: scale(10),
        elevation: 4,
    },
    cardLeft: { flex: 1 },
    cardLabel: { fontSize: moderateScale(10), color: 'rgba(255,255,255,0.8)' },
    cardValue: { fontSize: moderateScale(18), color: '#fff' },
    progressBarContainer: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        marginTop: 4,
    },
    progressBarFill: { height: 4, backgroundColor: '#fff', borderRadius: 2 },
    iconCircle: {
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center'
    },

    listTitleWrapper: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: verticalScale(10),
        paddingHorizontal: scale(12),
    },
    listTitle: {
        fontSize: moderateScale(16),
    },
    modernCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: themes.white, borderRadius: 12,
        paddingVertical: verticalScale(8), paddingHorizontal: scale(12),
        marginBottom: verticalScale(8), borderWidth: 1, borderColor: themes.borderGrey,
        marginHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
    },
    dateSection: { alignItems: 'center', width: scale(45) },
    verticalDivider: { width: 1, height: '70%', marginHorizontal: scale(15), opacity: 0.3 },
    infoSection: { flex: 1 },
    indicatorPill: { width: 4, height: 30, borderRadius: 4 },
    bottomSummary: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#333', paddingVertical: verticalScale(8),
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-around' },
    summaryItem: { alignItems: 'center', width: width / 6 },
    dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
    summaryIndex: { color: '#fff', fontSize: moderateScale(14) },
    summaryStatus: { color: '#fff', fontSize: 8, textTransform: 'uppercase' }
});

export default AttendanceHistoryList;