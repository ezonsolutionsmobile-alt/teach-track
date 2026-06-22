import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet, Animated, Image, ActivityIndicator } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { WebView } from 'react-native-webview';
import AppText from '../../../components/AppText';
import CustomHeader from '../../../components/CustomHeader';
import CustomStatusBar from '../../../components/CustomStatusBar';
import { useThemeStore } from '../../../store/useThemeStore';
import { scale, verticalScale } from '../../../themes/sizes';
import themes from '../../../themes/colors';
import CustomTabButton from '../../../components/CustomTabButton';
import { showToast } from '../../../components/ShowToas';
import AttendanceHistoryList from '../../../components/AttendanceHistoryList';
import { useIsFocused } from '@react-navigation/native';
import { AttCheckin, GetFenceAndLastCheckDetails } from '../../../services/attendance/staffAttendanceServices';
import { map_image } from '../../../assets';
import { useApiRoutesStore } from '../../../store/useApiRoutesStore';
import globalStyles from '../../../themes/globalStyles';
import MonthYearPickerModal from '../../../components/MonthYearPickerModal';
import Sound from 'react-native-sound';
import { useTabStore } from '../../../store/useTabStore';
import { DashedBorder } from '../../../assets/Icons';
import { useSoundEffect } from '../../../hooks/useSoundEffect';

const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function CheckInOutScreen({ navigation }) {
    const { theme } = useThemeStore();

    const playSuccessSound = useSoundEffect('send.wav');
    const { setLastHomeScreen, setActiveTab: setSideActiveTab } = useTabStore();

    const [activeTab, setActiveTab] = useState('Check In/Out');
    const isFocused = useIsFocused();
    const [locationList, setLocationList] = useState([]);
    const [lastCheckIn, setLastCheckIn] = useState({ last_check_in: "--:--", last_check_out: "--:--" });
    const [CheckInOutLoading, setCheckInOutLoading] = useState(false);
    const [isMapLoading, setIsMapLoading] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current; // New Animation Value
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [geofenceLoading, setGeofenceLoading] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    // Default location ALLOWED_AREA par rakhi hai taake map blank na ho
    const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0, accuracy: 0 });
    const [isInsideArea, setIsInsideArea] = useState(false);

    const [showPicker, setShowPicker] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const getFenceAndLastCheckDetailsHandler = async () => {
        setGeofenceLoading(true)
        try {
            const res = await GetFenceAndLastCheckDetails();

            const formatted = (res?.data?.location_list || []).map(item => ({
                lat: Number(item.latitude),
                lng: Number(item.longitude),
                radius: Number(item.radius)
            }));

            setLocationList(formatted);
            setLastCheckIn(res?.data?.last_check?.data || null);

        } catch (error) {
            console.log("Error:", error);
        } finally {
            setGeofenceLoading(false)
        }
    };
    useEffect(() => {
        if (activeTab == "Check In/Out") {
            getFenceAndLastCheckDetailsHandler()
        }
    }, [activeTab])

    const checkInsideAnyArea = (lat, lng, locations) => {
        return locations.some(area => {
            const distance = getDistance(lat, lng, area.lat, area.lng);
            return distance <= area.radius;
        });
    };



    // Map load hone par animation trigger karein
    useEffect(() => {
        if (!isMapLoading) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800, // 800ms ka smooth transition 
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0); // Reset if loading starts again
        }
    }, [isMapLoading]);

    const handleMapLoaded = () => {
        setIsMapLoading(false);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    };




    // 1. Location Tracking Logic
    useEffect(() => {
        if (!isFocused || locationList.length === 0) return;
        let watchId;
        setUserLocation({ lat: locationList[0]?.latitude, lng: locationList[0]?.longitude, })
        const initLocation = async () => {
            setIsLoadingLocation(true)

            const hasPermission = await requestPermission();
            if (!hasPermission) {
                showToast("error", "Permission Denied", "Location access is required.");
                return;
            }

            // Location get karne se pehle ek dafa current position check karlein
            Geolocation.getCurrentPosition(
                pos => {
                    const { latitude, longitude, accuracy } = pos.coords;
                    setUserLocation({ lat: latitude, lng: longitude, accuracy });
                    setIsInsideArea(checkInsideAnyArea(latitude, longitude, locationList));
                    setIsLoadingLocation(false)
                },
                err => {
                    console.log('Initial Location Error:', err);
                    setIsLoadingLocation(false); // ❗ Error pe bhi stop karo
                },
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
            );

            // Continuous watching
            watchId = Geolocation.watchPosition(
                pos => {
                    const { latitude, longitude, accuracy } = pos.coords;
                    setUserLocation({ lat: latitude, lng: longitude, accuracy });
                    setIsInsideArea(checkInsideAnyArea(latitude, longitude, locationList));
                },
                err => {
                    console.log('WatchPosition Error:', err);
                    if (err.code === 2) {
                        showToast("error", "GPS Disabled", "Please turn on your GPS.");
                    }
                },
                {
                    enableHighAccuracy: false, // Isay false rakhein agar accuracy ka issue aa raha hai
                    distanceFilter: 0,         // 0 rakhein taake har choti movement detect ho testing ke waqt
                    interval: 3000,
                    fastestInterval: 2000,
                    timeout: 15000
                }
            );
        };

        initLocation();
        return () => watchId && Geolocation.clearWatch(watchId);
    }, [isFocused, locationList]);

    // 2. Pulse Animation
    useEffect(() => {
        let animation;
        if (isInsideArea && activeTab === 'Check In/Out') {
            animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                ])
            );
            animation.start();
        } else {
            pulseAnim.setValue(1);
        }
        return () => animation?.stop();
    }, [isInsideArea, activeTab]);

    const requestPermission = async () => {
        if (Platform.OS === 'ios') return true;
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    };

    const CheckInOutTime = (time) => {
        if (!time || time === '-' || time === '--' || time === 'null') {
            return false;
        }
        return true;
    };
    const checkedOut = !CheckInOutTime(lastCheckIn?.last_check_out) && CheckInOutTime(lastCheckIn?.last_check_in);


    const handleAction = async () => {
        if (!isInsideArea) {
            showToast("error", "Outside Area", "You are not in the office zone.");
            return;
        }

        const body = {
            latitude: userLocation?.lat,
            longitude: userLocation?.lng,
            accuracy: userLocation?.accuracy,
        };
        try {
            setCheckInOutLoading(true);

            const res = await AttCheckin(body);

            if (res?.status) {
                const actionType = !checkedOut
                    ? "Check In"
                    : "Check Out";

                showToast("success", `${actionType} successful`);
                playSuccessSound();
                await getFenceAndLastCheckDetailsHandler();
            } else {
                showToast("error", res?.message || "Action failed");
            }

        } catch (error) {
            console.log("CheckIn/Out Error:", error);
            showToast("error", "Something went wrong");
        } finally {
            setCheckInOutLoading(false); // 🔥 always runs
        }
    };



    // 3. Memoized Map HTML
    const mapHtml = useMemo(() => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<style>
html, body, #map { height: 100%; margin: 0; }
</style>
</head>
<body>
<div id="map"></div>
<script>
var map = L.map('map', { 
                center: [${userLocation.lat}, ${userLocation.lng}], 
                zoom: 16, 
                zoomControl: false,      // Hide +/- buttons
                dragging: false,          // Disable panning
                touchZoom: false,         // Disable pinch zoom
                doubleClickZoom: false,   // Disable dbl click zoom
                scrollWheelZoom: false,   // Disable mouse wheel
                boxZoom: false,           // Disable box zoom
                keyboard: false           // Disable keyboard nav
            });


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// User Marker
L.marker([${userLocation.lat}, ${userLocation.lng}]).addTo(map);

// Multiple Circles
var locations = ${JSON.stringify(locationList)};

locations.forEach(loc => {
    L.circle([loc.lat, loc.lng], {
        color: '#50C878',
        radius: loc.radius,
        fillOpacity: 0.2
    }).addTo(map);
});
</script>
</body>
</html>
`, [userLocation, locationList]);


    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            // 👈 Sirf back / pop pe chalega
            setLastHomeScreen("Dashboard");
            setSideActiveTab("Dashboard");
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={[styles.container, { backgroundColor: theme?.theme?.background }]}>
            <CustomStatusBar backgroundColor={theme?.theme?.primary} />
            <CustomHeader title="My Attendance"
                // isBack 
                // onBackPress={() => navigation.goBack()}
                isMenu={true}
                onLeftPress={() => navigation.openDrawer()}
                titleSize={theme?.heading_font_size?.h4}
                containerStyle={{ backgroundColor: theme?.theme?.primary }}
            />

            {(geofenceLoading || (isLoadingLocation && !userLocation?.lat)) && (
                <View style={styles.dataOverlay}>
                    <ActivityIndicator size="small" color={theme?.theme?.primary} />
                    <AppText style={{ marginTop: 10 }}>Fetching location...</AppText>
                </View>
            )}
            {showPicker && (
                <MonthYearPickerModal
                    visible={showPicker}
                    value={selectedDate}
                    onClose={() => setShowPicker(false)}
                    onConfirm={(date) => setSelectedDate(date)}
                />
            )}
            <View style={styles.statusRow}>
                <StatusItem label="Last Chaeck In" time={CheckInOutTime(lastCheckIn?.last_check_in) ? lastCheckIn?.last_check_in : '--:--'} theme={theme} color={themes?.greenText} />
                <View style={styles.statusDivider} />
                <StatusItem label="Last Check Out" time={CheckInOutTime(lastCheckIn?.last_check_out) ? lastCheckIn?.last_check_out : '--:--'} theme={theme} color={themes?.error} />
            </View>
            {Platform.OS === 'ios' &&
                <View style={{}}>
                    <DashedBorder color={theme?.theme?.medium_text} />
                </View>
            }
            <View style={styles.tabContainer}>
                <View style={styles.tabRow}>
                    {['Check In/Out', 'History'].map((tab, idx) => (
                        <CustomTabButton key={tab} title={tab} active={activeTab === tab} onPress={() => setActiveTab(tab)} theme={theme} isFirst={idx === 0} isLast={idx === 1} />
                    ))}
                </View>
            </View>

            {activeTab === 'Check In/Out' ? (
                <View style={{ flex: 1 }}>
                    <View style={styles.mapWrapper}>
                        {/* 1. Placeholder Image (Hamesha render hogi, map load hote hi piche chhup jayegi) */}
                        <Image
                            source={map_image}
                            style={styles.placeholderImage}
                            resizeMode="cover"
                        />

                        {/* 2. WebView (Hamesha render hoga taake loading start ho sake) */}
                        <Animated.View style={[styles.webViewContainer, { opacity: fadeAnim }]}>
                            <WebView
                                originWhitelist={['*']}
                                source={{ html: mapHtml }}
                                scrollEnabled={false}
                                onLoad={handleMapLoaded}
                                onLoadEnd={handleMapLoaded}
                                androidLayerType="hardware"
                                domStorageEnabled={true}
                                javaScriptEnabled={true}
                                style={styles.webView}
                            />
                        </Animated.View>

                        {/* 3. Loader Spinner (Sirf tab dikhega jab isMapLoading true ho) */}
                        {isMapLoading && userLocation?.lat !== 0 && (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="small" color={theme?.theme?.primary} />
                            </View>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        <View style={styles.animationBox}>

                            {isInsideArea && (
                                <Animated.View
                                    style={[
                                        styles.pulseRing,
                                        {
                                            transform: [{ scale: pulseAnim }],
                                            borderColor: checkedOut ? themes?.redText : "#50C878",
                                            opacity: pulseAnim.interpolate({
                                                inputRange: [1, 1.2],
                                                outputRange: [0.6, 0],
                                            }),
                                        },
                                    ]}
                                />
                            )}

                            <TouchableOpacity
                                onPress={handleAction}
                                style={[
                                    styles.checkButton,
                                    {
                                        backgroundColor: checkedOut ? themes?.redText : "#50C878",
                                        opacity: isInsideArea ? 1 : 0.6,
                                    },
                                ]}
                            >
                                <AppText
                                    weight="Bold"
                                    color="#fff"
                                    size={theme?.heading_font_size?.h5}
                                >
                                    {CheckInOutLoading ? 'Processing...' : checkedOut ? 'Check Out' : 'Check In'}
                                </AppText>
                            </TouchableOpacity>

                        </View>

                        <AppText
                            weight="SemiBold"
                            size={theme?.text_font_size?.medium_small}
                            color={isInsideArea ? themes?.greenText : themes?.redText}
                            style={{ marginTop: 20 }}
                        >
                            {isInsideArea ? (
                                checkedOut ? (
                                    <>
                                        You are checked in.{" "}
                                        <AppText color={themes?.redText} weight="Bold">
                                            Tap to check out
                                        </AppText>
                                    </>
                                ) : (
                                    <>
                                        You are at work location.{" "}
                                        <AppText color="#50C878" weight="Bold">
                                            Tap to check in
                                        </AppText>
                                    </>
                                )
                            ) : (
                                "Outside office area"
                            )}
                        </AppText>
                    </View>
                </View>
            ) : (
                <AttendanceHistoryList
                    selectedDate={selectedDate}
                    setShowPicker={setShowPicker}
                    CheckInOutTime={CheckInOutTime}
                />
            )}

        </View>
    );
}

const StatusItem = ({ label, time, theme, color }) => (
    <View style={styles.statusItem}>
        <AppText color={color} weight="Medium">{label}</AppText>
        <AppText color={color} weight="Bold">{time}</AppText>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, position: 'relative' },
    statusRow: {
        flexDirection: 'row',
        paddingVertical: verticalScale(8),
        ...Platform.select({
            android: {
                borderBottomWidth: 1,
                borderBottomColor: themes.mediumText,
                borderStyle: 'dashed',
            },
            ios: {
            },
        }),
    },
    statusItem: { alignItems: 'center', flex: 1 },
    statusDivider: { width: 1, height: 25, backgroundColor: '#ddd' },
    tabContainer: {
        paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
        marginVertical: verticalScale(10)
    },
    dataOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // 👈 50% dark overlay
        zIndex: 10
    },
    tabRow: { flexDirection: 'row' },
    buttonContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 20 },
    animationBox: { justifyContent: 'center', alignItems: 'center' },
    pulseRing: { position: 'absolute', width: scale(160), height: scale(160), borderRadius: scale(80), borderWidth: 6 },
    checkButton: {
        width: scale(150), height: scale(150), borderRadius: scale(75), justifyContent: 'center', alignItems: 'center',
        elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4
    },
    datePickerContainer: {
        marginTop: verticalScale(8),
        paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal
    },
    mapWrapper: {
        height: verticalScale(220),
        width: '100%',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden'
    },
    placeholderImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    webViewContainer: {
        ...StyleSheet.absoluteFillObject, // Map ko image ke upar rakhega
    },
    webView: {
        flex: 1,
        backgroundColor: 'transparent', // Transparent taake transition ganda na lage
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },

});