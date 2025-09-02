import { QUIZ_TYPE } from "@/types/review";
import reviewSelector from "../review.store";

export async function createReviewer(type: QUIZ_TYPE, images: string[]) {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/quiz/from-images`;

    console.log("creating reviewer...");
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type,
            images,
        }),
    });

    // Check if the response is ok
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response has content
    const text = await response.text();
    if (!text) {
        throw new Error("Empty response body");
    }

    // Parse JSON
    const json = JSON.parse(text);

    reviewSelector.setState((s) => ({
        quizzes: [json, ...s.quizzes],
    }));
    console.log("reviewer created and saved!");
    return true;
}
