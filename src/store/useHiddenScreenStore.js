import { create } from 'zustand';

export const useHiddenScreenStore = create(set => ({
  lastHiddenScreen: null,
  setLastHiddenScreen: (screenName) => set({ lastHiddenScreen: screenName }),
}));

