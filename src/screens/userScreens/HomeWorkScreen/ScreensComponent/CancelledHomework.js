import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MainBox from '../../../../components/MainBox';
import { useIsFocused } from '@react-navigation/native';
import themes from '../../../../themes/colors';
import { moderateScale, scale, verticalScale } from '../../../../themes/sizes';
import globalStyles from '../../../../themes/globalStyles';

import CancelledHomeworkHistoryList from '../../../../components/CancelledHomeworkHistoryList'
import HomeworkHistorySkeleton from '../../../../components/Skeletons/HomeworkHistorySkeleton'
import { useHomeWorkStore } from '../../../../store/useHomeWorkStore';
import { useApiRoutesStore } from '../../../../store/useApiRoutesStore';
import useAcademicFlowStore from '../../../../store/useAcademicFlowStore';

export default function CancelledHomework() {

    const isFocused = useIsFocused();
    // global routes 
    const { routes } = useApiRoutesStore.getState();
    const { subjectItem: selectedSubject } = useAcademicFlowStore();
    const { optionList, optionLoader, homeworkCancelled, countCancelled,
        getAllHomeworksHandler, cancelledWorkLoading, isRemoved,
        refreshing, getAllOptionsHandler, selected, setIsRemoved, isYearSessionUpdated, setIsYearSessionUpdated } = useHomeWorkStore();

    const [remainingHeight, setRemainingHeight] = useState(0); // ✅ For dynamic textarea


    // pagination start ----------<><><>----------
    const [pageCancelled, setPageCancelled] = useState(0);
    // pagination end -----------<><><>---------- 


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
        setPageCancelled(0);

        try {
            if (selected?.value) {

                const body = {
                    subject_id: selectedSubject?.class_section_list?.subject_list?.subject_id,
                    class_section_id: selectedSubject?.class_section_list?.subject_list?.class_section_id,
                    year_session_id: selected?.value,
                    page_index: 1,
                    type_id: 0
                };

                const res = await getAllHomeworksHandler(body, "refresh");
                if (res?.data?.status) {
                    setPageCancelled(1);
                }
            }
        } catch (error) {
            console.log("Refresh Error:", error);
        }
    };

    // console.log(pageCancelled, "pageCancelledpageCancelled")
    /* ---------- Load More data---------- */
    const loadMore = async () => {
        if (cancelledWorkLoading) return;

        const currentList = homeworkCancelled;
        const totalCount = countCancelled;
        const currentPage = pageCancelled;

        if (currentList.length >= totalCount) return;

        const nextPage = currentPage + 1;

        const body = {
            subject_id: selectedSubject?.class_section_list?.subject_list?.subject_id,
            class_section_id: selectedSubject?.class_section_list?.subject_list?.class_section_id,
            year_session_id: selected?.value,
            page_index: nextPage,
            type_id: 0
        };

        await getAllHomeworksHandler(body, "loadMore");
        setPageCancelled(nextPage);
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
        if (!isFocused) return;
        if (!selected?.value) return;

        setPageCancelled(0);
        const fetchData = async () => {
            if (
                !isRemoved &&
                homeworkCancelled?.length > 0 &&
                !isYearSessionUpdated?.cancell
            ) {
                return;
            }

            const body = {
                subject_id: selectedSubject?.class_section_list?.subject_list?.subject_id,
                class_section_id: selectedSubject?.class_section_list?.subject_list?.class_section_id,
                year_session_id: selected?.value,
                page_index: 1,
                type_id: 0,
            };

            const res = await getAllHomeworksHandler(body, "initial");

            if (res?.data?.status) {
                setPageCancelled(1);
                setIsRemoved(false);
                setIsYearSessionUpdated({ cancell: false });
            }
        };

        fetchData();
    }, [
        selected?.value,
        isRemoved,
        isYearSessionUpdated?.cancell,
        selectedSubject, isFocused
    ]);

    return (
        <>
            <View style={{ flex: 1 }}>
                <View style={{ flexGrow: 1 }} >
                    <View style={styles.container}>
                        <MainBox borderRadius={12} paddingVertical={verticalScale(0)} paddingHorizontal={0} height="100%" disableScroll style={{ paddingBottom: 0 }}>
                            {(optionLoader || cancelledWorkLoading || refreshing) ?
                                <HomeworkHistorySkeleton /> :
                                <>

                                    {/* ================= HISTORY TAB ================= */}
                                    <View style={{ flex: 1, paddingHorizontal: scale(8) }}>
                                        <CancelledHomeworkHistoryList
                                            data={selected?.value ? homeworkCancelled : []}
                                            getAllHomeworksHandler={getAllHomeworksHandler}
                                            selected={selected} onRefresh={onRefresh}
                                            loadMore={loadMore} />
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

