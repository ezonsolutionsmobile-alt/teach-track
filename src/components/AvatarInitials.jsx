import React from 'react';
import { View, StyleSheet } from 'react-native';
import { moderateScale } from '../themes/sizes';
import AppText from './AppText';
import { getAvatarColor, getInitials } from '../utils/getInitials';

const AvatarInitials = ({
    firstName = '',
    lastName = '',
    avatarStyle,
    theme,
    borderColor = '#FFFFFF'
}) => {
    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: getAvatarColor(
                        `${firstName} ${lastName}`
                    ),
                    borderWidth: 2,
                    borderColor: borderColor,
                },
                avatarStyle,
            ]}
        >
            <AppText
                weight="Bold"
                style={styles.text(theme)}
            >
                {getInitials(firstName, lastName)}
            </AppText>
        </View>
    );
};

export default AvatarInitials;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: (theme) => ({
        color: '#FFFFFF',
        fontSize: moderateScale(
            theme?.heading_font_size?.h3
        ),
    }),
});