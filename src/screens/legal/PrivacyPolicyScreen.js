import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import CustomStatusBar from '../../components/CustomStatusBar';
import { useThemeStore } from '../../store/useThemeStore';
import CustomHeader from '../../components/CustomHeader';

const PrivacyPolicyScreen = ({navigation}) => {
    const { theme } = useThemeStore();
    return (
        <>
            <CustomStatusBar backgroundColor={theme?.theme?.primary} barStyle="light-content" translucent={true} />
            <View style={styles.container}>
                  <CustomHeader
                    title={"Privacy Policy"}
                    titleSize={theme?.heading_font_size?.h4}
                    containerStyle={{ backgroundColor: theme?.theme?.primary }}
                    isBack={true}
                    onBackPress={() => {
                        if (navigation.canGoBack()) navigation.goBack();
                        else navigation.navigate("DrawerNavigator");
                    }}
                />
                <WebView
                    source={{
                        uri: "https://doc-hosting.flycricket.io/employee-app-privacy-policy/9463c625-3151-4e28-9629-4af4b8c4e2cc/privacy"
                    }}
                    startInLoadingState={true}
                />
            </View>
        </>
    );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});