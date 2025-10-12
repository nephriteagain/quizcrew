import { COL } from "@/constants/collections";
import { analytics, db } from "@/firebase";
import authSelector from "@/store/user/user.store";
import { Quiz, QUIZ_TYPE, QuizDoc } from "@/types/review";
import { logEvent } from "@react-native-firebase/analytics";
import { doc, setDoc } from "@react-native-firebase/firestore";

export async function createReviewer(type: QUIZ_TYPE, images: string[]) {
    const URL =
        process.env.NODE_ENV === "production"
            ? process.env.EXPO_PUBLIC_API_URL_PROD
            : process.env.EXPO_PUBLIC_API_URL;

    const url = `${URL}/quiz/from-images`;
    console.log(url);

    const user = authSelector.getState().user;

    logEvent(analytics, "create_quiz_start", { quiz_type: type, image_count: images.length });

    console.log("creating reviewer...");
    try {
        // Create FormData for multipart/form-data request
        const formData = new FormData();
        formData.append("type", type);
        formData.append("images", JSON.stringify(images));

        const response = await fetch(url, {
            method: "POST",
            body: formData,
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

        logEvent(analytics, "create_quiz", {
            quiz_type: quiz.type,
            question_count: quiz.questions.length,
            image_count: images.length,
        });

        console.log("reviewer created and saved!");
        return true;
    } catch (error) {
        logEvent(analytics, "create_quiz_error", {
            quiz_type: type,
            error_message: (error as Error).message,
        });
        throw error;
    }
}
