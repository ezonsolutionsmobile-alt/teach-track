import React, { use, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';


import { useNavigationState } from '@react-navigation/native';

import {
  AttendanceIcon,
  LogoutIcon,
  HouseIcon,
  HomeworkIcon,
  CheckInIcon,
} from '../../assets/Icons';

import DrawerMenuItem from './DrawerMenuItem';
import { useAuthStore } from '../../store/useAuthStore';
import themes from '../../themes/colors';
import { useTabStore } from '../../store/useTabStore';
import { useApiRoutesStore } from '../../store/useApiRoutesStore';
import AppText from '../../components/AppText';
import { useThemeStore } from '../../store/useThemeStore';
import { attendance, checkInOut, homework, user_avatar } from '../../assets';
import { useScreenNavigationStore } from '../../store/useScreenNavigationStore';
import { moderateScale, verticalScale } from '../../themes/sizes';

export default function CustomDrawerContent({ navigation }) {
  const { assetRoutes, routes } = useApiRoutesStore()
  const { user, clearTokenOnly, logoutLoader, } = useAuthStore();
  // Retrieve current app theme from Zustand global store
  const { theme } = useThemeStore();
  const { setNavigationData, itemData } = useScreenNavigationStore();
  const { setActiveTab, setLastHomeScreen, activeTab, lastHomeScreen, setLastTopBarScreen } = useTabStore();

  const activeRoute = useNavigationState((state) => {
    const drawer = state.routes[state.index];
    const tab = drawer.state?.routes[drawer.state.index];
    const stack = tab?.state?.routes[tab.state.index];

    return stack?.name || tab?.name;
  });

  const goToScreen = (screenName) => {
    setLastHomeScreen(screenName);
    setLastTopBarScreen(null)
    if (screenName === 'HomeScreen') {
      setActiveTab('Dashboard');
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Tabs',
            state: {
              index: 0,
              routes: [
                { name: 'Dashboard' },
              ],
            },
          },
        ],
      });

      return;
    }
    setActiveTab('HomeStack');
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Tabs',
          state: {
            index: 0,
            routes: [
              {
                name: 'HomeStack',
                state: {
                  index: 0,
                  routes: [
                    { name: screenName },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  };
  // console.log(activeTab, "aksjkjhad", lastHomeScreen, "ahgsdjkjskjdhakjshd", activeRoute, "activeRoute",itemData?.type)
  return (

    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Profile Image */}
        <Image
          source={
            user?.img && user?.img !== ""
              ? { uri: "https://i.pravatar.cc/300" }
              //  { uri: `${baseURL}/${user.img}` }
              :
              user_avatar
          }
          style={styles.avatar}
        />

        {/* Name & Email */}
        <View style={styles.profileInfo}>
          <AppText weight="Bold" style={{ textTransform: 'capitalize', fontSize: moderateScale(theme?.text_font_size?.large) }} color={"#fff"}>
            {user?.f_name + " " + user?.l_name || "--"}
          </AppText>
          <AppText style={{ fontSize: moderateScale(theme?.text_font_size?.medium) }} color={"#fff"}>
            {user?.email || "---"}
          </AppText>
        </View>
      </View>
      {/* MENU ITEMS */}

      <View style={{ marginTop: 1 }}>

        <DrawerMenuItem
          label="Dashboard"
          icon={HouseIcon}
          isActive={
            activeTab !== "HomeStack" &&
            activeRoute == "Dashboard"
          }  // 👈 fix
          onPress={() => goToScreen('HomeScreen')}
          theme={theme}
        />

        <DrawerMenuItem
          label="Homework"
          icon={HomeworkIcon}
          isActive={(activeTab == "HomeStack" || activeRoute == "HomeScreen" || activeRoute === 'CampusShiftScreen') && itemData?.type == "homework"}
          onPress={() => {
            setNavigationData('homework', { id: 1, title: theme?.task?.name || "Homework", bg: "#7B68EE", url: "CampusShiftScreen", type: "homework", image: homework });
            setLastHomeScreen("CampusShiftScreen");
            setActiveTab('HomeStack');

            goToScreen('CampusShiftScreen')
          }}
          theme={theme}
        />
        <DrawerMenuItem
          label="Attendance"
          icon={AttendanceIcon}
          isActive={(activeTab == "HomeStack" ||activeRoute === 'CampusShiftScreen') && itemData?.type == "attendance"}
          onPress={() => {

            setNavigationData('attendance', { id: 3, title: "Attendance", bg: "#3B5998", url: "CampusShiftScreen", type: "attendance", image: attendance },);
            goToScreen('CampusShiftScreen')
          }}
          theme={theme}
        />
        <DrawerMenuItem
          label="Check In / Out"
          icon={CheckInIcon}
          isActive={activeRoute === 'CheckInOutScreen'}
          onPress={() => {

            setNavigationData('upcoming', { id: 4, title: "Check In / Out", bg: "#3B5998", url: "CheckInOutScreen", type: "upcoming", image: checkInOut },);
            goToScreen('CheckInOutScreen')
          }}
          theme={theme}
        />

      </View>

      {/* SIGN OUT */}

      <View style={styles.footer}>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => clearTokenOnly()}
        >

          <LogoutIcon width={20} height={20} color={themes?.redText} />

          <AppText weight='Medium' style={styles.logoutText}>
            {logoutLoader ? "Signing out..." : "Sign out"}
          </AppText>

        </TouchableOpacity>
        {/* 👇 Version */}
        <AppText style={[styles.versionText, { fontSize: theme?.text_font_size?.medium_small }]} color={theme?.theme?.light_text}>
          Version 2.0.0
        </AppText>
      </View>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center', // vertically center items
    backgroundColor: themes?.purple,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15 // space between image and text
  },

  profileInfo: {
    flex: 1, // take remaining space
    justifyContent: 'center',
  },

  dropdownContainer: {
    marginHorizontal: 8,
    marginTop: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 8
  },

  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 12,
    paddingHorizontal: 16

  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center"
  },

  logoutText: {
    marginLeft: 10,
    fontWeight: "600"
  },
  versionText: {
    textAlign: 'right',
    marginTop: verticalScale(12),

  }

});