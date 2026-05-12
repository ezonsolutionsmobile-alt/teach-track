import { create } from "zustand";
import { GetAllHomework, GetAllOptions, GetCampusShiftClassSectionDetails, homeWorkDelete } from "../services/homework/homeWorkServices";
import { HomeWorkSave, homeWorkUpdate } from '../services/homework/homeworkSaveService'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApiRoutesStore } from "./useApiRoutesStore";
import { formDataInstance } from '../services/formDataInstance';



const { routes } = useApiRoutesStore.getState();

export const useHomeWorkStore = create((set, get) => ({
    // ================= State =================
    selectedSubject: {},


    optionList: [],
    optionLoader: false,
    selected: null,
    previousSelect: null,
    isYearSessionUpdated: {
        active: false,
        cancell: false
    },

    homeworkList: [],
    count: 0,
    isUpdated: false,

    homeworkCancelled: [],
    countCancelled: 0,
    isRemoved: false,

    homeworkLoading: false,
    cancelledWorkLoading: false,
    refreshing: false,
    loadingMore: false,

    campusShiftList: [],
    campusShiftLoader: false,

    homework: [],
    loading: false,
    addLoading: false,

    setSelectedSubject: (payload) =>
        set({
            selectedSubject: payload
        }),

    setIsYearSessionUpdated: (payload) =>
        set((state) => ({
            isYearSessionUpdated: {
                ...state.isYearSessionUpdated, // preserve other keys
                ...payload,                    // update only keys passed
            },
        })),

    setSelected: (payload) =>
        set({
            selected: payload
        }),

    setPreviousSelect: (payload) =>
        set({
            previousSelect: payload
        }),

    setIsRemoved: (remove) =>
        set({
            isRemoved: remove
        }),

    setIsUpdated: (payload) =>
        set({
            isUpdated: payload
        }),

    // ================= Get All HomeWork Handler =================
    getAllHomeworksHandler: async (body, type = "initial") => {
        const isActive = body?.type_id == 1 ? true : false

        const { loadingMore } = get();

        if (type === "loadMore" && loadingMore) return; //  STOP the duplicate call

        if (type === "refresh") set({ refreshing: true });
        else if (type === "loadMore") set({ loadingMore: true });
        else set({ homeworkLoading: true, cancelledWorkLoading: true });

        try {
            const res = await GetAllHomework(body);


            if (res?.data?.status) {
                set((state) => {

                    const newData = res?.data?.data ?? [];

                    // Function to merge and remove duplicates using last 50 items
                    const mergeWithLast30Check = (currentList, newData) => {
                        if (type !== "loadMore") return newData;

                        // Take last 50 items
                        const lastItems = currentList.slice(-30);
                        const lastIds = new Set(lastItems.map(item => item.id));

                        // Filter newData to only include items not in last 50
                        const filteredNewData = newData.filter(item => !lastIds.has(item.id));

                        return [...currentList, ...filteredNewData];
                    };

                    if (isActive) {
                        const updatedList = mergeWithLast30Check(state.homeworkList, newData);

                        return {
                            homeworkList: updatedList,
                            count:
                                type !== "loadMore" && res?.data?.count !== undefined
                                    ? Number(res?.data?.count)
                                    : state.count,
                        };

                    } else {
                        const updatedCancelled = mergeWithLast30Check(state.homeworkCancelled, newData);

                        return {
                            homeworkCancelled: updatedCancelled,
                            countCancelled:
                                type !== "loadMore" && res?.data?.count !== undefined
                                    ? Number(res?.data?.count)
                                    : state.countCancelled,
                        };
                    }
                });
            } else {
                set({
                    ...(isActive
                        ? { homeworkList: [] }
                        : { homeworkCancelled: [] }
                    )
                });
            }
            return res;
        } catch (error) {
            throw error;
        } finally {
            if (type === "refresh") set({ refreshing: false });
            else if (type === "loadMore") set({ loadingMore: false });
            else set({ homeworkLoading: false, cancelledWorkLoading: false });
        }
    },

    clearHomeworkData: () => set({
        homeworkList: [],
        count: 0,
        homeworkCancelled: [],
        countCancelled: 0
    }),
    // ================= Get All Options Handler =================
    getAllOptionsHandler: async (url, body) => {
        set({ optionLoader: true })
        try {
            const res = await GetAllOptions(url, body)
            if (res?.data?.status) {
                set({
                    optionList: res?.data?.data?.year_session ?? [],
                    selected: res?.data?.data?.year_session[0]
                });
            }
        } catch (error) {
            throw error;
        } finally {
            set({ optionLoader: false })
        }
    },

    // ================= Get Campus Shift Class Section Details =================
    getCampusShift: async (url) => {
        set({ campusShiftLoader: true });
        try {
            const res = await GetCampusShiftClassSectionDetails(url);
            if (res?.data?.status) {
                set({
                    campusShiftList: res?.data?.data ?? [],
                });
            } else {
                set({
                    campusShiftList: [],
                });
            }
        } catch (error) {
            throw error;
        } finally {
            set({ campusShiftLoader: false });
        }
    },

    // ================= Add Homework =================
    addHomeWork: async (url, payload) => {
        set({ addLoading: true });

        try {
            const res = await formDataInstance(url, payload);
            return res;
        } finally {
            set({ addLoading: false });
        }
    },

    // ================= Update Homework =================
    updateHomeWork: async (url, payload, optimisticPayload) => {
        // 🔥 Optimistic update UI ke liye pehle
        if (optimisticPayload?.id) {
            set((state) => ({
                homeworkList: state.homeworkList.map(item =>
                    item.id == optimisticPayload.id // double equals for type safety
                        ? { ...item, home_work: optimisticPayload.homework } // sirf description update
                        : item
                ),
            }));
        }

        try {
            const res = await formDataInstance(url, payload);
            return res;
        } catch (error) {
            console.log("updateHomeWork error:", error);
            throw error;
        }
    },
    // ================= Remove Homework =================
    removeHomeWork: async (payload) => {

        try {
            const res = await homeWorkDelete(payload);

            if (res?.data?.status) {
                set({ isRemoved: true })
                const id = payload?.home_work_id;
                //  Remove from list optimistically
                set((state) => {
                    // Find the homework being deleted
                    const removedItem = state.homeworkList.find(item => item.id === id);
                    console.log(state?.isRemoved, "state?.isRemovedstate?.isRemovedstate?.isRemoved><><><><><><")
                    return {
                        // Remove from Active list
                        homeworkList: state.homeworkList.filter(item => item.id !== id),

                        // Add to Cancelled list at top
                        homeworkCancelled: removedItem && !state?.isRemoved
                            ? [removedItem, ...state.homeworkCancelled]
                            : state.homeworkCancelled,
                    };
                });
            }

            return res;

        } catch (error) {
            throw error;
        }
    },

    // ================= Clear =================
    clearHomeWork: () =>
        set({
            homeworkList: [],
            homeworkCancelled: [],
        })
}));