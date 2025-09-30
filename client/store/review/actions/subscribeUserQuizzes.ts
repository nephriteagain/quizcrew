import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { QuizDoc } from "@/types/review";
import { collection, query, where } from "@react-native-firebase/firestore";
import reviewSelector from "../review.store";

export function subscribeUserQuizzes(uid: string) {
    const quizRef = collection(db, COL.QUIZZES);
    const quizQ = query(quizRef, where("createdBy", "==", uid), where("status", "==", "LIVE"));
    const unsub = quizQ.onSnapshot((snap) => {
        console.log("subscribeUserQuizzes snapshot");
        if (!snap) return;
        const quizzes = snap.docs.map((d) => d.data()) as QuizDoc[];
        // save quizzes to store
        reviewSelector.setState({
            quizzes,
        });
    });

    return unsub;
}
