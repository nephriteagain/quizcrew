import { COL } from "@/constants/collections";
import { analytics, db, storage } from "@/firebase";
import { uploadImageResumable } from "@/lib/utils/uploadImageResumable";
import authSelector from "@/store/user/user.store";
import { Quiz, QUIZ_TYPE, QuizDoc } from "@/types/review";
import { logEvent } from "@react-native-firebase/analytics";
import { doc, setDoc } from "@react-native-firebase/firestore";
import { ref } from "@react-native-firebase/storage";

export async function createReviewer(type: QUIZ_TYPE, images: string[], uid: string) {
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
        const imageUrls = await Promise.all(
            images.map(async (img) => {
                const path = `/users/${uid}/quizTemp/${Math.random().toString(16)}.png`;
                const storageRef = ref(storage, path);
                const response = await fetch(img);
                const blob = await response.blob();
                return uploadImageResumable(storageRef, blob);
            })
        );

        const body = { images: imageUrls, type };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
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
