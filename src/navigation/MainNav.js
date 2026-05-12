
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';

import AuthStack from './AuthStack'
import AppStack from './AppStack'
import { useAuthStore } from '../store/useAuthStore';
import GlobalLoader from '../components/GlobalLoader'
import RNBootSplash from 'react-native-bootsplash';
import { ActivityIndicator, View } from 'react-native';

const MainNav = () => {
    const token = useAuthStore((state) => state?.token);
    const isHydrated = useAuthStore((state) => state.isHydrated);

    // Wait for store to hydrate before showing anything
    useEffect(() => {
        if (isHydrated) {
            RNBootSplash.hide({ fade: true });
        }
    }, [isHydrated]);

    if (!isHydrated) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#7B68EE" />
        </View>
    )
    return (
        <>
            <NavigationContainer>
                {token ? < AppStack /> : < AuthStack />}
            </NavigationContainer>
            <GlobalLoader />
        </>
    )
}

export default MainNav

