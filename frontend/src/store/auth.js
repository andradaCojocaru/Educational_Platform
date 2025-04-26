import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

export const useAuthStore = create((set, get) => ({
  /* ---------------- STATE ---------------- */
  allUserData : null,          // { id, email, role, … } | null
  loadingState: true,

  /* --------------- GETTERS --------------- */
  isLoggedIn  : () => get().allUserData !== null,

  getUser     : () => ({
    user_id :  get().allUserData?.user_id  ?? null,
    username:  get().allUserData?.username ?? null,
    role    :  get().allUserData?.role     ?? null,
  }),

  /* --------------- ACTIONS --------------- */
  setUser        : (userObj) => set({ allUserData: userObj }),
  setLoadingState: (loading) => set({ loadingState: loading }),
}));

if (import.meta.env.DEV) {
  mountStoreDevtool("AuthStore", useAuthStore);
}
