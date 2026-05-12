import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useNavigationStore = create(
  persist(
    (set, get) => ({
      // Current active tab in MainTabs
      activeTab: 'HomeScreen',

      // Set active tab
      setActiveTab: (tabName) => set({ activeTab: tabName }),

      // Optional: reset to default tab
      resetTab: () => set({ activeTab: 'HomeScreen' }),
    }),
    {
      name: 'navigation-storage', // storage key
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate navigation store', error);
          return;
        }
        console.log('Navigation store hydrated', state);
      },
    }
  )
);
