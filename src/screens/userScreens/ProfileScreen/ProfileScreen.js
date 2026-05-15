import React, { useCallback, useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity, BackHandler, Platform } from "react-native";
import CustomHeader from "../../../components/CustomHeader";
import AppText from "../../../components/AppText";
import themes from "../../../themes/colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { moderateScale } from "../../../themes/sizes";

import {
  ProfileIcon,
  SettingsIcon,
  LoginHistoryIcon,
  LogoutIcon,
  ForwardIcon,
  ChangePasswordIcon,
  DashedBorder,
} from "../../../assets/Icons";
import { useAuthStore } from "../../../store/useAuthStore";
import CustomStatusBar from "../../../components/CustomStatusBar";
import { useThemeStore } from "../../../store/useThemeStore";
import { useApiRoutesStore } from "../../../store/useApiRoutesStore";
import { user_avatar } from "../../../assets";
import { useTabStore } from "../../../store/useTabStore";


export default function ProfileScreen() {
  const navigation = useNavigation();

  // Retrieve current app theme from Zustand global store
  const { theme } = useThemeStore();
  const { activeTab, setActiveTab, lastHomeScreen, setLastHomeScreen } = useTabStore();
  // dynamic assets routes 
  const { assetRoutes, routes } = useApiRoutesStore()

  const { logout, user, logoutLoader, setAuth, clearTokenOnly } = useAuthStore();




  // Testing helper: Set an invalid token to verify logout / interceptor security flow
  const updateTokenHandler = () => {
    setAuth("asdads", user)
  }

  const handleBackAction = useCallback(() => {
    // navigation.getParent()?.navigate('HomeStack', {
    //   screen: 'HomeScreen',
    // });
    navigation.navigate('Dashboard');
    setActiveTab("Dashboard")
    setLastHomeScreen('Dashboard')
    return true;
  }, [navigation,]);

  // 1. Android Hardware Back Button
  useFocusEffect(
    useCallback(() => {
      const backHandlerSubscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackAction
      );
      return () => backHandlerSubscription.remove();
    }, [handleBackAction])
  );

  // 2. iOS Swipe Gesture & Manual Back Fix
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // IMPORTANT: Agar action RESET ya NAVIGATE hai, toh usey mat roko (Prevent loop)
      // reset action aksar 'RESET' type bhejta hai
      if (e.data.action.type === 'RESET' || e.data.action.type === 'NAVIGATE') {
        return;
      }

      // Swipe back gesture ko prevent karo
      e.preventDefault();

      // Apna custom handleBackAction chalao
      handleBackAction();
    });

    return unsubscribe;
  }, [navigation, handleBackAction]);
  return (
    <>
      {/* <OrientationLocker orientation={PORTRAIT} /> */}
      <CustomStatusBar backgroundColor={theme?.theme?.primary} barStyle="light-content" translucent />
      <View style={{ flex: 1 }}>
        <CustomHeader
          title="My Profile"
          titleSize={theme?.heading_font_size?.h4} containerStyle={{ backgroundColor: theme?.theme?.primary, }}
          isBack={false}
          onBackPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
            else navigation.navigate("DrawerNavigator");
          }}
        />

        <View style={[styles.profileCardWrapper, { backgroundColor: theme?.theme?.primary }]}>
          <View style={styles.profileCard}>
            {/* <TouchableOpacity onPress={updateTokenHandler}> */}
            {/* <Image
                source={{ uri: "https://i.pravatar.cc/300" }}
                // source={{ uri: `${baseURL}/${user?.img}` }}
                style={styles.avatar}
              /> */}
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
            {/* </TouchableOpacity> */}
            <View>
              <AppText weight="Bold" style={{ textTransform: 'capitalize', fontSize: moderateScale(theme?.text_font_size?.large) }} color={theme?.theme?.dark_Text}>
                {user?.f_name + " " + user?.l_name || "--"}
              </AppText>
              <AppText style={[styles.email, { fontSize: moderateScale(theme?.text_font_size?.medium) }]} color={theme?.theme?.medium_text}>
                {user?.email || "---"}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.menuBox}>
            <View style={{ flex: 1 }}>

              <MenuItem title="Profile Details"
                icon={<ProfileIcon color={theme?.theme?.medium_text} />}
                onPress={() => navigation.navigate("ProfileDetailsScreen")} theme={theme} />

              <MenuItem
                title="Change Password"
                icon={<ChangePasswordIcon color={theme?.theme?.medium_text} />}
                onPress={() => navigation.navigate("ChangePasswordScreen")} theme={theme}
              />

              <MenuItem
                title="Login History"
                icon={<LoginHistoryIcon color={theme?.theme?.medium_text} />}
                onPress={() => navigation.navigate("LoginHistoryScreen")} theme={theme}
              />
              <MenuItem
                title={"Settings"}
                icon={<SettingsIcon color={theme?.theme?.medium_text} />}
                onPress={() => navigation.navigate("SettingsScreen")} theme={theme}
              />
              <MenuItem
                title={logoutLoader ? "Signing out..." : "Sign out"}
                icon={<LogoutIcon color="red" />}
                isLogout={true}
                onPress={() => clearTokenOnly()} theme={theme}
              />
            </View>
            <MenuItem
              title={logoutLoader ? "Please wait..." : "Log out securely"}
              icon={<LogoutIcon color="red" />}
              isLogout={true}
              isBorder={false}
              onPress={() => !logoutLoader && logout(`${routes?.logout}`)} theme={theme}
            />
          </View>
        </View>
      </View>
    </>
  );
}
const MenuItem = ({ title, icon, isLogout = false, onPress, theme, isBorder = true }) => {
  return (
    <>
      <TouchableOpacity style={[styles.menuItem, !isBorder && { borderBottomWidth: 0 }]} onPress={onPress}>
        <View style={styles.leftRow}>
          {icon}
          <AppText style={[styles.menuText, { fontSize: moderateScale(theme?.text_font_size?.large) }]} color={theme?.theme?.dark_text}>
            {title}
          </AppText>
        </View>
        {!isLogout && <ForwardIcon color={theme?.theme?.medium_text} />}
      </TouchableOpacity>
      {Platform.OS === 'ios' && isBorder &&
        <View style={{}}>
          <DashedBorder color={theme?.theme?.medium_text} />
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
    paddingTop: moderateScale(30),
    backgroundColor: themes.white,
  },
  profileCardWrapper: {
    height: moderateScale(50),
    // backgroundColor: themes.purple,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 2,
  },
  profileCard: {
    backgroundColor: themes.white,
    borderRadius: moderateScale(14),
    padding: moderateScale(8),
    flexDirection: "row",
    alignItems: "center",
    width: "95%",

    // Android Shadow
    elevation: 5,

    // iOS Shadow Properties
    shadowColor: "#000", // Shadow ka color
    shadowOffset: {
      width: 0,
      height: 2, // Shadow kitni niche dikhegi
    },
    shadowOpacity: 0.25, // Shadow ki transparency (0 to 1)
    shadowRadius: 3.84, // Shadow ka blur radius

    transform: [{ translateY: moderateScale(30) }],
  },
  avatar: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    marginRight: moderateScale(12),
  },
  email: {
    marginTop: moderateScale(4)
  },
  menuBox: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: themes.white,
    paddingHorizontal: 16,
    marginTop: 6
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: moderateScale(18),
    borderBottomColor: themes.mediumText,
    ...Platform.select({
      android: {
        borderBottomWidth: 1,
        borderStyle: "dashed",

      },
    }),
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  menuText: {
    marginLeft: moderateScale(12),
    // fontSize: moderateScale(16)
  },
});
