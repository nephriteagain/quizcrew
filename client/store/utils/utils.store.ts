import { create } from "zustand";
import { createSelectors } from "../createSelector";

interface Utils {
    isLoading: boolean;
    loadingText: string | null;
}

const useUtils = create<Utils>((_set) => ({
    isLoading: false,
    loadingText: null,
}));

const utilsSelector = createSelectors(useUtils);

export default utilsSelector;
