import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import themes from '../../themes/colors';
import MainTabs from '../MainTabs';
import CustomDrawerContent from './CustomDrawerContent';
import AttendanceScreen from '../../screens/userScreens/AttendanceScreen/AttendanceScreen';

const Drawer = createDrawerNavigator();

// Drawer Navigator
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator

      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
        drawerStyle: { backgroundColor: themes.white, width: 280 },
        drawerType: 'front',
      }}

      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* 🔥 SINGLE SOURCE OF TRUTH */}
      <Drawer.Screen name="Tabs" component={MainTabs} />
      <Drawer.Screen name="AttendanceScreen" component={AttendanceScreen} options={{ animation: 'none' }} />
    </Drawer.Navigator>
  );
}
