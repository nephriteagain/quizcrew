import { QuizDoc, QuizDocWithUserData } from "@/types/review";
import { create } from "zustand";
import { createSelectors } from "../createSelector";

interface Review {
    quizzes: QuizDocWithUserData[];
    userQuizzes: QuizDoc[];
}

// const useReview = create<Review>((_set) => ({ quizzes: [] }));

const useReview = create<Review>()(
    // persist(
    (_set) => ({
        quizzes: [],
        userQuizzes: [],
    })
    //     {
    //         name: "review-storage",
    //         storage: createZustandAsyncStorage(),
    //     }
    // )
);

const reviewSelector = createSelectors(useReview);

export default reviewSelector;
