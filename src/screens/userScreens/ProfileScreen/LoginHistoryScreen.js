import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import LoginHistorySkeleton from '../../../components/Skeletons/LoginHistorySkeleton';
import CustomHeader from '../../../components/CustomHeader';
import MainBox from '../../../components/MainBox';
import themes from '../../../themes/colors';
import { moderateScale, scale, verticalScale } from '../../../themes/sizes';
import globalStyles from '../../../themes/globalStyles';
import CustomStatusBar from '../../../components/CustomStatusBar';
import AppButton from '../../../components/AppButton';
import ConfirmationModal from '../../../components/Modals/ConfirmationModal';
import { useThemeStore } from '../../../store/useThemeStore';
import { GetLoginHistory, LogoutAllDevices } from '../../../services/profile/profileServices';
import { useAuthStore } from '../../../store/useAuthStore';
import axios from 'axios';
import { showToast } from '../../../components/ShowToas';
import NoDataFound from '../../../components/NoDataFound';
import { useApiRoutesStore } from '../../../store/useApiRoutesStore';


export default function ActiveSessionsScreen() {
    const navigation = useNavigation();

    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();
    const { logout, logoutAll } = useAuthStore()

    const [confirmVisible, setConfirmVisible] = useState(false);
    const [logoutTarget, setLogoutTarget] = useState(null); // 'all' OR session object

    const [btnDisableAll, setBtnDisableAll] = useState(false)
    const [btnLoaderAll, setBtnLoaderAll] = useState(false)
    const [btnSingleLogout, setBtnSingleLogout] = useState(false)


    const [loginHistory, setLoginHistory] = useState([])
    const [loading, setLoading] = useState(false)
    // Current session
    const [currentSession, setCurrentSession] = useState({})

    // This state is used to control the pull-to-refresh loading indicator on the screen
    const [refreshing, setRefreshing] = useState(false);

    // global routes 
    const { routes } = useApiRoutesStore();
console.log(routes,"routesroutes")
    // get LoginHistory Handler 
    const getLoginHistoryHandler = async () => {
        setLoading(true)
        try {
            const res = await GetLoginHistory()
            setCurrentSession(res?.data?.data?.current_session)
            setLoginHistory(res?.data?.data?.other_device_list)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }



    const handleLogoutAll = () => {
        setLogoutTarget('all');
        setConfirmVisible(true);
    };

    const handleLogoutSingle = (session) => {
        setLogoutTarget(session);
        setConfirmVisible(true);
    };


    const handleConfirmLogout = async () => {
        const deviceName = logoutTarget?.device_details?.device_type || "device";
        // ✅ Make device name user-friendly by capitalizing first letter
        // Example: "android" → "Android"
        const formattedDeviceName = deviceName.charAt(0).toUpperCase() + deviceName.slice(1);
        const oldData = [...loginHistory]; // ✅ backup locally
        try {
            // ✅ Optimistic UI Update First
            if (logoutTarget?.token) {
                setLoginHistory(prev =>
                    prev.filter(item => item?.token !== logoutTarget.token)
                );
            }

            if (logoutTarget === "all") {
                setBtnDisableAll(true)
                setBtnLoaderAll(true)
                await LogoutAllDevices(routes?.logout_all_device);
                logoutAll();
            }
            else if (logoutTarget?.token) {
                setBtnSingleLogout(true)
                const res = await axios.post(
                    `${routes?.logout}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${logoutTarget.token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (res?.data?.status_code == 200) {
                    showToast("success", "Success", res?.data?.message || ` ${formattedDeviceName} logged out successfully`, theme?.set_timeout?.toast_message)
                    setBtnSingleLogout(false)
                } else {
                    showToast("error", "Error", res?.data?.message)
                    setBtnDisableAll(false)
                    setBtnSingleLogout(false)
                }
            }

        }
        catch (err) {
            console.log("Logout Error:", err?.response?.data || err.message);
            // ✅ rollback UI if API fails
            setLoginHistory(oldData);
            setBtnDisableAll(false)

        }
        finally {
            setConfirmVisible(false);
            setLogoutTarget(null);
            setBtnLoaderAll(false)
            setBtnSingleLogout(false)

        }
    };

    const handleCancelLogout = () => {
        setConfirmVisible(false);
        setLogoutTarget(null);
    };

    /* ---------------- UI ---------------- */
    const renderSessionItem = ({ item, isCurrent }) => {
        // console.log(item,"-------dddd-----")
        return (
            <View style={[styles.card, isCurrent && styles.currentCard]}>
                <View style={{ flex: 1 }}>
                    <AppText weight='Medium' style={{ fontSize: moderateScale(theme?.text_font_size?.medium), color: theme?.theme?.dark_text, textTransform: 'capitalize', }}>{item?.device_details?.device_type}</AppText>
                    <AppText
                        style={[
                            styles.location,
                            {
                                fontSize: moderateScale(theme?.text_font_size?.small),
                                color: theme?.theme?.medium_text,
                            },
                        ]}
                    >
                        {item?.location_details?.city ||
                            item?.location_details?.region ||
                            item?.location_details?.country
                            ? `${item?.location_details?.city || ''}${item?.location_details?.city && item?.location_details?.region ? ', ' : ''}${item?.location_details?.region || ''}${(item?.location_details?.city || item?.location_details?.region) && item?.location_details?.country ? ', ' : ''}${item?.location_details?.country || ''}`
                            : '---'}
                    </AppText>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                    <AppText style={{ fontSize: moderateScale(theme?.text_font_size?.small), color: theme?.theme?.dark_text }}>{item?.login_duration}</AppText>

                    {isCurrent ? (
                        <AppText style={[styles.activeText, { fontSize: moderateScale(theme?.text_font_size?.small) }]}>Active Now</AppText>
                    ) : (
                        <TouchableOpacity
                            onPress={() => !btnSingleLogout && handleLogoutSingle(item)}
                            style={styles.logoutSingleBtn}
                           
                        >
                            <AppText style={[styles.logoutSingleText, { fontSize: moderateScale(theme?.text_font_size?.extraSmall) }]}>Logout</AppText>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }

    /* ---------- Pull Refresh ---------- */
    const onRefresh = async () => {
        setRefreshing(true);

        try {
            await getLoginHistoryHandler();
        } catch (error) {
            console.log(error);
        }

        setRefreshing(false);
    };

    useEffect(() => {
        getLoginHistoryHandler()
    }, [])

    return (
        <>
            {/* <OrientationLocker orientation={PORTRAIT} /> */}
            <CustomStatusBar backgroundColor={theme?.theme?.primary} barStyle="light-content" translucent />

            <View style={{ flex: 1 }}>
                <CustomHeader
                    title="Active Sessions"
                    titleSize={theme?.heading_font_size?.h4} containerStyle={{ backgroundColor: theme?.theme?.primary }}
                    isBack
                    onBackPress={() => {
                        if (navigation.canGoBack()) navigation.goBack();
                        else navigation.navigate("DrawerNavigator");
                    }}
                />


                <View style={styles.container}>
                    <MainBox paddingVertical={verticalScale(12)} paddingHorizontal={0} height={'100%'} disableScroll>

                        {/* Current */}
                        <View style={styles.headingContainer}>
                            <AppText weight='Bold' style={[styles.heading, { fontSize: moderateScale(theme?.text_font_size?.large), color: theme?.theme?.dark_text }]}>Current Session</AppText>
                        </View>

                        <View style={{ paddingHorizontal: 12, marginBottom: 6 }}>
                            {renderSessionItem({ item: currentSession, isCurrent: true })}
                        </View>

                        {/* Other devices */}
                        <View style={styles.headingContainer}>
                            <AppText weight='Bold' style={[styles.heading, { fontSize: moderateScale(theme?.text_font_size?.large), color: theme?.theme?.dark_text }]}>Other Devices</AppText>
                        </View>
                        {loading ?
                            <LoginHistorySkeleton />
                            :
                            <View style={{ flex: 1, paddingHorizontal: scale(8), marginBottom: verticalScale(48) }}>
                                <FlatList
                                    data={loginHistory}
                                    renderItem={({ item }) => renderSessionItem({ item })}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    contentContainerStyle={{ flexGrow: 1, paddingBottom: verticalScale(6) }}
                                    ListEmptyComponent={<NoDataFound />}
                                />
                            </View>}

                    </MainBox>

                    {/* -------- Fixed Logout All Devices Button -------- */}
                    <View style={styles.fixedButtonContainer}>
                        <AppButton
                            isLoading={btnLoaderAll}
                            title="Logout All Devices"
                            onPress={handleLogoutAll}
                            disabled={btnDisableAll}
                            fullWidth
                            btnStyle={{ backgroundColor: themes.error || "#ef4444", borderRadius: 12 }}
                            textStyle={{ fontSize: moderateScale(theme?.text_font_size?.large) }}
                        />
                    </View>
                </View>
            </View>

            {/* -------- Confirmation Modal -------- */}
            <ConfirmationModal
                visible={confirmVisible}
                title={logoutTarget === 'all' ? 'Logout All Devices' : 'Logout Device'}
                message={
                    logoutTarget === 'all'
                        ? 'Are you sure you want to logout from all devices?'
                        : `Are you sure you want to logout from ${logoutTarget?.device_details?.device_type}?`
                }
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
        paddingVertical: globalStyles?.mainBoxWrapper?.paddingVertical,
        backgroundColor: themes.white,
    },
    headingContainer: {
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: themes.mediumText,
        borderStyle: 'dashed',
        marginBottom: 8,
        alignItems: 'center',
    },
    heading: {
        textAlign: 'center',
        marginBottom: 4,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginVertical: 6,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    currentCard: {
        borderColor: themes.primary,
        backgroundColor: themes?.lightBlue || '#E0F2FE',
    },

    location: {
        marginTop: 2
    },
    lastActive: {
        fontSize: moderateScale(12)
    },
    activeText: {
        color: themes.success, marginTop: 2
    },
    logoutSingleBtn: {
        marginTop: 6,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: '#FEE2E2',
    },
    logoutSingleText: {
        color: '#B91C1C',
        paddingHorizontal: 4,
    },

    fixedButtonContainer: {
        position: 'absolute',
        bottom: 10,
        left: 16,
        right: 16,
        zIndex: 10,
    },
});
