import { AuthUser, UserData } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectors } from "../createSelector";
import { createZustandAsyncStorage } from "../persistence";

interface UserStore {
    user: AuthUser | null;
    userData: UserData|null
}

const useUser = create<UserStore>()(
    persist(
        (_set) => ({
            user: null,
            userData: null
        }),
        {
            name: "user-storage",
            storage: createZustandAsyncStorage(),
        }
    )
);

const userSelector = createSelectors(useUser);

export default userSelector;
