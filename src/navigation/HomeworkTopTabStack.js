import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import CustomHeader from '../components/CustomHeader';
import themes from '../themes/colors';
import { moderateScale, scale, verticalScale } from '../themes/sizes';
import { useThemeStore } from '../store/useThemeStore';
import CustomStatusBar from '../components/CustomStatusBar';
import AppText from '../components/AppText';
import AddHomeworkScreen from '../screens/userScreens/HomeWorkScreen/ScreensComponent/AddHomeworkScreen';
import ActiveHomeWorkScreen from '../screens/userScreens/HomeWorkScreen/ScreensComponent/ActiveHomeWorkScreen';
import CancelledHomework from '../screens/userScreens/HomeWorkScreen/ScreensComponent/CancelledHomework';
import CustomDropdown from '../components/CustomDropdown';
import globalStyles from '../themes/globalStyles';
import { useHomeWorkStore } from '../store/useHomeWorkStore';
import TabsSkeleton from '../components/Skeletons/TabsSkeleton';
import useAcademicFlowStore from '../store/useAcademicFlowStore';
import { useTabStore } from '../store/useTabStore';
import { BackHandler } from 'react-native';
import { CommonActions, useFocusEffect, useNavigationState } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function HomeworkTabsInner({ navigation }) {
    const { theme } = useThemeStore();
    const { subjectItem: selectedSubject } = useAcademicFlowStore();
    const { setIsYearSessionUpdated, optionList, optionLoader, setSelected, selected } = useHomeWorkStore();
    const { setLastTopBarScreen, setLastHomeScreen } = useTabStore();


    const handleBackAction = useCallback(() => {
        setLastTopBarScreen(null);
        navigation.navigate('HomeStack', {
            screen: 'SubjectListScreen',
        });

        setLastHomeScreen('SubjectListScreen')
        return true;
    }, [navigation, setLastTopBarScreen]);

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
        <View style={{ flex: 1, backgroundColor: themes.white }}>
            <CustomStatusBar
                backgroundColor={theme?.theme?.primary}
                barStyle="light-content"
                translucent
            />
            {/* Header + Student Card */}
            <CustomHeader
                title="Homework"
                isBack={true}
                // onBackPress={() => navigation.goBack()}
                onBackPress={() => {
                    setLastTopBarScreen(null);
                    navigation.navigate('HomeStack', {
                        screen: 'SubjectListScreen',
                    });
                }}
                titleSize={theme?.heading_font_size?.h4}
                containerStyle={{ backgroundColor: theme?.theme?.primary }}
            />

            <View style={[styles.headingContainer, { borderBottomColor: theme?.theme?.medium_text }]}>
                <AppText type='title' weight='Bold' style={{ fontSize: moderateScale(theme?.heading_font_size?.h5), textAlign: 'center' }} color={theme?.theme?.dark_text}>
                    {selectedSubject?.campus_shift_name}
                </AppText>
                <AppText type='title' weight='SemiBold' style={{ fontSize: moderateScale(theme?.text_font_size?.large_medium), textAlign: 'center' }} color={theme?.theme?.primary}>
                    {selectedSubject?.class_section_list?.class_section_name}
                </AppText>
                <AppText type='title' weight='SemiBold'
                    style={[styles.subHeading, {
                        textAlign: 'center',
                        fontSize: moderateScale(theme?.text_font_size?.large_medium),
                        color: themes.greenText, marginTop: -verticalScale(2),
                    }]}>{selectedSubject?.class_section_list?.subject_list?.subject}</AppText>

                <View style={{ paddingHorizontal: scale(8), marginTop: 8 }}>
                    <CustomDropdown options={optionList} selected={selected} setSelected={setSelected}
                        placeholder="Please select a year session" setPreviousSelect={setIsYearSessionUpdated} />
                </View>
            </View>

            {/* Tabs */}
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: { backgroundColor: themes.white },
                    tabBarIndicatorStyle: { backgroundColor: 'transparent' }, // hide default indicator
                    lazy: false, // preserve scroll
                    swipeEnabled: true,
                    tabBarLabelStyle: { color: themes.darkText },
                    tabBarPressColor: 'transparent', // remove ripple
                }}
                tabBar={(props) => {
                    const { state, navigation } = props;
                    const TABS = [
                        { name: 'Add', color: themes.purple },
                        { name: 'Active', color: themes.purple },
                        { name: 'Cancelled', color: themes.redText },
                    ];

                    return (
                        optionLoader ? <TabsSkeleton />
                            : <View style={{ flexDirection: 'row', marginHorizontal: scale(8), borderRadius: 12, overflow: 'hidden' }}>
                                {state.routes.map((route, index) => {
                                    const isFocused = state.index === index;
                                    return (
                                        <TouchableOpacity
                                            key={route.key}
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                paddingVertical: verticalScale(12),
                                                backgroundColor: isFocused ? TABS[index].color : themes.borderGrey,
                                            }}
                                            onPress={() => navigation.navigate(route.name)}
                                        >
                                            <AppText
                                                weight={isFocused ? 'Bold' : 'Medium'}
                                                style={{ color: isFocused ? themes.white : themes.darkText }}
                                            >
                                                {route.name}
                                            </AppText>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                    );
                }}
            >
                <Tab.Screen name="Add" component={AddHomeworkScreen} />
                <Tab.Screen name="Active" component={ActiveHomeWorkScreen} />
                <Tab.Screen name="Cancelled" component={CancelledHomework} />
            </Tab.Navigator>
        </View>
    );
}

export default function HomeworkTopTabStack() {
    return (
        <Stack.Navigator initialRouteName="HomeworkTabs" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeworkTabs" component={HomeworkTabsInner} />
        </Stack.Navigator>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
        paddingVertical: globalStyles?.mainBoxWrapper?.paddingVertical,
        backgroundColor: themes?.white,
    },
    headingContainer: {
        paddingVertical: verticalScale(12),
        borderBottomWidth: 1,
        borderBottomColor: themes.mediumText,
        borderStyle: 'dashed',
        marginBottom: verticalScale(12),
        alignItems: 'center',
    },


    tabContainer: {
        paddingHorizontal: scale(8),
    },
    tabRow: {
        flexDirection: 'row',
    },
    formWrapper: {
        paddingHorizontal: 12,
        paddingTop: 4,
    },
    field: {
        marginTop: verticalScale(11),
    },
    textArea: {
        backgroundColor: themes.white,
        borderRadius: 14,

    },
    error: {
        color: themes.redText,
        fontSize: moderateScale(13),
        marginTop: 4,
    },
    stickyBottom: {
        backgroundColor: themes.white,

        paddingHorizontal: scale(12),
        // paddingVertical: verticalScale(8),
    },
});

