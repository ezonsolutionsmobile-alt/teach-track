import React from 'react';
import { View, StyleSheet } from 'react-native';
import { moderateScale } from '../themes/sizes';
import AppText from './AppText';
import themes from '../themes/colors';
import { useThemeStore } from '../store/useThemeStore';
import { CheckIcon, CrossIcon } from '../assets/Icons';

export const toastConfig = {

    success: ({ text1, text2 }) => {
        const { theme } = useThemeStore();
        return (
            <View style={[styles.container, { borderLeftColor: themes.greenText }]}>
                <View style={styles.row}>
                    <View style={[styles.iconWrapper, { backgroundColor: themes.greenText }]}>
                        <CheckIcon width={16} height={16} color="#fff" />
                    </View>
                    <View style={styles.textContainer}>
                        {text1 && <AppText weight='Bold' style={[styles.title, { fontSize: theme?.heading_font_size?.h4 }]}>{text1}</AppText>}
                        {text2 && <AppText style={[styles.message, { fontSize: theme?.heading_font_size?.h5 }]}>{text2}</AppText>}
                    </View>
                </View>
            </View>
        );
    },

    error: ({ text1, text2 }) => {
        const { theme } = useThemeStore();
        return (
            <View style={[styles.container, { borderLeftColor: 'red' }]}>
                <View style={styles.row}>
                    <View style={[styles.iconWrapper, { backgroundColor: 'red' }]}>
                        <CrossIcon width={16} height={16} color="#fff" />
                    </View>
                    <View style={styles.textContainer}>
                        {text1 && <AppText weight='Bold' style={[styles.title, { fontSize: theme?.heading_font_size?.h4 }]}>{text1}</AppText>}
                        {text2 && <AppText style={[styles.message, { fontSize: theme?.heading_font_size?.h5 }]}>{text2}</AppText>}
                    </View>
                </View>
            </View>
        );
    },

};

const styles = StyleSheet.create({
    container: {
        padding: 14,
        backgroundColor: 'white',
        borderLeftWidth: 5,
        borderRadius: 8,
        width: '90%',
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16, // makes it circular
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 10, // space between icon and text
        flex: 1,
    },
    title: {
        color: themes.darkText,
    },
    message: {
        marginTop: 4,
        color: themes.darkGrey,
        fontWeight: '700',
    },
});