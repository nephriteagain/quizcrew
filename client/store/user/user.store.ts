import { AuthUser } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectors } from "../createSelector";
import { createZustandAsyncStorage } from "../persistence";

interface UserStore {
    user: AuthUser | null;
}

const useUser = create<UserStore>()(
    persist(
        (_set) => ({
            user: null,
        }),
        {
            name: "user-storage",
            storage: createZustandAsyncStorage(),
        }
    )
);

const userSelector = createSelectors(useUser);

export default userSelector;
