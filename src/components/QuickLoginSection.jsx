import React, { useState, useEffect } from 'react';
import { View, Switch, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moderateScale, scale, verticalScale } from '../themes/sizes';
import AppText from './AppText';
import { useThemeStore } from '../store/useThemeStore';
import { faceId_icon, fingerprint_icon } from '../assets';
import { STORAGE_KEY } from '../screens/userScreens/ProfileScreen/SettingsScreen';


const QuickLoginSection = ({ onEnable, isEnabled, setIsEnabled }) => {
    const { theme } = useThemeStore();

    useEffect(() => {
        const loadStatus = async () => {
            try {
                const savedStatus = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedStatus !== null) {
                    setIsEnabled(JSON.parse(savedStatus));
                } else {

                }
            } catch (e) {
                console.log("Error loading quick login status", e);
            }
        };
        loadStatus();
    }, []);

   
    if (!isEnabled) return null
    return (
        <View style={styles.container}>
            {/* Divider OR Section */}
            <View style={styles.dividerRow}>
                <View style={styles.line} />
                <AppText style={styles.orText}>OR</AppText>
                <View style={styles.line} />
            </View>

            {/* Quick Login Card */}
            <View style={[styles.card, { borderColor: '#E0E0E0', backgroundColor: '#FFF' }]}>
                {/* <AppText weight="Bold" style={[styles.title, { color: theme?.theme?.dark_text }]}>
                    Enable Quick Login
                </AppText> */}


                <View style={styles.row}>
                    <View style={styles.contentArea}>
                        {isEnabled ? (
                            // Jab Toggle ON ho: TouchableOpacity add ki hai icons par
                            <TouchableOpacity
                                style={styles.iconWrapper}
                                onPress={onEnable}
                                activeOpacity={0.6}
                            >
                                <View style={styles.row}>
                                    {Platform.OS === "ios" ? (
                                        <Image
                                            source={faceId_icon}
                                            style={styles.iconImage}
                                            resizeMode="contain"
                                        />
                                    ) : (
                                        <Image
                                            source={fingerprint_icon}
                                            style={styles.iconImage}
                                            resizeMode="contain"
                                        />
                                    )}

                                    <AppText
                                        weight="Medium"
                                        style={[
                                            styles.enabledText,
                                            {
                                                fontSize: moderateScale(theme?.text_font_size?.small),
                                                color: theme?.theme?.medium_text,
                                                marginLeft: 10, // 👈 important spacing
                                            },
                                        ]}
                                    >
                                        Unlock your account securely with biometrics
                                    </AppText>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            // Jab Toggle OFF ho: Normal Text
                            <AppText style={[styles.description, { color: theme?.theme?.dark_text, opacity: 0.7 }]}>
                                Enable biometric login for faster and secure access
                            </AppText>
                        )}
                    </View>

                    {/* <Switch
                        trackColor={{ false: "#D1D1D1", true: theme?.theme?.primary || "#4CAF50" }}
                        thumbColor={"#FFFFFF"}
                        ios_backgroundColor="#D1D1D1"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        style={styles.switchStyle}
                    /> */}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: verticalScale(12)
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(10),
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    orText: {
        marginHorizontal: 10,
        fontSize: moderateScale(14),
        color: '#888',
        fontWeight: '600'
    },
    card: {
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(12),
        borderRadius: 8,
        borderWidth: 1,

    },
    title: {
        fontSize: moderateScale(16),
        marginBottom: verticalScale(4),
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: verticalScale(10),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // minHeight: verticalScale(40),
    },
    contentArea: {
        flex: 1,
        justifyContent: 'center',
    },
    iconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between"
    },
    iconImage: {
        width: scale(28),
        height: scale(28),
    },
    enabledText: {
        marginLeft: scale(10),
    },
    description: {
        fontSize: moderateScale(12),
        paddingRight: scale(10),
        lineHeight: verticalScale(16),
    },
    switchStyle: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
        marginLeft: scale(10),
    }
});

export default QuickLoginSection;