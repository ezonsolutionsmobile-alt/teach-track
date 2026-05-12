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

const ICONS = {
  Dashboard: DashboardIcon,
  HomeStack: HouseIcon,
  ProfileStack: UserIcon,
};

const CustomTabBar = ({ state, navigation }) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const { activeTab, setActiveTab, lastHomeScreen, setLastHomeScreen, lastTopBarScreen } = useTabStore();
  const lastPressRef = useRef({});
  // HomeStack should appear active if either HomeStack or FeeStack is active

  const excludedRoutes = ['Add', 'Active', 'Cancelled', 'HomeworkTopTabStack'];
  // console.log(activeTab, "activeTabactiveTabactiveTab")
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.topShadow} />

      {state.routes
        .filter(route => !excludedRoutes.includes(route.name)) // Exclude FeeStack and NotificationDetailsScreen from tab bar
        .map((route, index) => {
          const label = route.name;
          const isFocused = (route.name === 'Dashboard')
            ? (state.index === index)
            : (state.index === index || (route.name == "HomeStack" && activeTab == "HomeworkTopTabStack"));
          const IconComponent = ICONS[route.name];

          const onPress = () => {
            if (route.name === 'Dashboard') {
              setActiveTab('Dashboard');
              navigation.navigate('Dashboard');
              return;
            }

            if (route.name === 'HomeStack') {
              setActiveTab('HomeStack');
              if (lastTopBarScreen) {
                navigation.navigate('HomeworkTopTabStack', {
                  screen: 'Add',
                });
              } else {
                // Always go to last home screen or default
                navigation.navigate('HomeStack', {
                  screen: lastHomeScreen || 'HomeScreen',
                });
              }
              return;
            }
            else if (route.name === 'ProfileStack') {
              setActiveTab('ProfileStack');

              navigation.navigate('ProfileStack', {
                screen: 'ProfileScreen',
              });

              return;
            }
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