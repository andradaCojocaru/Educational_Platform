import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

/**
 * Authentication store.
 *
 * Fields
 * ──────
 * user           → the decoded JWT payload (or null)
 * loadingState   → true while auth boot-strapping, false when ready
 *
 * Actions
 * ───────
 * setUser(payload)        → store decoded token
 * setLoadingState(boolean)
 * isLoggedIn()            → convenience helper
 */
const useAuthStore = create((set, get) => ({
  // ───── state ─────
  user: null,
  loadingState: true,

  // ───── actions ─────
  setUser: (payload) => set({ user: payload, loadingState: false }),
  setLoadingState: (value) => set({ loadingState: value }),
  isLoggedIn: () => get().user !== null,
}));

// Dev-tools in development mode
if (import.meta.env.DEV) {
  mountStoreDevtool("AuthStore", useAuthStore);
}

export { useAuthStore };
