import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import CustomStatusBar from '../../components/CustomStatusBar';
import CustomHeader from '../../components/CustomHeader';
import { useThemeStore } from '../../store/useThemeStore';

const TermsAndConditionsScreen = ({navigation}) => {
        const { theme } = useThemeStore();
    return (
        <>
            <CustomStatusBar backgroundColor={theme?.theme?.primary} barStyle="light-content" translucent={true} />
            <View style={styles.container}>
                <CustomHeader
                    title={"Terms & Conditions"}
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
                        uri: "https://doc-hosting.flycricket.io/employee-app-terms-of-use/e450c2a7-9b5a-48f1-b509-613a191bd321/terms"
                    }}
                    startInLoadingState={true}
                />
            </View>
        </>
    );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});