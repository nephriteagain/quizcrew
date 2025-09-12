import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectors } from "../createSelector";
import { createZustandAsyncStorage } from "../persistence";

/** strips all method in FirebaseAuthTypes.User */
type AuthUser = {
    [K in keyof FirebaseAuthTypes.User as FirebaseAuthTypes.User[K] extends Function
        ? never
        : K]: FirebaseAuthTypes.User[K];
};

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
