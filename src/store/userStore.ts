import type { User } from "@/types";
import { create, type StateCreator } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

interface userActions {
  login: (user: User, accessToken: string) => void;
  // register: (user: User) => void;
  logout: () => void;
  setAccessToken: (accessToken: string) => void;
}

type UserStore = AuthState & userActions;

const userStore: StateCreator<
  UserStore,
  [["zustand/devtools", unknown], ["zustand/devtools", unknown]]
> = (set) => ({
  user: null,
  accessToken: null,
  login: (user: User, accessToken: string) => set({ user, accessToken }),
  logout: () => set({ user: null, accessToken: null }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
});

const useUserStore = create<UserStore>()(
  devtools(
    persist(userStore, {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }),
  ),
);

export default useUserStore;
