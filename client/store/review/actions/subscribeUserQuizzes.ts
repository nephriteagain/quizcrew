import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { QuizDoc } from "@/types/review";
import { collection, query, where } from "@react-native-firebase/firestore";
import reviewSelector from "../review.store";

export function subscribeUserQuizzes(uid: string) {
    const quizRef = collection(db, COL.QUIZZES);
    const quizQ = query(quizRef, where("createdBy", "==", uid), where("status", "==", "LIVE"));
    const unsub = quizQ.onSnapshot((snap) => {
        try {
            console.log("subscribeUserQuizzes snapshot");
            const quizzes = snap.docs.map((d) => d.data()) as QuizDoc[];
            // save quizzes to store
            console.log("total user quizzes:", quizzes.length);
            reviewSelector.setState({
                userQuizzes: quizzes.sort((a, b) => b.createdAt - a.createdAt),
            });
        } catch (error) {
            console.error(error);
        }
    });

    return unsub;
}
