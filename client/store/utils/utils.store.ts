import { create } from "zustand";
import { createSelectors } from "../createSelector";

interface Utils {
    isLoading: boolean;
    loadingText: string | null;
    isCreateUsernameModalShown: boolean;
}

const useUtils = create<Utils>((_set) => ({
    isLoading: false,
    loadingText: null,
    isCreateUsernameModalShown: false,
}));

const utilsSelector = createSelectors(useUtils);

export default utilsSelector;
