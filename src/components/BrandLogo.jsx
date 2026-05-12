import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { moderateScale } from '../themes/sizes';
import themes from '../themes/colors';
import AppText from './AppText';
import { useThemeStore } from '../store/useThemeStore';
const BrandLogo = () => {
    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();
    return (
        <View style={styles.topLogoContainer}>
            <View style={[styles.topLogoContent, { borderBottomColor: theme?.theme?.primary, }]}>
                {/* <Image source={brandLogo} style={styles.smallLogo} /> */}
                <AppText style={[styles.topLogoText, { color: theme?.theme?.primary, fontSize: moderateScale(theme?.heading_font_size?.h5) }]}>EZONSOLUTION</AppText>
            </View>
        </View>
    )
}

export default BrandLogo

const styles = StyleSheet.create({
    topLogoContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: moderateScale(2),
        gap: 1,
    },

    topLogoContent: {
        flexDirection: 'row',   // content layout
        alignItems: 'baseline',
        borderBottomWidth: 1,    // border only under content
        paddingBottom: 2,
    }
    ,
    smallLogo: {
        width: moderateScale(36),
        height: moderateScale(36),
        marginBottom: 8,
    },
    topLogoText: {
        // fontSize: moderateScale(18),
        fontFamily: 'Inter-Bold',
        letterSpacing: 1.2,
    },
})