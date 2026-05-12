import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist } from "zustand/middleware";

export const useApiRoutesStore = create(
  persist(
    (set, get) => ({
      routes: {},
      assetRoutes: {},
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      // 🔹 API Routes
      setRoutes: (routesArray) => {
        if (!Array.isArray(routesArray) || routesArray.length === 0) {
          set({ routes: {} });
          return;
        }

        const formatted = routesArray.reduce((acc, item) => {
          const key = Object.keys(item)[0];
          acc[key] = item[key];
          return acc;
        }, {});

        set({ routes: formatted });
      },

      // 🔹 Asset Routes
      setAssetRoutes: (assetArray) => {
        if (!Array.isArray(assetArray) || assetArray.length === 0) {
          set({ assetRoutes: {} });
          return;
        }

        const formatted = assetArray.reduce((acc, item) => {
          const key = Object.keys(item)[0];
          acc[key] = item[key];
          return acc;
        }, {});

        set({ assetRoutes: formatted });
      },

      getRoute: (key) => {
        return get().routes?.[key];
      },

      getAssetRoute: (key) => {
        return get().assetRoutes?.[key];
      },
    }),
    {
      name: "api-routes-storage",

      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);