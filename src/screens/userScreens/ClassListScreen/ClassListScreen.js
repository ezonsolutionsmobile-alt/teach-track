import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import CustomDropdownButton from '../../../components/CustomDropdownButton';
import MainBox from '../../../components/MainBox';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import themes from '../../../themes/colors';
import { moderateScale, scale, verticalScale } from '../../../themes/sizes';
import globalStyles from '../../../themes/globalStyles';
import CustomStatusBar from '../../../components/CustomStatusBar';
import { useScreenNavigationStore } from '../../../store/useScreenNavigationStore';
import { useThemeStore } from '../../../store/useThemeStore';
import NoDataFound from '../../../components/NoDataFound';
import { useTabStore } from '../../../store/useTabStore';
import useAcademicFlowStore from '../../../store/useAcademicFlowStore';
import { DashedBorder } from '../../../assets/Icons';


export default function ClassListScreen({ route }) {
    const navigation = useNavigation();
    const { itemType } = useScreenNavigationStore();

    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();

    const { source: previousScreen, setLastHomeScreen } = useTabStore();
    const { campusShift, setClassItem, systemTypeList } = useAcademicFlowStore();

    console.log(previousScreen, "previousScreenpreviousScreenpreviousScreen")

    const campusShiftItem = previousScreen == "SystemTypeListScreen" ? systemTypeList : campusShift


    const handleUserPress = (item) => {

        const isAttendance = itemType === "attendance";
        const screen = isAttendance
            ? "AttendanceSectionListScreen"
            : "SubjectListScreen";

        const updatedItem = isAttendance
            ? {
                ...campusShiftItem,
                system_type_list: {
                    ...campusShiftItem?.system_type_list,
                    class_list: item,
                },
            }
            : {
                ...campusShiftItem,
                class_section_list: item,
            };

        setLastHomeScreen(screen);
        setClassItem(updatedItem);

        navigation.navigate(screen);
    };



    const renderItem = ({ item }) => (
        <CustomDropdownButton
            title={itemType === "attendance" ? item?.class_name : item?.class_section_name}
            onPress={() => handleUserPress(item)}
            activetitleColor={theme?.theme?.primary}
            inActivetitleColor={theme?.theme?.dark_text}
            titleSize={theme?.text_font_size?.large}

        />
    );


    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            // 👈 Sirf back / pop pe chalega
            setLastHomeScreen(previousScreen);
        });

        return unsubscribe;
    }, [navigation, previousScreen]);
    return (
        <>
            {/* <OrientationLocker orientation={PORTRAIT} /> */}

            <CustomStatusBar backgroundColor={theme?.theme?.primary} barStyle="light-content" translucent={true} />
            <View style={{ flex: 1 }}>
                <CustomHeader
                    title="Class List"
                    titleSize={theme?.heading_font_size?.h4} containerStyle={{ backgroundColor: theme?.theme?.primary, }}
                    isBack={true}
                    onBackPress={() => {
                        if (navigation.canGoBack()) {
                            setLastHomeScreen("SystemTypeListScreen");
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
                                {campusShiftItem?.campus_shift_name}
                            </AppText>
                            {campusShiftItem?.system_type_list?.system_type_name && <AppText type='title' weight='SemiBold' style={{ fontSize: moderateScale(theme?.text_font_size?.large_medium), textAlign: 'center' }} color={theme?.theme?.primary}>
                                {campusShiftItem?.system_type_list?.system_type_name}
                            </AppText>}
                        </View>
                        {Platform.OS === 'ios' && 
                        <View style={{ marginBottom: verticalScale(8), paddingTop: verticalScale(12), }}>
                            <DashedBorder color={theme?.theme?.medium_text} />
                        </View>
                        }
                        
                        <View style={{ flex: 1, paddingHorizontal: scale(8), }}>

                            {/* FlatList of campus shifts */}
                            <FlatList
                                data={itemType === "attendance" ? campusShiftItem?.system_type_list?.class_list : campusShiftItem?.class_section_list}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index?.toString()}
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

});
