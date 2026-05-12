// AuthScreenWrapper.js
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';
import CustomStatusBar from '../components/CustomStatusBar';
import themes from '../themes/colors';
import { scale } from '../themes/sizes';
import AppText from './AppText';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AuthScreenWrapper({
    children,
    backgroundImage = null,
    backgroundPattern = null,
    statusBarColor = themes.white,
    barStyle = 'dark-content',
}) {
    const insets = useSafeAreaInsets();

    return (
        <>
            <OrientationLocker orientation={PORTRAIT} />
            <CustomStatusBar backgroundColor={statusBarColor} barStyle={barStyle} />
            <View style={styles.container}>
                {backgroundImage && (
                    <Image
                        source={backgroundImage}
                        style={[styles.bgImage, { bottom: insets.bottom }]}
                        resizeMode="cover"
                        pointerEvents="none"
                    />
                )}
                {backgroundPattern && (
                    <Image
                        source={backgroundPattern}
                        style={[styles.bgImage, { top: 0, opacity: 0.2 }]}
                        resizeMode="cover"
                        pointerEvents="none"
                    />
                )}
                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    extraScrollHeight={20}
                    keyboardOpeningTime={0}
                    enableOnAndroid
                    keyboardShouldPersistTaps="handled"
                >
                    {children}

                    <AppText style={[styles.versionText, { bottom: insets.bottom - 20 }]} color="#fff">
                        version 2.0.0
                    </AppText>
                </KeyboardAwareScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: themes.overlayGrey,

    },
    bgImage: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        height: SCREEN_HEIGHT * 0.45,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignContent: 'center',
        paddingHorizontal: scale(8),
        marginBottom: scale(56),
    },
    versionText: {
        position: 'absolute',
        alignSelf: 'center',
    }
});
