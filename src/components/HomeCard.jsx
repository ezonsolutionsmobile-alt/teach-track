import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Svg, { Circle, G, Ellipse } from 'react-native-svg';
import themes from '../themes/colors';
import { moderateScale } from '../themes/sizes';
import AppText from './AppText';

const HomeCard = ({ title = "Card",titleSize, cardBgColor = "#eff6ff", onPress ,image}) => {

    const iconSize = 44;
    const iconColor = "#fff";
    return (
        <TouchableOpacity activeOpacity={0.7} style={styles.container} onPress={onPress}>
            {/* Icon Circle */}
            <View style={[styles.iconBox, { backgroundColor: cardBgColor }]}>
               
                <Image source={image} style={{ width: "100%", height: "100%" }} />
            </View>
            {/* Title */}
            <AppText weight='Medium' style={{textAlign:'center', fontSize: moderateScale(titleSize)}}>{title}</AppText>
        </TouchableOpacity>
    );
};

export default HomeCard;

const styles = StyleSheet.create({
    container: {
        // width: "31%",
        borderRadius: 18,
        alignItems: "center",
    },

    iconBox: {
        width: 80,
        height: 80,
        borderRadius: 45,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4,
        overflow:'hidden',

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
});
