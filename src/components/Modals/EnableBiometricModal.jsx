import React, { useEffect, useRef } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { moderateScale, scale, verticalScale } from '../../themes/sizes';
import AppText from '../AppText';
import { useThemeStore } from '../../store/useThemeStore';

const EnableBiometricModal = ({
    visible,
    onEnable,
    onSkip,
}) => {
    const { theme } = useThemeStore();
    const scaleAnim = useRef(new Animated.Value(0.7)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0.7);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ scale: scaleAnim }],
                            opacity: opacityAnim,
                        },
                    ]}
                >
                    {/* ICON SECTION (Safe/Shield Icon feel) */}
                    <View style={[styles.iconWrapper, { backgroundColor: '#E0F2FE' }]}>
                        <AppText style={{ fontSize: moderateScale(24) }}>🛡️</AppText>
                    </View>

                    {/* TITLE */}
                    <AppText weight='Bold' style={[styles.title, { color: theme?.theme?.dark_text }]}>
                        Enable Biometric Login
                    </AppText>

                    {/* MESSAGE */}
                    <AppText style={styles.message}>
                        Setup Fingerprint or Face ID for a faster and more secure login experience.
                    </AppText>

                    {/* BUTTONS */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.skipBtn}
                            onPress={onSkip}
                            activeOpacity={0.7}
                        >
                            <AppText weight='Medium' style={styles.skipText}>Maybe Later</AppText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.enableBtn, { backgroundColor: theme?.theme?.primary || '#0EA5E9' }]}
                            onPress={onEnable}
                            activeOpacity={0.7}
                        >
                            <AppText weight='Bold' style={styles.enableText}>Enable Now</AppText>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default EnableBiometricModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    iconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: moderateScale(18),
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: moderateScale(13),
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: verticalScale(18),
    },
    buttonRow: {
        flexDirection: 'column', // Stacked buttons for better focus
        width: '100%',
    },
    enableBtn: {
        width: '100%',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 8,
    },
    skipBtn: {
        width: '100%',
        padding: 12,
        alignItems: 'center',
    },
    enableText: {
        color: '#fff',
        fontSize: moderateScale(14),
    },
    skipText: {
        color: '#94A3B8',
        fontSize: moderateScale(13),
    },
});