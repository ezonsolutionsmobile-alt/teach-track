import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useApiRoutesStore } from '../store/useApiRoutesStore';


const authStore = useAuthStore.getState();
const { routes } = useApiRoutesStore.getState();
import { useLogoutLockStore } from "../store/useLogoutLockStore";
const createApi = (dynamicBaseURL) => {
  const api = axios.create({
    baseURL: dynamicBaseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // ✅ REQUEST INTERCEPTOR
  api.interceptors.request.use(
    async (config) => {
      try {
        const storageData = await AsyncStorage.getItem('auth-storage');

        if (storageData) {
          const parsed = JSON.parse(storageData);
          const token = parsed?.state?.token;

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.log("Token Parse Error", error);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
  // setLogoutLock
  let logoutLock = true
  // ✅ RESPONSE INTERCEPTOR
  api.interceptors.response.use(
    async (response) => {
      const logoutStore = useLogoutLockStore.getState();
      if (response.data?.status_code == 401 && !logoutStore?.logoutInProgress) {
        logoutStore.setLogoutLock(true);
        // authStore?.setLogoutLock(true)
        await authStore?.logout(routes?.logout);
      }

      return response;
    },
    async (error) => {
      console.log("🚨 Real HTTP Error:", error.response?.status);
      return Promise.reject(error);
    }
  );

  return api;
};

export default createApi;

