import { AuthUser, Connection, Group, UserData } from "@/types/user";
import { create } from "zustand";
import { createSelectors } from "../createSelector";

interface UserStore {
    user: AuthUser | null;
    userData: UserData | null;
    connections: Connection[];
    groups: Group[];
    recommendedConnections: Connection[];
}

const useAuth = create<UserStore>()(
    // persist(
    (_set) => ({
        user: null,
        userData: null,
        connections: [],
        groups: [],
        recommendedConnections: [],
    })
    // {
    //     name: "user-storage",
    //     storage: createZustandAsyncStorage(),
    // }
    // )
);

const authSelector = createSelectors(useAuth);

export default authSelector;
