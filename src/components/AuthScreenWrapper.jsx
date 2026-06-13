// AuthScreenWrapper.js
import React from 'react';
import { View, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';
import CustomStatusBar from '../components/CustomStatusBar';
import themes from '../themes/colors';
import { scale } from '../themes/sizes';
import AppText from './AppText';
import APP_CONFIG from '../config/app.config';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AuthScreenWrapper({
    children,
    backgroundImage = null,
    backgroundPattern = null,
    statusBarColor = themes.white,
    barStyle = 'dark-content',
}) {
    const insets = useSafeAreaInsets();

    const { height: SCREEN_HEIGHT } = Dimensions.get('window');
    const DYNAMIC_OFFSET = Platform.select({
        ios: -SCREEN_HEIGHT * 0.22, // Screen ki total height ka 15% negative offset
        android: -SCREEN_HEIGHT * 0.15,                 // Android pe mostly default behavior stable hota hai
    });
    return (
        <>
            <OrientationLocker orientation={PORTRAIT} />
            <CustomStatusBar backgroundColor={statusBarColor} barStyle={barStyle} />
            <View style={styles.container}>
                {backgroundImage && (
                    <Image
                        source={backgroundImage}
                        style={[styles.bgImage, { bottom: Platform.OS === 'ios' ? 0 : insets.bottom }]}
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

                    bottomOffset={Platform.OS === 'ios' ? scale(80) : scale(80)} // 👈 Android par offset barha dein
                    extraScrollHeight={Platform.OS === 'ios' ? scale(20) : scale(20)} // 👈 Extra height add karein
                    enableOnAndroid={true}

                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    // extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
                    extraKeyboardSpace={DYNAMIC_OFFSET}
                    // keyboardOpeningTime={0}
                    // enableOnAndroid
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    bounces={false}   // 🔥 iOS fix (important)
                    overScrollMode="never"  
                >
                    {children}

                </KeyboardAwareScrollView>
                <AppText style={[styles.versionText]} color="#fff">
                    version {APP_CONFIG?.VERSION}
                </AppText>
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
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        paddingHorizontal: scale(8),
        marginBottom: scale(12),
    },
    versionText: {
        // position: 'absolute',
        marginBottom: scale(12),
        alignSelf: 'center',
    }
});
