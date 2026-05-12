import { create } from "zustand";
import { GetEmployeeDetails } from "../services/profile/profileServices";


export const useUserStore = create((set, get) => ({
  profile: [],
  loading: false,
  lastFetched: null,

  getProfile: async (url) => {
    const { profile, lastFetched } = get();
    const now = Date.now();

    // ⭐ 5 min cache
    // if (profile && lastFetched && now - lastFetched < 30000) {
    //   return;
    // }
    set({ loading: true });
    try {
      const res = await GetEmployeeDetails(url);
      set({
        profile: res?.data?.data?.list,
        loading: false,
        lastFetched: now
      });

    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  clearProfile: () => set({
    profile: null,
    lastFetched: null
  })
}));
