// networkStore.js
import { create } from 'zustand';

export const useNetworkStore = create((set) => ({
  isOffline: false,
  setOffline: (val) => set({ isOffline: val }),
}));