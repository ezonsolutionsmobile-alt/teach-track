import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { splashLogo } from '../assets';
import { themeBaseURL } from "../services/baseUrls";

const STORAGE_KEY = "APP_THEME_CONFIG";

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
}));
