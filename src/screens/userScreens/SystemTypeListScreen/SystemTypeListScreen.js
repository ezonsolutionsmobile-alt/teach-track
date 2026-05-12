import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import CustomDropdownButton from '../../../components/CustomDropdownButton';
import MainBox from '../../../components/MainBox';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import themes from '../../../themes/colors';
import { moderateScale, verticalScale } from '../../../themes/sizes';
import globalStyles from '../../../themes/globalStyles';
import CustomStatusBar from '../../../components/CustomStatusBar';
import { useThemeStore } from '../../../store/useThemeStore';
import useAcademicFlowStore from '../../../store/useAcademicFlowStore';
import { useTabStore } from '../../../store/useTabStore';


export default function SystemTypeListScreen({ route }) {
    const navigation = useNavigation();
    const { setSource, setLastHomeScreen } = useTabStore();
    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();
    const { campusShift: campusShiftItem, setSystemTypeList } = useAcademicFlowStore();

    const handleUserPress = (item) => {
        const updatedItem = { ...campusShiftItem, system_type_list: item }
        setSystemTypeList(updatedItem)
        setSource("SystemTypeListScreen")
        navigation.navigate("ClassListScreen");
    };

    const renderItem = ({ item }) => (
        <CustomDropdownButton
            title={item?.system_type_name}
            onPress={() => handleUserPress(item)}
            activetitleColor={theme?.theme?.primary}
            inActivetitleColor={theme?.theme?.dark_text}
            titleSize={theme?.text_font_size?.large}
        />
    );


    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            // 👈 Sirf back / pop pe chalega
            setLastHomeScreen("CampusShiftScreen");
        });

        return unsubscribe;
    }, [navigation]);
    return (
        <>
            {/* <OrientationLocker orientation={PORTRAIT} /> */}

            <CustomStatusBar backgroundColor={theme?.theme?.primary} barStyle="light-content" translucent={true} />
            <View style={{ flex: 1 }}>
                <CustomHeader
                    title="System Type List"
                    titleSize={theme?.heading_font_size?.h4} containerStyle={{ backgroundColor: theme?.theme?.primary, }}
                    isBack={true}
                    onBackPress={() => {
                        if (navigation.canGoBack()) {
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
                        </View>
                        <View style={{ paddingHorizontal: 8, paddingBottom: 44 }}>

                            {/* FlatList of campus shifts */}
                            <FlatList
                                data={campusShiftItem?.system_type_list}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index?.toString()}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingVertical: 4 }}
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
