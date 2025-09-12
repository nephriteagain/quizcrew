import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { doc, updateDoc } from "@react-native-firebase/firestore";

export async function deleteQuiz(quiz_id: string) {
    const quizRef = doc(db, COL.QUIZZES, quiz_id);
    await updateDoc(quizRef, { status: "DELETED" });
    return true;
}
