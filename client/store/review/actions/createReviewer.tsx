import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import authSelector from "@/store/user/user.store";
import { Quiz, QUIZ_TYPE, QuizDoc } from "@/types/review";
import { doc, setDoc } from "@react-native-firebase/firestore";
import reviewSelector from "../review.store";

export async function createReviewer(type: QUIZ_TYPE, images: string[]) {
    const URL =
        process.env.NODE_ENV === "production"
            ? process.env.EXPO_PUBLIC_API_URL_PROD
            : process.env.EXPO_PUBLIC_API_URL;

    const url = `${URL}/quiz/from-images`;
    console.log(url);

    const user = authSelector.getState().user;

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
    const quiz = (await response.json()) as Quiz | null;
    if (!quiz) {
        throw new Error("Empty response body");
    }

    // save quiz to firestore document
    const quizRef = doc(db, COL.QUIZZES, quiz.quiz_id);
    const quizDoc: QuizDoc = {
        ...quiz,
        createdBy: user?.uid ?? null,
        status: "LIVE",
        privacy: "JUST_ME",
    };

    console.log("creating quiz...");
    await setDoc(quizRef, quizDoc);
    console.log("quiz created.");

    reviewSelector.setState((s) => ({
        quizzes: [quizDoc, ...s.quizzes],
    }));
    console.log("reviewer created and saved!");
    return true;
}
