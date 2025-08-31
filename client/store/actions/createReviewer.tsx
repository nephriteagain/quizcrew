import { QUIZ_TYPE } from "@/types/review";
import reviewSelector from "../review.store";

export async function createReviewer(type: QUIZ_TYPE, images: string[]) {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/review`;
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            type,
            images,
        }),
    });
    const json = await response.json();
    reviewSelector.setState((s) => ({
        quizzes: [json, ...s.quizzes],
    }));
    return true;
}
