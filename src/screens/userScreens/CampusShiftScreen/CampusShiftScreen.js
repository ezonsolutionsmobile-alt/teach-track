import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import CustomDropdownButton from '../../../components/CustomDropdownButton';
import DropdownButtonSkeleton from '../../../components/Skeletons/DropdownButtonSkeleton';
import MainBox from '../../../components/MainBox';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import globalStyles from '../../../themes/globalStyles';
import CustomStatusBar from '../../../components/CustomStatusBar';
import { scale, verticalScale } from '../../../themes/sizes';
import Orientation from 'react-native-orientation-locker';
import { useThemeStore } from '../../../store/useThemeStore';
import { useHomeWorkStore } from '../../../store/useHomeWorkStore';
import NoDataFound from '../../../components/NoDataFound';
import { useScreenNavigationStore } from '../../../store/useScreenNavigationStore';
import { useApiRoutesStore } from '../../../store/useApiRoutesStore';
import { useTabStore } from '../../../store/useTabStore';
import useAcademicFlowStore from '../../../store/useAcademicFlowStore';



export default function CampusShiftScreen() {
    const navigation = useNavigation();
    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();

    // dynamic Api routes
    const { routes, assetRoutes } = useApiRoutesStore();
    const { setSource, setLastHomeScreen, setActiveTab } = useTabStore();
    const { itemType } = useScreenNavigationStore();
    const { setCampusShift } = useAcademicFlowStore();

    const { getCampusShift, campusShiftLoader, campusShiftList } = useHomeWorkStore()


    // This state is used to control the pull-to-refresh loading indicator on the screen
    const [refreshing, setRefreshing] = useState(false);


    const handleUserPress = (item) => {
        const screen =
            itemType === "attendance"
                ? "SystemTypeListScreen"
                : "ClassListScreen";

        // setLastHomeScreen(screen);
        setCampusShift(item)
        setSource("CampusShiftScreen")
        navigation.navigate(screen);
    };

    const renderItem = ({ item }) => (
        <CustomDropdownButton
            title={item?.campus_shift_name}
            onPress={() => handleUserPress(item)}
            titleSize={theme?.text_font_size?.large}
            activetitleColor={theme?.theme?.primary}
            inActivetitleColor={theme?.theme?.dark_text}
        />
    );


    /* ---------- Pull Refresh ---------- */
    const onRefresh = async () => {
        setRefreshing(true);
        const url = itemType === "attendance" ? routes?.get_campus_shift_and_class_section_list_for_attendance : routes?.get_campus_shift_and_class_section_list_for_homework
        try {
            await getCampusShift(url);
        } catch (error) {
            console.log(error);
        }

        setRefreshing(false);
    };
    useEffect(() => {
        const url = itemType === "attendance" ? routes?.get_campus_shift_and_class_section_list_for_attendance : routes?.get_campus_shift_and_class_section_list_for_homework
        getCampusShift(url)
    }, [])



    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            // 👈 Sirf back / pop pe chalega
            setLastHomeScreen("HomeScreen");
            setActiveTab("Dashboard");
        });
        return unsubscribe;
    }, [navigation]);
    return (
        <>
            {/* <OrientationLocker orientation={PORTRAIT} /> */}

            <CustomStatusBar backgroundColor={theme?.theme?.primary} barStyle="light-content" />
            <View style={{ flex: 1 }}>
                {/* Pass onBackPress to CustomHeader */}
                <CustomHeader
                    title="Campus Shift List"
                    titleSize={theme?.heading_font_size?.h4} containerStyle={{ backgroundColor: theme?.theme?.primary, }}
                    // isBack={true}
                    isMenu={true}
                    onLeftPress={() => navigation.openDrawer()}
                // onBackPress={() => {
                //     if (navigation.canGoBack()) {
                //         navigation.goBack();
                //     } else {
                //         // Optional: fallback, jaise home screen pe navigate karna
                //         navigation.navigate("DrawerNavigator");
                //     }
                // }}
                />

                <View style={styles.container}>
                    <MainBox paddingVertical={verticalScale(0)} paddingHorizontal={scale(8)} height={'100%'} disableScroll={true}>
                        {campusShiftLoader ? <DropdownButtonSkeleton />
                            : <FlatList
                                data={campusShiftList}
                                renderItem={renderItem}
                                keyExtractor={(item) => item?.campus_shift_id?.toString()}
                                showsVerticalScrollIndicator={false}
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                contentContainerStyle={{ paddingVertical: verticalScale(8), flexGrow: 1 }}
                                ListEmptyComponent={<NoDataFound />}
                            />
                        }
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
        backgroundColor: '#f2f2f2',
    },
});
