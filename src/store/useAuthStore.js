import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from './useUserStore';
import { LogoutCurrentDevice } from '../services/profile/profileServices';
import { useLogoutLockStore } from './useLogoutLockStore';
import * as Keychain from "react-native-keychain";
import { APP_BIOMETRIC_KEY, STORAGE_KEY } from '../screens/userScreens/ProfileScreen/SettingsScreen';

import { useTabStore } from './useTabStore';

const lockStore = useLogoutLockStore.getState();



export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isHydrated: false,
      isCodeScreen: false,
      hasLoggedOut: false,

      // ✅ Login / Auth setter
      // setAuth: (token, user = null) =>
      //   set({
      //     token,
      //     user
      //   }),


      setAuth: async (token, user = null) => {
        try {
          // 1. Save in Keychain

          await Keychain.setGenericPassword("biometric", token, {
            service: APP_BIOMETRIC_KEY,
            // accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
            // accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
          });
          // 2. Save in Zustand state
          set({
            token,
            user,
          });

        } catch (e) {
          console.log("setAuth error:", e);
        }
      },

      clearKeychainData: async () => {
        try {
          await Keychain.resetGenericPassword();
          await AsyncStorage.removeItem(STORAGE_KEY);


          console.log("All Keychain cleared");
        } catch (e) {
          console.log("Keychain error:", e);
        }
      },

      clearTokenOnly: async () => {
        try {
          // 1. Remove from Keychain
          await Keychain.resetGenericPassword();
          // 🔥 ✅ TAB STORE RESET (THIS IS WHAT YOU WANT)
          useTabStore.getState().setActiveTab('Dashboard');
          useTabStore.getState().setLastHomeScreen('HomeScreen');
          // 2. Update Zustand state
          set({
            token: null,
            hasLoggedOut: true,
          });
        
          // 3. Update AsyncStorage (persisted state)
          const stored = await AsyncStorage.getItem("auth-storage");

          if (stored) {
            const parsed = JSON.parse(stored);

            const updated = {
              ...parsed,
              state: {
                ...parsed.state,
                token: null,
              },
            };

            await AsyncStorage.setItem(
              "auth-storage",
              JSON.stringify(updated)
            );
          }
        } catch (err) {
          console.log("Clear Token Error:", err);
        }
      },


      // 🔹 reusable local logout
      clearLocalAuth: async () => {
        try {
          const stored = await AsyncStorage.getItem("auth-storage");

          if (stored) {
            const parsed = JSON.parse(stored);

            const newState = {
              ...parsed,
              state: {
                ...parsed.state,
                token: null,
                user: null,
                isCodeScreen: parsed?.state?.isCodeScreen, // preserve
              },
            };

            await AsyncStorage.setItem(
              "auth-storage",
              JSON.stringify(newState)
            );
          }
          await Keychain.resetGenericPassword();
          await AsyncStorage.removeItem(STORAGE_KEY);

          set({
            token: null,
            user: null,
          });
          const userStore = useUserStore.getState();
          userStore.clearProfile();
          // 🔥 ✅ TAB STORE RESET (THIS IS WHAT YOU WANT)
          useTabStore.getState().setActiveTab('Dashboard');
          useTabStore.getState().setLastHomeScreen('HomeScreen');
        } catch (err) {
          console.log("Local Logout Error:", err);
        }
      },
      // 🔒 Lock setter
      // setLogoutLock: (value) => set({ logoutInProgress: value }),
      // ✅ Local logout only
      logoutAll: async () => {
        await get().clearLocalAuth();
      },
      // ✅ Logout (clear auth state)

      logout: async (url) => {
        set({ logoutLoader: true })
        try {
          const res = await LogoutCurrentDevice(url);
          if (res?.data?.status) {
            await get().clearLocalAuth();
          } else if ((res?.data?.message === "Authorization Error" && res?.data?.status_code === 401)) {
            await get().clearLocalAuth();
          }


        } catch (err) {
          console.log("Logout API Error:", err?.response?.data || err.message);
        } finally {
          set({ logoutLoader: false })
          lockStore.setLogoutLock(false);
        }
      },

      setHydrated: () =>
        set({ isHydrated: true }),

      setCodeScreen: (isCodeScreen) =>
        set({ isCodeScreen }),

      loadCode: async () => {
        try {
          const stored = await AsyncStorage.getItem('auth-storage');
          const code = JSON.parse(stored)?.state?.isCodeScreen
          if (code) {
            set({ isCodeScreen: code })
            // set({ theme: JSON.parse(stored) });
          }
        } catch (e) {
          console.log("Storage Load Error", e);
        }
      },
      // ⭐ Helper getters (Production friendly)
      getToken: () => get().token,
      getUser: () => get().user

    }),
    {
      name: 'auth-storage',

      storage: createJSONStorage(() => AsyncStorage),

      onRehydrateStorage: () => () => {
        useAuthStore.getState().setHydrated();
      },
    }
  )
);