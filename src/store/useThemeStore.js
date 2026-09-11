import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { splashLogo } from '../assets';
import APP_CONFIG from "../config/app.config";
import { app_version_url } from "../services/baseUrls";

const STORAGE_KEY = "APP_THEME_CONFIG";
const APP_VERSION_STORAGE_KEY = "APP_VERSION_CONFIG";
export const useThemeStore = create((set, get) => ({

    // 🟣 DEFAULT (offline safe)
    theme: {
        branding: {
            logo: splashLogo,
            width: 150,
            height: 150,
            splash_background: "#7B68EE",
            splash_image: "",
            is_splash_background_type: 1,
        },
        theme: {
            primary: "#7B68EE",
            dark_text: "#292D34",
            light_text: "#A0A0A0",
            medium_text: "#6B6B6B"
        },
    },

    appVersion: null,
    isAppVersionLoading: false,

    setAppVersionLoading: (value) =>
        set({ isAppVersionLoading: value }),

    isThemeLoading: false,
    setThemeLoading: (value) => set({ isThemeLoading: value }),
    // 🟣 SET THEME
    setTheme: (themeData) => set({ theme: themeData }),

    // 🟣 LOAD FROM CACHE (instant app open)
    loadStoredTheme: async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                set({ theme: JSON.parse(stored) });
            }
        } catch (e) {
            console.log("Storage Load Error", e);
        }
    },

    // 🟣 FETCH FROM API
    fetchTheme: async (url) => {
        get().setThemeLoading(true);
        try {
            const res = await axios.post(
                `${url}`
            );
            const apiTheme = res?.data?.data;
            if (!apiTheme) return;
            // 🔥 MERGE with default (branding never lost)
            const mergedTheme = {
                ...get().theme,
                ...apiTheme,
                branding: {
                    ...get().theme.branding,
                    ...apiTheme?.branding,
                },
            };
            // set store
            set({ theme: mergedTheme });
            // save cache
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mergedTheme));

        } catch (err) {
            console.log("Theme API Error:", err?.response?.data || err.message);
        } finally {
            get().setThemeLoading(false);
        }
    },

    // 🟣 Helpful getter
    colors: () => {
        const state = get();
        return state.theme?.colors || {};
    },


     fetchAppVersion: async () => {
        get().setAppVersionLoading(true);

        try {
            const formData = new FormData();

            formData.append("app_name", APP_CONFIG?.APP_NAME);
            formData.append("platform_name", APP_CONFIG?.PLATFORM);

            const res = await axios.post(
                app_version_url,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("📱 App Version API:", res?.data);

            const versionData = res?.data?.data;

            if (!versionData) return;

            set({
                appVersion: versionData
            });

            await AsyncStorage.setItem(
                APP_VERSION_STORAGE_KEY,
                JSON.stringify(versionData)
            );
        } catch (err) {
            console.log(
                "App Version API Error:",
                err?.response?.data || err.message
            );
        } finally {
            get().setAppVersionLoading(false);
        }
    },

    loadStoredAppVersion: async () => {
        try {
            const stored = await AsyncStorage.getItem(
                APP_VERSION_STORAGE_KEY
            );

            if (stored) {
                set({
                    appVersion: JSON.parse(stored)
                });
            }
        } catch (e) {
            console.log(
                "App Version Storage Load Error:",
                e
            );
        }
    },
}));
