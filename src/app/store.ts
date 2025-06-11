import { create } from "zustand";
import { User } from "./types";


 interface UserStore {
  user: User | undefined;
  setUser: (user?: User) => void;
 }

export const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  setUser: (user?: User) => set({ user }),
}));