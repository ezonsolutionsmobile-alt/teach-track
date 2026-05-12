import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from '../components/CustomTabBar';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import AddHomeworkScreen from '../screens/userScreens/HomeWorkScreen/ScreensComponent/AddHomeworkScreen';
import ActiveHomeWorkScreen from '../screens/userScreens/HomeWorkScreen/ScreensComponent/ActiveHomeWorkScreen';
import CancelledHomework from '../screens/userScreens/HomeWorkScreen/ScreensComponent/CancelledHomework';
import { useHiddenScreenStore } from '../store/useHiddenScreenStore';
import HomeworkTopTabStack from './HomeworkTopTabStack';
import DashboardScreen from '../screens/userScreens/HomeScreen/HomeScreen';
import { useTabStore } from '../store/useTabStore';
const Tab = createBottomTabNavigator();

const MainTabs = ({ initialTab = 'HomeStack', onTabChange }) => {
  const { setLastHiddenScreen } = useHiddenScreenStore();
  const { activeTab, setActiveTab, lastHomeScreen } = useTabStore();
  return (
    <Tab.Navigator
      key={initialTab}
      initialRouteName={initialTab}
      screenOptions={{ headerShown: false, lazy: true, }}
      tabBar={(props) => <CustomTabBar {...props} />}
      screenListeners={{
        state: (e) => {
          const index = e.data.state.index;
          const routeName = e.data.state.routeNames[index];
          setActiveTab(routeName)
          if (onTabChange) onTabChange(routeName); // notify drawer
        },

      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // prevent default tab behavior
            setActiveTab('HomeStack');
            navigation.navigate('HomeStack', {
              screen: lastHomeScreen || 'HomeScreen',
            });
          },
        })}
      />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
      <Tab.Screen
        name="HomeworkTopTabStack"
        component={HomeworkTopTabStack}

      />
    </Tab.Navigator>
  );
};

export default MainTabs;
