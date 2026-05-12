import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, Text, StyleSheet } from 'react-native';
import themes from '../themes/colors';
import { moderateScale } from '../themes/sizes';

export default function CustomTabButton({ title, active = false, onPress, style, isFirst, isLast, theme }) {
    const anim = useRef(new Animated.Value(active ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: active ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [active]);

    const backgroundColor = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [themes.borderGrey, theme?.theme?.primary],
    });

    const textColor = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [title == "Cancelled" ? themes?.error : theme?.theme?.dark_text, '#fff'],
    });

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor,
                    borderTopLeftRadius: isFirst ? 8 : 0,
                    borderBottomLeftRadius: isFirst ? 8 : 0,
                    borderTopRightRadius: isLast ? 8 : 0,
                    borderBottomRightRadius: isLast ? 8 : 0,
                },
                style,
            ]}
        >
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.tabButton}>
                <Animated.Text style={[styles.tabText, { fontWeight: '600', fontSize: moderateScale(theme?.text_font_size?.medium), color: textColor }]}>
                    {title}
                </Animated.Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabButton: {
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
