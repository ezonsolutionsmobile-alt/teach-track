import React, { useEffect, useState } from "react";
import { View, Switch, StyleSheet, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppText from "../../../components/AppText";
import AppButton from "../../../components/AppButton";
import CustomHeader from "../../../components/CustomHeader";
import CustomStatusBar from "../../../components/CustomStatusBar";

import { moderateScale, scale, verticalScale } from "../../../themes/sizes";
import { useThemeStore } from "../../../store/useThemeStore";
import themes from "../../../themes/colors";
import * as Keychain from 'react-native-keychain';
import { useIsFocused } from "@react-navigation/native";
import ConfirmationModal from '../../../components/Modals/ConfirmationModal';
import globalStyles from "../../../themes/globalStyles";

export const STORAGE_KEY = "@quick_login_enabled_employee";
export const APP_BIOMETRIC_KEY = "employeeAppBiometric";

const SettingsScreen = ({ navigation }) => {
    const { theme } = useThemeStore();
    const isFocused = useIsFocused();
    const [isEnabled, setIsEnabled] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    // 🔹 State dynamic labels ke liye
    const [biometryLabel, setBiometryLabel] = useState("Biometric Login");

    // 🔹 Load saved state (Biometric Status)
    useEffect(() => {
        const loadBiometricStatus = async () => {
            try {
                const value = await AsyncStorage.getItem(STORAGE_KEY);
                const credentials = await Keychain.getGenericPassword({ service: APP_BIOMETRIC_KEY });

                if (value !== null) {
                    setIsEnabled(value === "true");
                }

                // Production Safe Check: Agar token keychain me nahi hai, toh settings disable rakhein
                if (!credentials) {
                    setDisabled(true);
                    setIsEnabled(false);
                    await AsyncStorage.setItem(STORAGE_KEY, "false");
                } else {
                    setDisabled(false);
                }

                // 🔹 Dynamic Label Verification (iOS hardware classification)
                const biometryType = await Keychain.getSupportedBiometryType();
                if (Platform.OS === 'ios') {
                    if (biometryType === Keychain.BIOMETRY_TYPE.FACE_ID) {
                        setBiometryLabel("Face ID Login");
                    } else if (biometryType === Keychain.BIOMETRY_TYPE.TOUCH_ID) {
                        setBiometryLabel("Touch ID Login");
                    } else {
                        setBiometryLabel("Biometric Login");
                    }
                } else {
                    // Android par hamesha clean Biometric text rahega
                    setBiometryLabel("Biometric Login");
                }

            } catch (error) {
                console.log("Load error:", error);
            }
        };

        if (isFocused) {
            loadBiometricStatus();
        }
    }, [isFocused]);

    // 🔹 Toggle Switch (Enable/Disable Biometric Flow)
    const toggleBiometric = async () => {
        try {
            const newValue = !isEnabled;

            if (newValue) {
                // 1. Hardware Check: Kiya device par FaceID/Fingerprint support hai?
                const biometryType = await Keychain.getSupportedBiometryType();
                if (!biometryType) {
                    Alert.alert("Not Supported", "Biometric authentication is not available on this device.");
                    return;
                }

                // 2. State update aur storage save
                setIsEnabled(true);
                await AsyncStorage.setItem(STORAGE_KEY, "true");
            } else {
                // Turn off flow
                setIsEnabled(false);
                await AsyncStorage.setItem(STORAGE_KEY, "false");
            }
        } catch (e) {
            console.log("Error saving quick login status", e);
        }
    };

    // 🔹 Complete Deletion (Keychain + LocalStorage cleanup)
    const removeBiometric = async () => {
        try {
            await Keychain.resetGenericPassword({ service: APP_BIOMETRIC_KEY }); // Service targeting
            await AsyncStorage.removeItem(STORAGE_KEY);

            setIsEnabled(false);
            setDisabled(true);
            setConfirmVisible(false);
        } catch (e) {
            console.log("remove biometric error:", e);
        }
    };

    const handleConfirm = () => {
        setConfirmVisible(true);
    };

    const handleCancelLogout = () => {
        setConfirmVisible(false);
    };

    // Helper name formatting for sub-texts
    const cleanHardwareName = biometryLabel === "Face ID Login" ? "Face ID" : biometryLabel === "Touch ID Login" ? "Touch ID" : "Biometric";

    return (
        <>
            <CustomStatusBar
                backgroundColor={theme?.theme?.primary}
                barStyle="light-content"
                translucent
            />

            <View style={{ flex: 1, backgroundColor: theme?.theme?.background || "#F9F9F9" }}>
                <CustomHeader
                    title="Settings"
                    titleSize={theme?.heading_font_size?.h4}
                    containerStyle={{ backgroundColor: theme?.theme?.primary }}
                    isBack={true}
                    onBackPress={() => navigation.goBack()}
                />

                <View style={styles.container}>
                    {/* CARD */}
                    <View style={[styles.card, { backgroundColor: "#FFF", borderColor: "#E0E0E0" }]}>

                        {/* Dynamic Title */}
                        <AppText
                            weight="Bold"
                            style={[styles.title, { color: theme?.theme?.dark_text }]}
                        >
                            {biometryLabel}
                        </AppText>

                        <View style={styles.separator} />

                        {/* ROW */}
                        <View style={styles.row}>
                            {/* TEXT */}
                            <View style={styles.contentArea}>
                                <AppText
                                    style={[
                                        styles.description,
                                        {
                                            color: theme?.theme?.dark_text,
                                            opacity: 0.7,
                                        },
                                    ]}
                                >
                                    Enable {cleanHardwareName} for faster and secure login
                                </AppText>
                            </View>

                            {/* SWITCH */}
                            <Switch
                                value={isEnabled}
                                disabled={disabled}
                                onValueChange={toggleBiometric}
                                trackColor={{
                                    false: "#D1D1D1",
                                    true: theme?.theme?.primary || "#4CAF50",
                                }}
                                thumbColor="#FFFFFF"
                                style={styles.switchStyle}
                            />
                        </View>

                        {/* REMOVE BUTTON (Dynamic Title) */}
                        <AppButton
                            title={`Remove ${biometryLabel}`}
                            fullWidth
                            onPress={handleConfirm}
                            btnStyle={{ backgroundColor: themes?.redText || "#D32F2F", marginTop: verticalScale(15) }}
                            disabled={disabled}
                        />

                        {disabled && (
                            <AppText
                                weight="Medium"
                                style={{
                                    color: themes?.redText || "red",
                                    fontSize: moderateScale(12),
                                    textAlign: "center",
                                    marginTop: verticalScale(10)
                                }}
                            >
                                * Please login first to enable/manage biometric settings.
                            </AppText>
                        )}
                    </View>
                </View>
            </View>

            {/* -------- Confirmation Modal (Dynamic text alerts) -------- */}
            <ConfirmationModal
                visible={confirmVisible}
                title={`Remove ${cleanHardwareName}`}
                message={`Are you sure you want to remove ${cleanHardwareName} login? You will need to login manually next time.`}
                onConfirm={removeBiometric}
                onCancel={handleCancelLogout}
                confirmTitle="Remove"
            />
        </>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
        paddingVertical: globalStyles?.mainBoxWrapper?.paddingVertical,
        backgroundColor: themes.off_white,
    },
    card: {
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(14),
        borderWidth: 1,
        borderRadius: 10,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    title: {
        fontSize: moderateScale(16),
    },
    separator: {
        height: 1,
        backgroundColor: "#F0F0F0",
        marginVertical: verticalScale(10),
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    contentArea: {
        flex: 1,
        paddingRight: scale(10),
    },
    description: {
        fontSize: moderateScale(12),
        lineHeight: verticalScale(16),
    },
    switchStyle: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
        marginLeft: scale(10),
    },
});