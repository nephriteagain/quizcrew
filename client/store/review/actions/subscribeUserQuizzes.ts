import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { QuizDoc } from "@/types/review";
import { collection, orderBy, query, where } from "@react-native-firebase/firestore";
import reviewSelector from "../review.store";

export function subscribeUserQuizzes(uid: string) {
    const quizRef = collection(db, COL.QUIZZES);
    const quizQ = query(
        quizRef,
        where("createdBy", "==", uid),
        where("status", "==", "LIVE"),
        orderBy("createdAt", "desc")
    );
    const unsub = quizQ.onSnapshot((snap) => {
        console.log("subscribeUserQuizzes snapshot");
        if (!snap) return;
        const quizzes = snap.docs.map((d) => d.data()) as QuizDoc[];
        // save quizzes to store
        console.log("total user quizzes:", quizzes.length);
        reviewSelector.setState({
            userQuizzes: quizzes,
        });
    });

    return unsub;
}
