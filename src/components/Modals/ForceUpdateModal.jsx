import React from 'react';
import {
    View,
    StyleSheet,
    Linking,
    Platform,
} from 'react-native';

import AppModal from './AppModal';
import AppText from '../AppText';
import AppButton from '../AppButton';

import themes from '../../themes/colors';
import { moderateScale, scale, verticalScale } from '../../themes/sizes';
import { useThemeStore } from '../../store/useThemeStore';
import { UpdateIcon } from '../../assets/Icons';

export default function ForceUpdateModal({ visible }) {
    const { theme } = useThemeStore();

    const handleUpdate = async () => {
        if (Platform.OS === 'ios') {
            const appStoreUrl =
                'https://apps.apple.com/pk/app/employeedesk/id6776662414';

            await Linking.openURL(appStoreUrl);
            return;
        }

        const packageName = 'com.urschooling.sms.employeeapp';

        const playStoreAppUrl =
            `market://details?id=${packageName}`;

        const playStoreWebUrl =
            `https://play.google.com/store/apps/details?id=${packageName}`;

        try {
            const supported = await Linking.canOpenURL(playStoreAppUrl);

            if (supported) {
                await Linking.openURL(playStoreAppUrl);
            } else {
                await Linking.openURL(playStoreWebUrl);
            }
        } catch (error) {
            console.log('Unable to open Google Play Store:', error);

            try {
                await Linking.openURL(playStoreWebUrl);
            } catch (webError) {
                console.log('Unable to open Play Store web URL:', webError);
            }
        }
    };

    return (
        <AppModal
            visible={visible}
            onClose={() => { }}
        >
            <View style={styles.modalWrapper}>

                {/* UPDATE ICON */}
                <View
                    style={[
                        styles.iconContainer,
                        {
                            backgroundColor:
                                theme?.theme?.primary
                                    ? `${theme.theme.primary}15`
                                    : '#E8F8FB',
                        },
                    ]}
                >
                    <UpdateIcon
                        width={48}
                        height={48}
                        color={
                            theme?.theme?.primary ||
                            '#17A2B8'
                        }
                    />
                </View>

                {/* HEADER */}
                <View style={styles.header}>
                    <AppText
                        weight="SemiBold"
                        style={[
                            styles.title,
                            {
                                fontSize: moderateScale(
                                    theme?.heading_font_size?.h5
                                ),
                                color:
                                    theme?.theme?.dark_text ||
                                    themes.darkText,
                            },
                        ]}
                    >
                        Update Required
                    </AppText>
                </View>

                {/* BODY */}
                <View style={styles.body}>

                    <AppText
                        weight="Medium"
                        style={[
                            styles.message,
                            {
                                fontSize: moderateScale(
                                    theme?.text_font_size?.large
                                ),
                                color:
                                    theme?.theme?.medium_text ||
                                    themes.mediumText,
                            },
                        ]}
                    >
                        A new version of StudentDesk is available.
                        Please update the app to continue using StudentDesk.
                    </AppText>

                </View>

                {/* BUTTON */}
                <View style={styles.bottom}>
                    <AppButton
                        title="Update Now"
                        onPress={handleUpdate}
                        fullWidth
                    />
                </View>

            </View>
        </AppModal>
    );
}

const styles = StyleSheet.create({
    modalWrapper: {
        backgroundColor: themes.white,
        borderRadius: 18,
        paddingHorizontal: scale(18),
        paddingTop: verticalScale(22),
        paddingBottom: verticalScale(14),
        overflow: 'hidden',
        alignItems: 'center',
    },

    iconContainer: {
        width: scale(78),
        height: scale(78),
        borderRadius: scale(39),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },

    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(10),
    },

    title: {
        textAlign: 'center',
    },

    body: {
        alignItems: 'center',
        paddingHorizontal: scale(8),
        marginBottom: verticalScale(18),
    },

    message: {
        textAlign: 'center',
        lineHeight: verticalScale(22),
    },

    bottom: {
        width: '100%',
        borderTopWidth: 1,
        borderColor: themes.borderGrey,
        paddingTop: verticalScale(10),
    },
});