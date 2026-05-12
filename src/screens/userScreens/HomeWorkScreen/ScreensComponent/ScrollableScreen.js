import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';
import CustomDropdown from '../../../../components/CustomDropdown';
import CustomDatePicker from '../../../../components/CustomDatePicker';
import CustomTabButton from '../../../../components/CustomTabButton';
import MainBox from '../../../../components/MainBox';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import AppText from '../../../../components/AppText';
import themes from '../../../../themes/colors';
import { moderateScale, scale, verticalScale } from '../../../../themes/sizes';
import globalStyles from '../../../../themes/globalStyles';
import AppButton from '../../../../components/AppButton';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { homeworkSchema } from '../../../../schemas/UserSchema';
import { TextInput } from 'react-native-paper';
import HomeworkFullScreenScrollSkeleton from '../../../../components/Skeletons/HomeworkFullScreenScrollSkeleton'
import { showToast } from '../../../../components/ShowToas';
import UpdateHomeworkModal from '../../../../components/Modals/UpdateHomeworkModal';
import ConfirmationModal from '../../../../components/Modals/ConfirmationModal';
import CustomStatusBar from '../../../../components/CustomStatusBar';
import { AttachIcon, UploadIcon } from '../../../../assets/Icons';
import Orientation, { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';
import { useThemeStore } from '../../../../store/useThemeStore';
import { useHomeWorkStore } from '../../../../store/useHomeWorkStore';
import NoDataFound from '../../../../components/NoDataFound';
import { pick } from '@react-native-documents/picker';

import Sound from 'react-native-sound';
import HomeworkHistoryListItem from '../../../../components/HomeworkHistoryListItem';
import AddHomeworkSkeleton from '../../../../components/Skeletons/AddHomeworkSkeleton';
import { useApiRoutesStore } from '../../../../store/useApiRoutesStore';
import moment from 'moment';
import useAcademicFlowStore from '../../../../store/useAcademicFlowStore';

export default function ScrollableScreen() {
    const submitSound = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    // const { selectedSubject } = route.params || {};

    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();
    // global routes 
    const { routes } = useApiRoutesStore.getState();
    const { subjectItem: selectedSubject } = useAcademicFlowStore();
    const { isYearSessionUpdated, setIsYearSessionUpdated, addHomeWork, getAllOptionsHandler, optionList, optionLoader, homeworkCancelled, countCancelled, clearHomeworkData,
        getAllHomeworksHandler, homeworkList, homeworkLoading, refreshing, loadingMore, count, removeHomeWork, updateHomeWork } = useHomeWorkStore();

    const [remainingHeight, setRemainingHeight] = useState(0); // ✅ For dynamic textarea
    const [activeTab, setActiveTab] = useState('Add');
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedHomework, setSelectedHomework] = useState(null);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(false);

    const [selected, setSelected] = useState(null);
    // const [previousSelect, setPreviousSelect] = useState(null);

    const [btnDisable, setBtnDisable] = useState(false)

    const [isUpdated, setIsUpdated] = useState(false)
    const [attachment, setAttachment] = useState(null)

    // pagination start ----------<><><>----------
    const [page, setPage] = useState(0);
    const [pageCancelled, setPageCancelled] = useState(0);

    // pagination end -----------<><><>----------

    const tabs = ['Add', 'Active', 'Cancelled'];

    // ADD FORM
    const { control, handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue
    } = useForm({
        defaultValues: {
            option: null,
            date: new Date(),
            description: ''
        },
        resolver: yupResolver(homeworkSchema),
    });

    // EDIT FORM
    const { control: editControl,
        handleSubmit: handleEditSubmit,
        formState: { errors: editErrors, isSubmitting: isLoading },
        reset: resetEdit,
        setValue:
        setEditValue } =
        useForm({
            defaultValues: {
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
        setIsUpdated(true)
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
                setActiveTab('Active');
                reset();
            } else {
                showToast("error", "", res?.message, theme?.set_timeout?.toast_message)
                setBtnDisable(false)

            }
        } catch (err) {
            console.log(err || "something went wrong")
            setBtnDisable(false)
        }
    };

    // UPDATE
    const onUpdateSubmit = async (data) => {
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
        formData.append("home_work_id", selectedHomework?.id);
        formData.append("home_work", data?.description);
        formData.append("is_docs_clear", attachment == null ? 1 : 0);
        setBtnDisable(true)
        try {
            const res = await updateHomeWork(routes?.home_work_update, formData)
            if (res?.status) {
                submitSound.current?.stop(() => {
                    submitSound.current?.setVolume(1.0);
                    submitSound.current?.play((success) => {
                        if (!success) {
                            console.log("Playback failed");
                        }
                    });
                });
                setIsUpdated(true)
                showToast("success", "", res?.message || 'Homework updated successfully', theme?.set_timeout?.toast_message)
                setTimeout(() => {
                    setAttachment(null);
                    resetEdit();
                    setEditModalVisible(false);
                }, 500);
            } else {
                showToast("error", "", res?.message, theme?.set_timeout?.toast_message)
                setBtnDisable(false)

            }
        } catch (err) {
            console.log(err || "something went wrong")
            setBtnDisable(false)
        }
    };

    const onEdit = (item) => {
        setBtnDisable(false)
        setIsUpdated(false)
        setSelectedHomework(item);
        setEditValue('date', new Date(item?.created_at));
        setEditValue('description', item?.home_work);
        setAttachment({ name: item?.docs })
        setEditModalVisible(true);
    };

    const onRemove = (item) => {
        setSelectedHomework(item);
        setDeleteVisible(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await removeHomeWork({ home_work_id: selectedHomework?.id })
            if (res?.data?.status) {
                showToast('success', '', 'Homework Removed Successfully', theme?.set_timeout?.toast_message);
                setDeleteVisible(false);

            } else {
                showToast("error", "", res?.data?.message || "Something went wrong!", theme?.set_timeout?.toast_message)
            }
        } catch (err) {
            console.log(err)
        } finally {

        }

    };
    const hasMore = homeworkList.length < count;

    // ✅ Measure remaining space
    const onLayoutContainer = (event) => {
        const containerHeight = event.nativeEvent.layout.height;
        const headerHeight = 250; // approximate header + top texts
        const tabsHeight = 60;
        const dropdownHeight = 50;
        const available = containerHeight - (headerHeight + tabsHeight + dropdownHeight);
        setRemainingHeight(available);
    };

    /* ---------- Pull Refresh ---------- */
    const onRefresh = async () => {

        const isActive = activeTab === "Active";

        if (isActive) {
            setPage(0);
        } else {
            setPageCancelled(0);
        }

        try {
            if (selected?.value && activeTab !== "Add") {

                const body = {
                    subject_id: selectedSubject?.class_section_list?.subject_list?.subject_id,
                    class_section_id: selectedSubject?.class_section_list?.subject_list?.class_section_id,
                    year_session_id: selected?.value,
                    page_index: 1,
                    type_id: isActive ? 1 : 0
                };

                const res = await getAllHomeworksHandler(body, "refresh");

                if (res?.data?.status) {

                    if (isActive) {
                        setPage(1);
                    } else {
                        setPageCancelled(1);
                    }

                }
            }
        } catch (error) {
            console.log("Refresh Error:", error);
        }
    };

    /* ---------- Load More data---------- */
    const loadMore = async () => {

        if (homeworkLoading) return;

        const isActive = activeTab === "Active";

        const currentList = isActive ? homeworkList : homeworkCancelled;
        const totalCount = isActive ? count : countCancelled;
        const currentPage = isActive ? page : pageCancelled;

        if (currentList.length >= totalCount) return;

        const nextPage = currentPage + 1;

        const body = {
            subject_id: selectedSubject?.class_section_list?.subject_list?.subject_id,
            class_section_id: selectedSubject?.class_section_list?.subject_list?.class_section_id,
            year_session_id: selected?.value,
            page_index: nextPage,
            type_id: isActive ? 1 : 0
        };

        await getAllHomeworksHandler(body, "loadMore");

        if (isActive) {
            setPage(nextPage);
        } else {
            setPageCancelled(nextPage);
        }
    };

    const pickAttachment = async () => {
        try {
            const result = await pick({
                allowMultiSelection: false,
                type: [
                    'image/*',
                    'application/pdf',
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
        const body = {
            options_data: {
                "year_session": {
                    "id": selectedSubject?.class_section_list?.subject_list?.system_type_id
                }
            }
        }
        getAllOptionsHandler(routes?.get_all_options, body)
    }, [selectedSubject])

    useFocusEffect(
        React.useCallback(() => {
            setPage(0);

            const fetchData = async () => {
                // ✅ agar data already load hai to API call na ho
                // if (
                //     !isUpdated &&
                //     (!isYearSessionUpdated?.active || !isYearSessionUpdated?.cancell)
                // ) {
                //     if (
                //         (activeTab === 'Active' && homeworkList?.length > 0) ||
                //         (activeTab === 'Cancelled' && homeworkCancelled?.length > 0)
                //     ) {
                //         return;
                //     }
                // }

                if ((selected?.value && activeTab !== 'Add') || isUpdated) {
                    const body = {
                        subject_id:
                            selectedSubject?.class_section_list?.subject_list?.subject_id,
                        class_section_id:
                            selectedSubject?.class_section_list?.subject_list?.class_section_id,
                        year_session_id: selected?.value,
                        page_index: 1,
                        type_id: activeTab === 'Active' ? 1 : 0,
                    };

                    const res = await getAllHomeworksHandler(body, 'initial');
                    if (res?.data?.status) {
                        setPage(1); // ⭐ after success
                    }
                }
            };

            fetchData();
        }, [selected?.value, activeTab, isUpdated, isYearSessionUpdated, selectedSubject])
    );

    useEffect(() => {
        setSelected(optionList[0])
        return () => {
            setSelected(null)
        };
    }, [optionList])

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

    // ✅ Lock portrait on focus
    useFocusEffect(
        React.useCallback(() => {

            // const timer = setTimeout(() => {
            //     Orientation.lockToPortrait();
            // }, 0);

            return () => {
                // clearTimeout(timer);
                // Orientation.unlockAllOrientations();
                // Clear homework data on screen leave
                clearHomeworkData();
            };

        }, [])
    );
    // console.log(homeworkCancelled, "homework-------homeworkCancelled")
    // console.log(homeworkList, "homework-------homeworkList")
    return (
        <>
            {/* <OrientationLocker orientation={PORTRAIT} /> */}
            <CustomStatusBar backgroundColor={theme?.theme?.primary} barStyle="light-content" translucent />
            <View style={{ flex: 1 }}>

                <UpdateHomeworkModal visible={editModalVisible}
                    onClose={() => setEditModalVisible(false)}
                    remainingHeight={verticalScale(remainingHeight)}
                    control={editControl} errors={editErrors}
                    handleSubmit={handleEditSubmit} onSubmit={onUpdateSubmit} theme={theme}
                    isLoading={isLoading}
                    pickAttachment={pickAttachment}
                    attachment={attachment}
                    setAttachment={setAttachment}
                    btnDisable={btnDisable}
                />
                <ConfirmationModal visible={deleteVisible} onCancel={() => setDeleteVisible(false)} onConfirm={() => { confirmDelete(); setDeleteVisible(false); }} />

                <CustomHeader title="Home Work"
                    titleSize={theme?.heading_font_size?.h4} containerStyle={{ backgroundColor: theme?.theme?.primary, }}
                    isBack onBackPress={() => { if (navigation.canGoBack()) navigation.goBack(); else navigation.navigate("DrawerNavigator"); }} />

                {((homeworkLoading || refreshing) && !isSubmitting) ?
                    <View style={styles?.container}>
                        <MainBox paddingVertical={verticalScale(12)} paddingHorizontal={0} height="100%" disableScroll style={{ paddingBottom: 0 }}>
                            <HomeworkFullScreenScrollSkeleton />
                        </MainBox>
                    </View>
                    :
                    <View style={{ flex: 1 }} onLayout={onLayoutContainer}>
                        <View style={styles.container}>
                            <MainBox paddingVertical={12} paddingHorizontal={0} height="100%" disableScroll style={{ paddingBottom: 0 }}>

                                <FlatList

                                    data={(activeTab !== 'Add' && selected?.value) ? activeTab == "Active" ? homeworkList : homeworkCancelled : []}
                                    contentContainerStyle={{ flexGrow: 1 }}
                                    keyExtractor={(item, index) => `${item?.id ?? index}-${index}`}
                                    renderItem={({ item }) => (
                                        activeTab !== 'Add' ? (
                                            <HomeworkHistoryListItem item={item} onEdit={onEdit} onRemove={onRemove} activeTab={activeTab} />
                                        ) :
                                            null
                                    )}

                                    ListHeaderComponent={
                                        <>
                                            {/* Heading Section */}
                                            <View style={[styles.headingContainer, { borderBottomColor: theme?.theme?.medium_text }]}>

                                                <AppText
                                                    type='title'
                                                    weight='Bold'
                                                    style={{ fontSize: moderateScale(theme?.heading_font_size?.h5), textAlign: 'center' }}
                                                    color={theme?.theme?.dark_text}
                                                >
                                                    {selectedSubject?.campus_shift_name}
                                                </AppText>

                                                <AppText
                                                    type='title'
                                                    weight='SemiBold'
                                                    style={{ fontSize: moderateScale(theme?.text_font_size?.large_medium), textAlign: 'center' }}
                                                    color={theme?.theme?.primary}
                                                >
                                                    {selectedSubject?.class_section_list?.class_section_name}
                                                </AppText>

                                                <AppText
                                                    type='title'
                                                    weight='SemiBold'
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: moderateScale(theme?.text_font_size?.large_medium),
                                                        color: themes.greenText,
                                                        marginTop: -verticalScale(2),
                                                    }}
                                                >
                                                    {selectedSubject?.class_section_list?.subject_list?.subject}
                                                </AppText>

                                                <View style={{ paddingHorizontal: scale(8), marginTop: 8 }}>
                                                    <CustomDropdown options={optionList} selected={selected} setSelected={setSelected} placeholder="Please select a year session" setPreviousSelect={setIsYearSessionUpdated} />
                                                </View>
                                            </View>

                                            {/* Tabs */}
                                            {selected?.value && <View style={[styles.tabContainer, { marginBottom: activeTab !== "Add" && verticalScale(8) }]}>
                                                <View style={styles.tabRow}>
                                                    {tabs.map((tab, index) => (
                                                        <CustomTabButton
                                                            key={tab}
                                                            title={tab}
                                                            active={activeTab === tab}
                                                            onPress={() => { setIsUpdated(false), setActiveTab(tab), setBtnDisable(false), setAttachment(null) }}
                                                            theme={theme}
                                                            isFirst={index === 0}
                                                            isLast={index === tabs.length - 1}
                                                        />
                                                    ))}
                                                </View>
                                            </View>}


                                            {optionLoader ? <AddHomeworkSkeleton /> :
                                                (activeTab === 'Add' && selected?.value) &&
                                                <View style={{ flex: 1, paddingHorizontal: globalStyles?.mainBoxWrapper?.paddingHorizontal, }}>
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
                                                                    paddingVertical={10}
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
                                                                                flex: 1,
                                                                                fontSize: moderateScale(theme?.text_font_size?.large + 1),
                                                                                minHeight: remainingHeight
                                                                                    ? verticalScale(remainingHeight - 32)
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


                                                </View>
                                            }
                                        </>
                                    }

                                    showsVerticalScrollIndicator={false}

                                    /* ✅ Refresh only when Active */
                                    refreshing={activeTab !== 'Add' ? refreshing : false}
                                    onRefresh={activeTab !== 'Add' ? onRefresh : null}

                                    /* ✅ Load More only when Active */
                                    onEndReached={activeTab !== 'Add' ? loadMore : null}
                                    onEndReachedThreshold={activeTab !== 'Add' ? 0.2 : null}

                                    /* ✅ Footer only when Active */
                                    ListFooterComponent={
                                        activeTab !== 'Add' ? (
                                            loadingMore && homeworkList.length > 0 ? (
                                                <ActivityIndicator size="large" />
                                            ) : hasMore && homeworkList.length > 0 ? (
                                                <AppText
                                                    type='title'
                                                    style={{
                                                        fontSize: moderateScale(theme?.text_font_size?.medium_small),
                                                        textAlign: 'center',
                                                        padding: 4
                                                    }}
                                                    color={theme?.theme?.dark_text + "50"}
                                                >
                                                    Scroll to load more...
                                                </AppText>
                                            ) : !hasMore && homeworkList.length > 0 ? (
                                                <AppText
                                                    type='title'
                                                    style={{
                                                        fontSize: moderateScale(theme?.text_font_size?.medium_small),
                                                        textAlign: 'center',
                                                        padding: 4
                                                    }}
                                                    color={theme?.theme?.dark_text + "50"}
                                                >
                                                    No more data available
                                                </AppText>
                                            ) : null
                                        ) : null
                                    }
                                    ListEmptyComponent={() => {
                                        if (!selected?.value) {
                                            return <NoDataFound message="Please select a year session first" />;
                                        }

                                        if (activeTab === 'Active') {
                                            return <NoDataFound message="No Data Found" />;
                                        }

                                        return null;
                                    }}
                                />

                                {/* STICKY BOTTOM: Attachment + Submit FOR ADD HOMEWORK TAB */}
                                {activeTab === 'Add' && <View style={styles.stickyBottom}>
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
                                                {/* <AttachmentRemoveIcon
                                                            name="attach-file"
                                                            color={themes?.error}
                                                            height={24}
                                                            width={24}
                                                        /> */}
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

                                    {/* Uploaded file display */}
                                    {uploadedFile && (
                                        <View style={styles.uploadedFileRow}>
                                            <UploadIcon name="insert-drive-file" color={themes.mediumText} />
                                            <AppText style={styles.uploadedFileName}>
                                                {uploadedFile.fileName}
                                            </AppText>
                                        </View>
                                    )}

                                    {/* Submit Button */}
                                    <AppButton
                                        title="Update Homework"
                                        disabled={btnDisable}
                                        isLoading={isSubmitting}
                                        onPress={handleSubmit(onSubmit)}
                                        fullWidth
                                        style={{ marginTop: 0 }}
                                    />
                                </View>}
                            </MainBox>
                        </View>
                    </View>
                }
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
        borderTopWidth: 1,
        borderColor: themes.borderGrey,
        paddingHorizontal: scale(12),
        // paddingVertical: verticalScale(8),
    },
});

