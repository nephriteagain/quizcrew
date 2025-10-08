import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { QuizDoc } from "@/types/review";
import { collection, query, where } from "@react-native-firebase/firestore";

export function subscribeOtherUserQuizzes(uid: string, onChange: (quizzes: QuizDoc[]) => void) {
    const quizRef = collection(db, COL.QUIZZES);
    const quizQ = query(quizRef, where("createdBy", "==", uid), where("status", "==", "LIVE"));
    const unsub = quizQ.onSnapshot((snap) => {
        console.log("subscribeUserQuizzes snapshot");
        try {
            const quizzes = snap.docs.map((d) => d.data()) as QuizDoc[];
            onChange(quizzes.sort((a, b) => b.createdAt - a.createdAt));
        } catch (error) {
            console.error(error);
        }
    });

    return unsub;
}
