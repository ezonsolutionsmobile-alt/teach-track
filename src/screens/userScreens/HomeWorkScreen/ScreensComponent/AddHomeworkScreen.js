import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import CustomDatePicker from '../../../../components/CustomDatePicker';
import MainBox from '../../../../components/MainBox';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AppText from '../../../../components/AppText';
import themes from '../../../../themes/colors';
import { moderateScale, scale, verticalScale } from '../../../../themes/sizes';
import globalStyles from '../../../../themes/globalStyles';
import AppButton from '../../../../components/AppButton';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { homeworkSchema } from '../../../../schemas/UserSchema';
import { TextInput } from 'react-native-paper';
import AddHomeworkSkeleton from '../../../../components/Skeletons/AddHomeworkSkeleton'
import { showToast } from '../../../../components/ShowToas';
import { AttachIcon } from '../../../../assets/Icons';
import { useThemeStore } from '../../../../store/useThemeStore';
import { useHomeWorkStore } from '../../../../store/useHomeWorkStore';
import { pick } from '@react-native-documents/picker';

import Sound from 'react-native-sound';
import { useApiRoutesStore } from '../../../../store/useApiRoutesStore';
import moment from 'moment';
import useAcademicFlowStore from '../../../../store/useAcademicFlowStore';
import { useTabStore } from '../../../../store/useTabStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
export default function AddHomeworkScreen() {
    const submitSound = useRef(null);
    const navigation = useNavigation();
    const { lastHomeScreen, lastTopBarScreen } = useTabStore();

    // const { selectedSubject } = route.params || {};
    console.log(lastTopBarScreen, "lastTopBarScreenlastTopBarScreen")
    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();
    // global routes 
    const { routes } = useApiRoutesStore.getState();
    const { subjectItem: selectedSubject } = useAcademicFlowStore();
    const { addHomeWork, getAllOptionsHandler, optionList, optionLoader, selected, setIsUpdated } = useHomeWorkStore();

    const isFocused = useIsFocused();
    const [btnDisable, setBtnDisable] = useState(false)

    const [remainingHeight, setRemainingHeight] = useState(0); // ✅ For dynamic textarea
    const [attachment, setAttachment] = useState(null)

    // pagination end -----------<><><>----------
    const { height: SCREEN_HEIGHT } = Dimensions.get('window');
    const DYNAMIC_OFFSET = Platform.select({
        ios: -SCREEN_HEIGHT * 0.12, // Screen ki total height ka 15% negative offset
        android: -SCREEN_HEIGHT * 0.08,                 // Android pe mostly default behavior stable hota hai
    });

    // ADD FORM
    const { control, handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            option: null,
            date: new Date(),
            description: ''
        },
        resolver: yupResolver(homeworkSchema),
    });

    // ADD
    const onSubmit = async (data) => {

        const formData = new FormData();
        // -------- File Validation --------
        if (attachment?.uri && theme?.attachment?.is_upload) {
            const fileSizeInMB = parseFloat(theme?.attachment?.file_size); // e.g., "3mb" => 3
            const fileExt = attachment?.type;
            // Check file type
            if (!theme?.attachment?.upload_type_allow?.includes(fileExt)) {
                showToast(
                    "error",
                    "Invalid File Type",
                    `Allowed file types: ${theme?.attachment.upload_type.join(", ")}`,
                    theme?.set_timeout?.toast_message
                );
                return;
            }
            // Check file size
            // Assuming attachment.file_size is like "3mb"
            const fileSizeBytes = attachment.size || 0; // use actual file size if backend provides
            if (fileSizeBytes / (1024 * 1024) > fileSizeInMB) {
                showToast(
                    "error",
                    "File Too Large",
                    `Max file size is ${theme?.attachment.file_size}`,
                    theme?.set_timeout?.toast_message
                );
                return;
            }

            formData.append("docs", {
                uri: attachment.uri,
                name: attachment.name,
                type: attachment.type,
            });
        }
        /* -------- Homework Data -------- */
        formData.append("home_work_date", moment(data?.date).format("YYYY-MM-DD"));
        formData.append("home_work", data?.description);
        formData.append("year_session_id", selected?.value);
        formData.append(
            "subject_id",
            selectedSubject?.class_section_list?.subject_list?.subject_id
        );
        formData.append(
            "class_section_id",
            selectedSubject?.class_section_list?.class_section_id
        );
        formData.append(
            "class_section_timetable_id",
            selectedSubject?.class_section_list?.subject_list?.class_section_timetable_id
        );
        setBtnDisable(true)
        try {
            const res = await addHomeWork(routes?.home_work_save, formData)
            if (res?.status) {
                showToast("success", "", res?.message, theme?.set_timeout?.toast_message)
                submitSound.current?.stop(() => {
                    submitSound.current?.setVolume(1.0);
                    submitSound.current?.play((success) => {
                        if (!success) {
                            console.log("Playback failed");
                        }
                    });
                });
                setAttachment(null)
                reset();
                setIsUpdated(true)
                navigation.navigate('Active', { selectedSubject: selectedSubject })
                setBtnDisable(false)
            } else {
                showToast("error", "", res?.message, theme?.set_timeout?.toast_message)
                setBtnDisable(false)
            }
        } catch (err) {
            console.log(err || "something went wrong")
            setBtnDisable(false)
        }
    };


    // ✅ Measure remaining space
    const onLayoutContainer = (event) => {
        const containerHeight = event.nativeEvent.layout.height;
        console.log(containerHeight)
        const headerHeight = 180; // approximate header + top texts
        const tabsHeight = 0;
        const dropdownHeight = 0;
        const available = containerHeight - (headerHeight + tabsHeight + dropdownHeight);
        setRemainingHeight(available);
    };

    const pickAttachment = async () => {
        try {
            const result = await pick({
                allowMultiSelection: false,
                type: [
                    'public.image',            // ✅ iOS Gallery aur Images ke liye sabse zaroori
                    'public.composite-content', // ✅ iOS general documents ke liye
                    'com.adobe.pdf',           // ✅ iOS PDFs ke liye strict type
                    'image/jpeg',              // Android safe
                    'image/png',               // Android safe
                    'application/pdf',         // Android safe
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ],
            });
            const file = result[0];
            setAttachment(file); // 👈 Save locally
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!isFocused) return;
        const body = {
            options_data: {
                "year_session": {
                    "id": selectedSubject?.class_section_list?.subject_list?.system_type_id
                }
            }
        }
        if (optionList.length == 0) {
            getAllOptionsHandler(routes?.get_all_options, body)
        }
    }, [selectedSubject, isFocused])

    useEffect(() => {
        Sound.setCategory('Playback');

        submitSound.current = new Sound(
            'send.wav',   //  ONLY filename
            Sound.MAIN_BUNDLE,
            (error) => {
                if (error) {
                    console.log('Sound load error:', error);
                    return;
                }
                console.log('Sound loaded');
            }
        );

        return () => {
            submitSound.current?.release();
        };
    }, []);

    return (
        <>
            <View style={{ flex: 1 }}>

                <View style={{ flexGrow: 1 }} onLayout={onLayoutContainer}>
                    <View style={styles.container}>
                        <MainBox borderRadius={12} paddingVertical={verticalScale(0)} paddingHorizontal={0} height="100%" disableScroll style={{ paddingBottom: 0 }}>
                            {/* ================= ADD HOMEWORK TAB ================= */}
                            {optionLoader ? <AddHomeworkSkeleton /> :
                                selected?.value &&
                                (
                                    <KeyboardAwareScrollView
                                        style={{ flex: 1, paddingHorizontal: scale(8) }}
                                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 20}

                                        bottomOffset={Platform.OS === 'ios' ? scale(80) : scale(80)} // 👈 Android par offset barha dein
                                        extraScrollHeight={Platform.OS === 'ios' ? scale(20) : scale(20)} // 👈 Extra height add karein
                                        enableOnAndroid={true}


                                        contentContainerStyle={styles.scrollContent}
                                        // extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
                                        extraKeyboardSpace={DYNAMIC_OFFSET}
                                        // keyboardOpeningTime={0}
                                        // enableOnAndroid
                                        keyboardShouldPersistTaps="handled"
                                        showsVerticalScrollIndicator={false}
                                        bounces={false}   // 🔥 iOS fix (important)
                                        overScrollMode="never" // Android stable
                                    >
                                        <ScrollView
                                            style={{ flex: 1 }}
                                            contentContainerStyle={{ paddingBottom: verticalScale(Platform.OS === 'ios' ? 24 : 12) }}
                                            keyboardShouldPersistTaps="handled"
                                            showsVerticalScrollIndicator={false}
                                        >
                                            {/* Date Field */}
                                            <View style={styles.field}>
                                                <Controller
                                                    control={control}
                                                    name="date"
                                                    render={({ field: { onChange, value } }) => (
                                                        <CustomDatePicker
                                                            placeholder="Select Homework Date"
                                                            date={value}
                                                            onDateChange={onChange}
                                                            strokeWidth={3}
                                                            fontWeight={'SemiBold'}
                                                            paddingVertical={verticalScale(10)}
                                                            theme={theme}
                                                        />
                                                    )}
                                                />
                                                {errors.date && (
                                                    <AppText style={styles.error}>{errors.date.message}</AppText>
                                                )}
                                            </View>

                                            {/* Description */}
                                            <View style={{ flex: 1, marginTop: verticalScale(4) }}>
                                                <Controller
                                                    control={control}
                                                    name="description"
                                                    render={({ field: { onChange, value } }) => {
                                                        const isError = !!errors.description;
                                                        const isActive = !!value;
                                                        return (
                                                            <TextInput
                                                                disabled={!selected?.value || isSubmitting}
                                                                mode="outlined"
                                                                label="Homework Description"
                                                                value={value}
                                                                onChangeText={onChange}
                                                                multiline
                                                                textAlignVertical="top"
                                                                blurOnSubmit={false}
                                                                returnKeyType="default"
                                                                style={[
                                                                    styles.textArea,
                                                                    {
                                                                        fontSize: moderateScale(theme?.text_font_size?.large + 1),
                                                                        flex: 1,
                                                                        minHeight: remainingHeight
                                                                            ? remainingHeight
                                                                            : verticalScale(120),
                                                                    },
                                                                ]}
                                                                activeOutlineColor={
                                                                    isError
                                                                        ? themes.redText
                                                                        : isActive
                                                                            ? theme?.theme?.primary
                                                                            : theme?.theme?.medium_text
                                                                }
                                                                outlineColor={
                                                                    isError
                                                                        ? themes.redText
                                                                        : isActive
                                                                            ? theme?.theme?.primary
                                                                            : themes.borderGrey
                                                                }
                                                                theme={{
                                                                    colors: {
                                                                        placeholder: isError
                                                                            ? themes.redText
                                                                            : isActive
                                                                                ? theme?.theme?.primary
                                                                                : theme?.theme?.medium_text,
                                                                        text: theme?.theme?.dark_text,
                                                                    },
                                                                }}
                                                            />
                                                        );
                                                    }}
                                                />
                                                {errors.description && (
                                                    <AppText style={styles.error}>
                                                        {errors.description.message}
                                                    </AppText>
                                                )}
                                            </View>
                                        </ScrollView>

                                        {/* STICKY BOTTOM: Attachment + Submit */}
                                        <View style={[styles.stickyBottom, {
                                            borderTopWidth: theme?.attachment?.is_upload ? 1 : 0,
                                            borderColor: theme?.attachment?.is_upload ? themes.borderGrey : 'transparent',
                                        }]}>
                                            {/* Attachment */}
                                            {theme?.attachment?.is_upload && <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignSelf: "flex-end",
                                                    alignItems: "center",
                                                    marginTop: verticalScale(2),
                                                }}
                                            >
                                                {/* Attachment Button */}
                                                <Pressable
                                                    onPress={pickAttachment}
                                                    style={({ pressed }) => [
                                                        {
                                                            borderColor: themes.purple,
                                                            borderRadius: 12,
                                                            alignItems: "center",
                                                            flexDirection: "row",
                                                            paddingLeft: scale(6),
                                                            paddingVertical: verticalScale(2),
                                                            marginVertical: verticalScale(2),
                                                            backgroundColor: pressed
                                                                ? themes.overlayGrey
                                                                : themes.white,
                                                            marginLeft: 12,
                                                            maxWidth: '80%'

                                                        },
                                                    ]}
                                                >
                                                    <AppText
                                                        weight="Medium"
                                                        style={{
                                                            color: theme?.theme?.primary,
                                                            fontSize: moderateScale(theme?.text_font_size?.medium_small),
                                                        }}
                                                    >
                                                        {attachment?.name
                                                            ? attachment.name
                                                            : "Tap to attach file"}
                                                    </AppText>

                                                    <AttachIcon
                                                        name="attach-file"
                                                        color={theme?.theme?.primary}
                                                    />
                                                </Pressable>

                                                {/* Clear Button */}
                                                {attachment && (
                                                    <Pressable
                                                        onPress={() => setAttachment(null)}

                                                        style={({ pressed }) => [
                                                            {
                                                                borderRadius: 10,
                                                                paddingLeft: 12,
                                                                paddingRight: 6,
                                                                justifyContent: "center",
                                                                paddingVertical: verticalScale(6),
                                                                marginVertical: verticalScale(2),
                                                                backgroundColor: pressed
                                                                    ? themes.overlayGrey
                                                                    : themes.white,
                                                            },
                                                        ]}
                                                    >
                                                        <AppText
                                                            weight="Medium"
                                                            numberOfLines={1}
                                                            ellipsizeMode="middle"
                                                            style={{
                                                                color: themes?.error,
                                                                fontSize: moderateScale(theme?.text_font_size?.medium_small),
                                                            }}
                                                        >

                                                            Clear
                                                        </AppText>
                                                    </Pressable>
                                                )}
                                            </View>}



                                            {/* Submit Button */}
                                            <AppButton
                                                isLoading={isSubmitting}
                                                disabled={btnDisable}
                                                title="Add Homework"
                                                onPress={handleSubmit(onSubmit)}
                                                fullWidth
                                                style={{ marginTop: 0 }}
                                            />
                                        </View>
                                    </KeyboardAwareScrollView>
                                )}
                        </MainBox>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: globalStyles?.mainBoxWrapper?.paddingVertical,
        backgroundColor: themes?.white,
        ...Platform.select({
            android: {
                paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal,

            },
        }),
    },
    headingContainer: {
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: themes.mediumText,
        borderStyle: 'dashed',
        marginBottom: 12,
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

