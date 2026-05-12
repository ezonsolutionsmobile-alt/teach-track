import React, { useEffect, useState } from "react";
import { View, Switch, StyleSheet } from "react-native";
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


export const STORAGE_KEY = "@quick_login_enabled_employee";
export const APP_BIOMETRIC_KEY = "employeeAppBiometric"

const SettingsScreen = ({ navigation }) => {
    const { theme } = useThemeStore();
    const isFocused = useIsFocused();
    const [isEnabled, setIsEnabled] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    // 🔹 Load saved state
    useEffect(() => {
        const loadBiometricStatus = async () => {
            try {
                const value = await AsyncStorage.getItem(STORAGE_KEY);
                const credentials = await Keychain.getGenericPassword({ service: APP_BIOMETRIC_KEY });
                if (value !== null) {
                    setIsEnabled(value === "true");
                }
                if (!credentials) {
                    setDisabled(true);
                }
            } catch (error) {
                console.log("Load error:", error);
            }
        };

        loadBiometricStatus();
    }, [isFocused]);

    // 🔹 Enable / Disable biometric
    const toggleBiometric = async () => {
        try {

            const newValue = !isEnabled;
            setIsEnabled(newValue);

            if (newValue) {
                await AsyncStorage.setItem(STORAGE_KEY, "true");
            } else {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(false));
            }

        } catch (e) {
            console.log("Error saving quick login status", e);
        }
    };

    // 🔹 Remove biometric completely
    const removeBiometric = async () => {
        try {
            await Keychain.resetGenericPassword();
            setIsEnabled(false);
            await AsyncStorage.removeItem(STORAGE_KEY);
            setDisabled(true)
            setConfirmVisible(false)

        } catch (e) {
            console.log("remove biometric error:", e);
        }
    };




    const handleConfirm = async () => {
        setConfirmVisible(true);
    };

    const handleCancelLogout = () => {
        setConfirmVisible(false);
    };



    return (
        <>
            <CustomStatusBar
                backgroundColor={theme?.theme?.primary}
                barStyle="light-content"
                translucent
            />

            <View style={{ flex: 1 }}>
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

                        <AppText
                            weight="Bold"
                            style={[styles.title, { color: theme?.theme?.dark_text }]}
                        >
                            Biometric Login
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
                                    Enable Face ID / Fingerprint for faster and secure login
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

                        {/* REMOVE BUTTON */}
                        <AppButton
                            title="Remove Biometric Login"
                            fullWidth
                            onPress={handleConfirm}
                            btnStyle={{ backgroundColor: themes?.redText, marginTop: 15 }}
                            disabled={disabled}
                        />
                        {disabled && (
                            <AppText
                                weight="Medium"
                                style={{
                                    color: themes?.redText || "red",
                                    fontSize: moderateScale(12),
                                    textAlign: "center",
                                }}
                            >
                                * Please login first to enable/manage biometric settings.
                            </AppText>
                        )}
                    </View>
                </View>
            </View>
            {/* -------- Confirmation Modal -------- */}
            <ConfirmationModal
                visible={confirmVisible}
                title={'Remove Biometric'} // Title ko clear kiya
                message={'Are you sure you want to remove Face ID / Fingerprint login? You will need to login manually next time.'} // Detail add ki
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
        padding: scale(12),
    },

    card: {
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(14),
        borderWidth: 1,
        borderRadius: 10,
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