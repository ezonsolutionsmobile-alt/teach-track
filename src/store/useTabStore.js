// store/useTabStore.js
import { create } from 'zustand';

export const useTabStore = create((set) => ({
  activeTab: 'Dashboard',         // currently active tab
  lastHomeScreen: 'HomeScreen',   // preserve last screen in HomeStack
  lastFeeScreen: 'Paid',
  lastTopBarScreen: null,

  source: null,

  setActiveTab: (tabName) => set({ activeTab: tabName }),
  setLastHomeScreen: (screenName) => set({ lastHomeScreen: screenName }),
  setLastFeeScreen: (screen) => set({ lastFeeScreen: screen }),
  setLastTopBarScreen: (screen) => set({ lastTopBarScreen: screen }),
  setSource: (screen) => set({ source: screen }),
}));