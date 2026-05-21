// components/CustomTabBar.js
import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import themes from '../themes/colors';
import { moderateScale, scale } from '../themes/sizes';
import { DashboardIcon, HouseIcon, UserIcon } from '../assets/Icons';
import AppText from './AppText';
import { getTabLabel } from '../utils/getTabLabel';
import { useThemeStore } from '../store/useThemeStore';
import { useTabStore } from '../store/useTabStore';
import { StackActions } from '@react-navigation/native';

const ICONS = {
  Dashboard: DashboardIcon,
  HomeStack: HouseIcon,
  ProfileStack: UserIcon,
};

const CustomTabBar = ({ state, navigation }) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { activeTab, setActiveTab, lastHomeScreen, setLastHomeScreen, lastTopBarScreen, setLastTopBarScreen } = useTabStore();
  const lastPressRef = useRef({});
  // HomeStack should appear active if either HomeStack or FeeStack is active

  const excludedRoutes = ['Add', 'Active', 'Cancelled', 'HomeworkTopTabStack'];
  // console.log(activeTab, "activeTabactiveTabactiveTab")
  return (
    <View style={[styles.container]}>
      <View style={styles.topShadow} />

      {state.routes
        .filter(route => !excludedRoutes.includes(route.name)) // Exclude FeeStack and NotificationDetailsScreen from tab bar
        .map((route, index) => {
          const label = route.name;
          const isFocused = (route.name === 'Dashboard')
            ? (state.index === index)
            : (state.index === index || (route.name == "HomeStack" && activeTab == "HomeworkTopTabStack"));
          const IconComponent = ICONS[route.name];

          // const onPress = () => {
          //   if (route.name === 'Dashboard') {
          //     setActiveTab('Dashboard');
          //     navigation.navigate('Dashboard');
          //     return;
          //   }

          //   // last tested code 
          //   if (route.name === 'HomeStack') {
          //     setActiveTab('HomeStack');
          //     if (lastTopBarScreen) {
          //       navigation.navigate('HomeworkTopTabStack', {
          //         screen: 'Add',
          //       });
          //     } else {
          //       // Always go to last home screen or default
          //       navigation.navigate('HomeStack', {
          //         screen: lastHomeScreen || 'HomeScreen',
          //       });
          //     }
          //     return;
          //   }


          //   else if (route.name === 'ProfileStack') {
          //     setActiveTab('ProfileStack');

          //     navigation.navigate('ProfileStack', {
          //       screen: 'ProfileScreen',
          //     });

          //     return;
          //   }
          //   setActiveTab(route.name);
          //   navigation.navigate(route.name);
          // };

          const onPress = () => {
            // ==========================================
            // CASE 1: Dashboard Tab Clicked
            // ==========================================
            if (route.name === 'Dashboard') {
              setActiveTab('Dashboard');
              navigation.navigate('Dashboard');
              return;
            }

            // ==========================================
            // CASE 2: HomeStack Tab Clicked
            // ==========================================
            if (route.name === 'HomeStack') {
              const previousTab = activeTab;
              setActiveTab('HomeStack');

              const fullState = navigation.getState();
              const homeRoute = fullState.routes.find(r => r.name === 'HomeStack');
              const stackState = homeRoute?.state;

              // SUB-CASE A: Agar user abhi HomeworkTopTabStack par khada hai
              if (previousTab === 'HomeworkTopTabStack') {
                setLastTopBarScreen(null);
                navigation.navigate('HomeStack', { screen: 'SubjectListScreen' });
                setLastHomeScreen('SubjectListScreen');
                return;
              }

              // SUB-CASE B: Agar user HomeStack ke andar nested screen par hai, to POP karein
              if (stackState && stackState.index > 0 && previousTab === 'HomeStack') {
                navigation.dispatch({
                  ...StackActions.pop(1),
                  target: stackState.key,
                });
                return;
              }

              // SUB-CASE C: USER ROOT SCREEN PAR HAI AUR DUBARA HOME TAP KIYA (Wapas Dashboard)
              else if (previousTab === 'HomeStack') {
                setActiveTab('Dashboard');
                navigation.navigate('Dashboard');
                return;
              }

              // =================================================================
              // SUB-CASE D: FIXED LOGIC (Dashboard/Profile se pehli baar Home par aana)
              // =================================================================
              else {
                if (lastTopBarScreen) {
                  navigation.navigate('HomeworkTopTabStack', { screen: 'Add' });
                } else {
                  // Agar pehle se stack ki koi state maujood hai (yaani nested screens hain)
                  // to sirf stack ka naam bhejain, taaki exact wahi screen khule jahan choda tha!
                  if (stackState) {
                    navigation.navigate('HomeStack');
                  } else {
                    // Agar state nahi hai (app fresh khuli hai) tab fallback lagayein
                    navigation.navigate('HomeStack', {
                      screen: lastHomeScreen || 'HomeScreen',
                    });
                  }
                }
              }

              return;
            }

            // ==========================================
            // CASE 3: ProfileStack Tab Clicked
            // ==========================================
            else if (route.name === 'ProfileStack') {
              const previousTab = activeTab;
              setActiveTab('ProfileStack');

              const fullState = navigation.getState();
              const profileRoute = fullState.routes.find(r => r.name === 'ProfileStack');
              const stackState = profileRoute?.state;

              if (stackState && stackState.index > 0 && previousTab === 'ProfileStack') {
                navigation.dispatch({
                  ...StackActions.pop(1),
                  target: stackState.key,
                });
                return;
              }
              else if (previousTab === 'ProfileStack') {
                setActiveTab('Dashboard');
                navigation.navigate('Dashboard');
                return;
              }
              else {
                navigation.navigate('ProfileStack');
              }

              return;
            }

            // ==========================================
            // CASE 4: Default Fallback
            // ==========================================
            setActiveTab(route.name);
            navigation.navigate(route.name);
          };


          const color = isFocused
            ? theme?.theme?.primary
            : theme?.theme?.medium_text;
          const iconSize = isFocused ? scale(24) : scale(22);

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tabButton}
            >
              <View style={styles.contentWrapper}>
                <View style={styles.iconWrapper}>
                  {IconComponent && (
                    <IconComponent width={iconSize} height={iconSize} color={color} />
                  )}
                  {isFocused && (
                    <View
                      style={[
                        styles.activeIndicator,
                        { backgroundColor: theme?.theme?.primary },
                      ]}
                    />
                  )}
                </View>
                <AppText
                  weight={isFocused ? 'SemiBold' : 'regular'}
                  style={{
                    fontSize: moderateScale(theme?.text_font_size?.small),
                    color,
                    marginTop: scale(2),
                  }}
                >
                  {getTabLabel(label)}
                </AppText>
              </View>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    minHeight: scale(58),
    backgroundColor: themes.white,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 18,
  },
  topShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0.8,
    backgroundColor: '#E5E7EB',
  },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  contentWrapper: { alignItems: 'center', justifyContent: 'center' },
  iconWrapper: { height: scale(26), alignItems: 'center', justifyContent: 'center' },
  activeIndicator: { position: 'absolute', bottom: -scale(3.5), height: scale(3), width: scale(22), borderRadius: scale(2) },
});

export default CustomTabBar;