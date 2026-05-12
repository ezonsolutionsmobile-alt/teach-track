import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet} from 'react-native';
import MainBox from '../../../../components/MainBox';
import themes from '../../../../themes/colors';
import { moderateScale, scale, verticalScale } from '../../../../themes/sizes';
import globalStyles from '../../../../themes/globalStyles';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { homeworkSchema } from '../../../../schemas/UserSchema';
import HomeworkHistoryList from '../../../../components/HomeworkHistory'
import HomeworkHistorySkeleton from '../../../../components/Skeletons/HomeworkHistorySkeleton'
import { showToast } from '../../../../components/ShowToas';
import UpdateHomeworkModal from '../../../../components/Modals/UpdateHomeworkModal';
import ConfirmationModal from '../../../../components/Modals/ConfirmationModal';
import { useThemeStore } from '../../../../store/useThemeStore';
import { useHomeWorkStore } from '../../../../store/useHomeWorkStore';
import { pick } from '@react-native-documents/picker';
import { useIsFocused } from '@react-navigation/native';
import { useApiRoutesStore } from '../../../../store/useApiRoutesStore';
import { useHiddenScreenStore } from '../../../../store/useHiddenScreenStore';
import useAcademicFlowStore from '../../../../store/useAcademicFlowStore';

export default function ActiveHomeWorkScreen({navigation}) {
    const submitSound = useRef(null);
    // Retrieve current app theme from Zustand global store
    const { theme } = useThemeStore();
    // global routes 
    const { routes } = useApiRoutesStore.getState();
   const { subjectItem: selectedSubject } = useAcademicFlowStore();
    const {  optionList, 
        getAllHomeworksHandler, homeworkList, homeworkLoading, refreshing, count, removeHomeWork, setIsUpdated, isUpdated,
        updateHomeWork, getAllOptionsHandler, selected,  isYearSessionUpdated, setIsYearSessionUpdated } = useHomeWorkStore();

    const [btnDisable, setBtnDisable] = useState(false)

    const [remainingHeight, setRemainingHeight] = useState(0); // ✅ For dynamic textarea
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedHomework, setSelectedHomework] = useState(null);
    const [deleteVisible, setDeleteVisible] = useState(false);

    const [attachment, setAttachment] = useState(null)
    // pagination start ----------<><><>----------
    const [page, setPage] = useState(0);
    // pagination end -----------<><><>----------

    const isFocused = useIsFocused();


    // EDIT FORM
    const { control: editControl,
        handleSubmit: handleEditSubmit,
        formState: { errors: editErrors, isLoading },
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
        const optimisticPayload = {
            id: selectedHomework?.id,
            homework: data?.description
        }
        setBtnDisable(true)
        try {
            const res = await updateHomeWork(routes?.home_work_update, formData, optimisticPayload)
            if (res?.status) {
                submitSound.current?.stop(() => {
                    submitSound.current?.setVolume(1.0);
                    submitSound.current?.play((success) => {
                        if (!success) {
                            console.log("Playback failed");
                        }
                    });
                });
                setTimeout(() => {
                    showToast("success", "", res?.message || 'Homework updated successfully', theme?.set_timeout?.toast_message)

                }, 0)
                setAttachment(null);
                resetEdit();
                setEditModalVisible(false);
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
        setPage(0);
        try {
            if (selected?.value) {

                const body = {
                    subject_id: selectedSubject?.class_section_list?.subject_list?.subject_id,
                    class_section_id: selectedSubject?.class_section_list?.subject_list?.class_section_id,
                    year_session_id: selected?.value,
                    page_index: 1,
                    type_id: 1
                };

                const res = await getAllHomeworksHandler(body, "refresh");

                if (res?.data?.status) {
                    setPage(1);
                }
            }
        } catch (error) {
            console.log("Refresh Error:", error);
        }
    };
    /* ---------- Load More data---------- */
    const loadMore = async () => {

        if (homeworkLoading) return;


        const currentList = homeworkList
        const totalCount = count
        const currentPage = page

        if (currentList.length >= totalCount) return;

        const nextPage = currentPage + 1;

        const body = {
            subject_id: selectedSubject?.class_section_list?.subject_list?.subject_id,
            class_section_id: selectedSubject?.class_section_list?.subject_list?.class_section_id,
            year_session_id: selected?.value,
            page_index: nextPage,
            type_id: 1
        };

        await getAllHomeworksHandler(body, "loadMore");
        setPage(nextPage);
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
    }, [selectedSubject,isFocused])

    useEffect(() => {
          if (!isFocused) return;
        const fetchData = async () => {
            if (!selected?.value) return;

            // ✅ Skip if data already exists and isUpdate = false
            if (
                !isUpdated &&
                homeworkList?.length > 0 &&
                !isYearSessionUpdated?.active
            ) {
                return;
            }

            const body = {
                subject_id: selectedSubject?.class_section_list?.subject_list?.subject_id,
                class_section_id: selectedSubject?.class_section_list?.subject_list?.class_section_id,
                year_session_id: selected?.value,
                page_index: 1,
                type_id: 1,
            };

            const res = await getAllHomeworksHandler(body, "initial");

            if (!res?.data?.status) return;

            setPage(1);

            setIsUpdated(false);
            setIsYearSessionUpdated({ active: false });
        };

        fetchData();
    }, [
        selected?.value,
        isUpdated,
        isYearSessionUpdated?.active,
        selectedSubject,isFocused
    ]);

    
    return (
        <>
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
                {/* confirmation modal before removing homework  */}
                <ConfirmationModal visible={deleteVisible} onCancel={() => setDeleteVisible(false)} onConfirm={() => { confirmDelete(); setDeleteVisible(false); }} />

                <View style={{ flexGrow: 1 }} onLayout={onLayoutContainer}>
                    <View style={styles.container}>
                        <MainBox borderRadius={12} paddingVertical={verticalScale(0)} paddingHorizontal={0} height="100%" disableScroll style={{ paddingBottom: 0 }}>
                            {(homeworkLoading || refreshing) && homeworkLoading ?
                                <HomeworkHistorySkeleton /> :
                                <>
                                    {/* ================= HISTORY TAB ================= */}
                                    <View style={{ flex: 1, paddingHorizontal: scale(8) }}>
                                        <HomeworkHistoryList data={selected?.value ? homeworkList : []} onEdit={onEdit}
                                            onRemove={onRemove}
                                            selected={selected} onRefresh={onRefresh}
                                            loadMore={loadMore}
                                        />
                                    </View>
                                </>
                            }
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

        paddingHorizontal: scale(12),
        // paddingVertical: verticalScale(8),
    },
});

