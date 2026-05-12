// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const useScreenNavigationStore = create(
//   persist(
//     (set, get) => ({
//       itemType: null,
//       itemData: 'homework',
//       isHydrated: false,

//       // Set navigation data
//       setNavigationData: (type, data) => set({ itemType: type, itemData: data }),

//       // Clear navigation data
//       clearNavigationData: () => set({ itemType: null, itemData: null }),

//       // Hydration flag
//       setHydrated: () => set({ isHydrated: true }),
//     }),
//     {
//       name: 'navigation-data-storage',
//       storage: createJSONStorage(() => AsyncStorage),
//       onRehydrateStorage: () => () => {
//         useScreenNavigationStore.getState().setHydrated();
//       },
//     }
//   )
// );


import { create } from 'zustand';

export const useScreenNavigationStore = create((set) => ({
  itemType: null,
  itemData: {type: "homework"},

  // Set navigation data
  setNavigationData: (type, data) =>
    set({
      itemType: type,
      itemData: data,
    }),

  // Clear navigation data
  clearNavigationData: () =>
    set({
      itemType: null,
      itemData: null
    }),
}));
