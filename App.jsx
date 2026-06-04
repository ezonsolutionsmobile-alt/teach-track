import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import MainNav from './src/navigation/MainNav';
import AppBootstrap from './src/bootstrap/AppBootstrap'
import { toastConfig } from './src/components/ToastConfig';
import AppWrapperForNetworkCheck from './src/components/AppWrapperForNetworCheck'
export default function App() {


  return (
    <SafeAreaProvider>
      <AppBootstrap>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppWrapperForNetworkCheck>
            <KeyboardProvider>
              <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
                <MainNav />
              </SafeAreaView>
            </KeyboardProvider>
          </AppWrapperForNetworkCheck>
          <Toast config={toastConfig} topOffset={50} visibilityTime={3000} />
        </GestureHandlerRootView>
      </AppBootstrap>
    </SafeAreaProvider>
  );
}



