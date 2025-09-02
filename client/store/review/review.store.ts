import { Quiz } from "@/types/review";
import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";
import { createSelectors } from "../createSelector";

interface Review {
    quizzes: Quiz[];
}

const useReview = create<Review>()(
    persist(
        (_set) => ({
            quizzes: [],
        }),
        {
            name: "review-storage",
            storage: createZustandLocalStorage(),
        }
    )
);

const reviewSelector = createSelectors(useReview);

export default reviewSelector;

function createZustandLocalStorage() {
    return {
        getItem: async <T>(name: string): Promise<StorageValue<T> | null> => {
            try {
                const item = localStorage.getItem(name);
                return item ? JSON.parse(item) : null;
            } catch {
                return null;
            }
        },
        setItem: async <T>(name: string, value: StorageValue<T>): Promise<void> => {
            try {
                localStorage.setItem(name, JSON.stringify(value));
            } catch {
                // Handle storage errors silently
            }
        },
        removeItem: async (name: string): Promise<void> => {
            try {
                localStorage.removeItem(name);
            } catch {
                // Handle storage errors silently
            }
        },
    };
}
