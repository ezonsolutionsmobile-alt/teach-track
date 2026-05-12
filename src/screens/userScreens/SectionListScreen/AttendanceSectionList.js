import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import CustomDropdownButton from '../../../components/CustomDropdownButton';
import MainBox from '../../../components/MainBox';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import themes from '../../../themes/colors';
import { moderateScale, scale, verticalScale } from '../../../themes/sizes';
import globalStyles from '../../../themes/globalStyles';
import CustomStatusBar from '../../../components/CustomStatusBar';
import Orientation from 'react-native-orientation-locker';
import { useThemeStore } from '../../../store/useThemeStore';
import CustomDatePicker from '../../../components/CustomDatePicker';
import useAcademicFlowStore from '../../../store/useAcademicFlowStore';
import { useTabStore } from '../../../store/useTabStore';


export default function AttendanceSectionList({ route }) {
    const navigation = useNavigation();
    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();
    const { classItem, setSectionItem } = useAcademicFlowStore();
    const [selectedDated, setSelectedDate] = useState(new Date())
    const { setLastHomeScreen } = useTabStore();
    // const { campusShiftItem } = route?.params

    const handleUserPress = (item) => {
        const updatedItemAttendance = {
            ...classItem,
            system_type_list: {
                ...classItem?.system_type_list,
                class_list: {
                    ...classItem?.system_type_list?.class_list,
                    section_list: item
                }
            },
            selectedDated: selectedDated?.toISOString()
        };
        setSectionItem(updatedItemAttendance)
        navigation.navigate("AttendanceScreen");
    };

    const renderItem = ({ item }) => (
        <CustomDropdownButton
            title={item?.section_name}
            onPress={() => handleUserPress(item)}
            activetitleColor={theme?.theme?.primary}
            inActivetitleColor={theme?.theme?.dark_text}
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

    return (
        <>
            <CustomStatusBar backgroundColor={theme?.theme?.primary} barStyle="light-content" translucent={true} />
            <View style={{ flex: 1 }}>
                <CustomHeader
                    title="Section List"
                    titleSize={theme?.heading_font_size?.h4} containerStyle={{ backgroundColor: theme?.theme?.primary, }}
                    isBack={true}
                    onBackPress={() => {
                        if (navigation.canGoBack()) {
                            setLastHomeScreen("ClassListScreen")
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
                                {classItem?.campus_shift_name}
                            </AppText>
                            <AppText type='title' weight='SemiBold' style={{ fontSize: moderateScale(theme?.text_font_size?.large_medium), textAlign: 'center' }} color={theme?.theme?.primary}>
                                {classItem?.system_type_list?.system_type_name}
                            </AppText>
                            <AppText type='title' weight='SemiBold'
                                style={[styles.subHeading, {
                                    textAlign: 'center',
                                    fontSize: moderateScale(theme?.text_font_size?.large_medium),
                                    color: themes.greenText, marginTop: -verticalScale(2),
                                }]}>{classItem?.system_type_list?.class_list?.class_name}</AppText>
                            <View style={{ flexGrow: 1, width: "100%", paddingHorizontal: scale(8), marginTop: 8 }}>
                                <CustomDatePicker
                                    placeholder="Select Homework Date"
                                    date={selectedDated}
                                    onDateChange={(date) => setSelectedDate(date)}
                                    strokeWidth={3}
                                    fontWeight={'SemiBold'}
                                    paddingVertical={10}
                                    theme={theme}
                                    maximumDate={false}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: scale(8), }}>

                            {/* FlatList of campus shifts */}
                            <FlatList
                                data={classItem?.system_type_list?.class_list?.section_list}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index?.toString()}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingVertical: verticalScale(4) }}
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
        backgroundColor: themes?.white,
    },
    headingContainer: {
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        marginBottom: 8,
        alignItems: 'center',
    },

});
