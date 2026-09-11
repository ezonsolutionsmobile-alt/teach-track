import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import MainNav from './src/navigation/MainNav';
import AppBootstrap from './src/bootstrap/AppBootstrap'
import DeviceInfo from 'react-native-device-info';
import { toastConfig } from './src/components/ToastConfig';
import AppWrapperForNetworkCheck from './src/components/AppWrapperForNetworCheck'
import { useThemeStore } from './src/store/useThemeStore';
import { compareVersions } from './src/utils/compareVersions';
import APP_CONFIG from './src/config/app.config';
import ForceUpdateModal from './src/components/Modals/ForceUpdateModal';


export default function App() {
  const [showForceUpdate, setShowForceUpdate] = useState(false);
  const { theme, appVersion, fetchAppVersion, } = useThemeStore();
  // check app version 
  useEffect(() => {
    fetchAppVersion(); 
  }, []);
  // check app version
  useEffect(() => {
    const checkAppVersion = () => {
      const currentVersion = DeviceInfo.getVersion();
      if (!appVersion?.latest_version) return
      const result = compareVersions(
        currentVersion,
        appVersion?.latest_version
      );

      if (result < 0 && appVersion?.force_update) {
        setShowForceUpdate(true);
      } else {
        setShowForceUpdate(false);
      }
    };
    checkAppVersion();
  }, [theme, appVersion]);
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
          <ForceUpdateModal visible={showForceUpdate} />
        </GestureHandlerRootView>
      </AppBootstrap>
    </SafeAreaProvider>
  );
}



