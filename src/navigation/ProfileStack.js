// navigation/ProfileStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/userScreens/ProfileScreen/ProfileScreen';
import ProfileDetailsScreen from '../screens/userScreens/ProfileScreen/ProfileDetailsScreen';
import ChangePasswordScreen from '../screens/userScreens/ProfileScreen/ChangePasswordScreen';
import LoginHistoryScreen from '../screens/userScreens/ProfileScreen/LoginHistoryScreen';
import SettingsScreen from '../screens/userScreens/ProfileScreen/SettingsScreen';

const Stack = createNativeStackNavigator(); 

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ProfileDetailsScreen" component={ProfileDetailsScreen} screenOptions={{
        transitionSpec: {
          open: {
            animation: 'timing',
            config: { duration: 200 },
          },
          close: {
            animation: 'timing',
            config: { duration: 200 },
          },
        },
      }} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 200, // 👈 yahan time kam karo (default ~500)
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 200,
            },
          },
        },
      }} />
      <Stack.Screen name="LoginHistoryScreen" component={LoginHistoryScreen} screenOptions={{
        transitionSpec: {
          open: {
            animation: 'timing',
            config: { duration: 200 },
          },
          close: {
            animation: 'timing',
            config: { duration: 200 },
          },
        },
      }} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} screenOptions={{
        transitionSpec: {
          open: {
            animation: 'timing',
            config: { duration: 200 },
          },
          close: {
            animation: 'timing',
            config: { duration: 200 },
          },
        },
      }} />
    </Stack.Navigator>
  );
}
