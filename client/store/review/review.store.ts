import { Quiz } from "@/types/review";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectors } from "../createSelector";
import { createZustandAsyncStorage } from "../persistence";

interface Review {
    quizzes: Quiz[];
}

// const useReview = create<Review>((_set) => ({ quizzes: [] }));

const useReview = create<Review>()(
    persist(
        (_set) => ({
            quizzes: [],
        }),
        {
            name: "review-storage",
            storage: createZustandAsyncStorage(),
        }
    )
);

const reviewSelector = createSelectors(useReview);

export default reviewSelector;
