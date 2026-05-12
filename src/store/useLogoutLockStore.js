import { create } from "zustand";

export const useLogoutLockStore = create((set, get) => ({
  logoutInProgress: false,

  // ✅ Lock
  setLogoutLock: (value) =>
    set({
      logoutInProgress: value
    }),

  // ✅ Safe check
  isLocked: () => get().logoutInProgress
}));