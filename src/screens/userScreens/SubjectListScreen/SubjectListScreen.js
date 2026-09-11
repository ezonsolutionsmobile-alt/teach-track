import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import SubjectCard from '../../../components/SubjectCard';
import MainBox from '../../../components/MainBox';
import { CommonActions, useFocusEffect, useNavigation, useNavigationState } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import themes from '../../../themes/colors';
import { moderateScale, scale, verticalScale } from '../../../themes/sizes';
import globalStyles from '../../../themes/globalStyles';
import CustomStatusBar from '../../../components/CustomStatusBar';
import Orientation from 'react-native-orientation-locker';
import { useThemeStore } from '../../../store/useThemeStore';
import NoDataFound from '../../../components/NoDataFound';
import { useHomeWorkStore } from '../../../store/useHomeWorkStore';
import { useHiddenScreenStore } from '../../../store/useHiddenScreenStore';
import useAcademicFlowStore from '../../../store/useAcademicFlowStore';
import { useTabStore } from '../../../store/useTabStore';
import { DashedBorder } from '../../../assets/Icons';


export default function SubjectListScreen({ route }) {
    const navigation = useNavigation();
    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();
    // const { classList } = route?.params
    const { classItem: classList, setSubjectItem } = useAcademicFlowStore();
    const { clearHomeWork } = useHomeWorkStore();
    const { setLastHiddenScreen } = useHiddenScreenStore()
    const { setLastHomeScreen, setLastTopBarScreen } = useTabStore();
    const handleUserPress = (item) => {
        const updatedList = {
            ...classList,
            class_section_list: {
                ...classList?.class_section_list,
                subject_list: item
            }
        };
        clearHomeWork()
        setLastHomeScreen("SubjectListScreen")
        setSubjectItem(updatedList)
        setLastTopBarScreen("Add")
        theme?.component?.home_work_component_name == "addHomeWorkComponent" ?
            navigation.navigate('HomeworkTopTabStack')
            // navigation.dispatch(
            //     CommonActions.reset({
            //         index: 0,
            //         routes: [
            //             {
            //                 name: 'HomeworkTopTabStack',
            //                 state: {
            //                     routes: [
            //                         { name: 'Add' },
            //                     ],
            //                 },
            //             },
            //         ],
            //     })
            // )
            :
            navigation.navigate('HomeWorkScreen');
    };

    const renderItem = ({ item }) => (
        <SubjectCard
            subject={item?.subject}
            title={"Homework"}
            onPress={() => handleUserPress(item)}
            theme={theme}
            titleSize={theme?.text_font_size?.large}
        />
    );
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            // 👈 Sirf back / pop pe chalega
            setLastHomeScreen("ClassListScreen");
        });
        return unsubscribe;
    }, [navigation]);


    // const routeName = useNavigationState(state => {
    //     const route = state.routes[state.index];
    //     return route.name;
    // }); 

    return (
        <>
            {/* <OrientationLocker orientation={PORTRAIT} /> */}
            <CustomStatusBar backgroundColor={theme?.theme?.primary} barStyle="light-content" translucent={true} />
            <View style={{ flex: 1 }}>
                <CustomHeader
                    title="Subject List"
                    titleSize={theme?.heading_font_size?.h4} containerStyle={{ backgroundColor: theme?.theme?.primary, }}
                    isBack={true}
                    onBackPress={() => {
                        if (navigation.canGoBack()) {
                            // setLastHomeScreen("HomeworkTopTabStack")
                            navigation.goBack();

                        } else {
                            navigation.navigate("DrawerNavigator");
                        }
                    }}
                />

                <View style={styles.container}>
                    <MainBox paddingVertical={verticalScale(12)} paddingHorizontal={0} height={'100%'} disableScroll={true}>
                        {/* Heading with dashed bottom border */}
                        <View style={[styles.headingContainer, { borderBottomColor: theme?.theme?.medium_text }]}>
                            <AppText type='title' weight='Bold' style={{ fontSize: moderateScale(theme?.heading_font_size?.h5), textAlign: 'center' }} color={theme?.theme?.dark_text}>
                                {classList?.campus_shift_name}
                            </AppText>
                            <AppText type='title' weight='Bold' style={{ fontSize: moderateScale(theme?.text_font_size?.large_medium), textAlign: 'center' }} color={theme?.theme?.primary}>
                                {classList?.class_section_list?.class_section_name}
                            </AppText>
                        </View>
                        {Platform.OS === 'ios' &&
                            <View style={{ marginBottom: verticalScale(8), paddingTop: verticalScale(12), }}>
                                <DashedBorder color={theme?.theme?.medium_text} />
                            </View>
                        }
                        <View style={{ flex: 1, paddingHorizontal: scale(8), }}>

                            {/* FlatList of campus shifts */}
                            <FlatList
                                data={classList?.class_section_list?.subject_list}
                                renderItem={renderItem}
                                keyExtractor={(item) => item?.subject_id?.toString()}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1, paddingVertical: verticalScale(4) }}
                                ListEmptyComponent={<NoDataFound />}

                            />
                        </View>
                    </MainBox>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,
        paddingVertical: globalStyles?.mainBoxWrapper?.paddingVertical,
        backgroundColor: themes?.off_white,
    },
    headingContainer: {
        alignItems: 'center',

        ...Platform.select({
            android: {
                marginBottom: verticalScale(8),
                paddingBottom: verticalScale(12),
                borderBottomWidth: 1,
                borderStyle: 'dashed',
                borderBottomColor: themes?.borderGrey,
            },
        }),
    },
    heading: {
        fontSize: moderateScale(18),
        textAlign: 'center',
    },
    subHeading: {
        fontSize: moderateScale(15),
        textAlign: 'center',
        marginTop: 0
    },
});
