import { COL } from "@/constants/collections";
import { analytics, db } from "@/firebase";
import { logEvent } from "@react-native-firebase/analytics";
import { doc, updateDoc } from "@react-native-firebase/firestore";

export async function deleteQuiz(quiz_id: string) {
    const quizRef = doc(db, COL.QUIZZES, quiz_id);
    await updateDoc(quizRef, { status: "DELETED" });
    logEvent(analytics, "delete_quiz", { quiz_id });
    return true;
}
