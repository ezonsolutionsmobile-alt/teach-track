import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/userScreens/HomeScreen/HomeScreen';
import CampusShiftScreen from '../screens/userScreens/CampusShiftScreen/CampusShiftScreen';
import SystemTypeListScreen from '../screens/userScreens/SystemTypeListScreen/SystemTypeListScreen';
import ClassListScreen from '../screens/userScreens/ClassListScreen/ClassListScreen';
import SubjectListScreen from '../screens/userScreens/SubjectListScreen/SubjectListScreen';
import SectionListScreen from '../screens/userScreens/SectionListScreen/SectionListScreen';
import AttendanceSectionList from '../screens/userScreens/SectionListScreen/AttendanceSectionList';
import HomeWorkScreen from '../screens/userScreens/HomeWorkScreen/HomeWorkScreen';
import CheckInOutScreen from '../screens/userScreens/CheckInOut/CheckInOutScreen';
 

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} screenOptions={{
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
      <Stack.Screen name="CampusShiftScreen" component={CampusShiftScreen}
        screenOptions={{
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
        }}
      />
      <Stack.Screen name="SystemTypeListScreen" component={SystemTypeListScreen}
        screenOptions={{
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
        }}

      />
      <Stack.Screen name="ClassListScreen" component={ClassListScreen}
        screenOptions={{
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
      <Stack.Screen name="SectionListScreen" component={SectionListScreen}
        screenOptions={{
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
      <Stack.Screen name="AttendanceSectionListScreen" component={AttendanceSectionList} screenOptions={{
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
      {/* <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} options={{ animation: 'none' }}/> */}
      <Stack.Screen name="SubjectListScreen" component={SubjectListScreen} screenOptions={{
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
      <Stack.Screen name="HomeWorkScreen" component={HomeWorkScreen} screenOptions={{
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
      <Stack.Screen name="CheckInOutScreen" component={CheckInOutScreen} screenOptions={{
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
