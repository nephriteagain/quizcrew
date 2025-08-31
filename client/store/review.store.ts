import { Quiz } from "@/types/review";
import { create } from "zustand";
import { createSelectors } from "./createSelector";

interface Review {
    quizzes: Quiz[];
}

const useReview = create<Review>(() => ({
    quizzes: [],
}));

const reviewSelector = createSelectors(useReview);

export default reviewSelector;
