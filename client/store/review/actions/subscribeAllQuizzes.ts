import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { QuizDoc } from "@/types/review";
import { Connection } from "@/types/user";
import { collection, orderBy, query, Unsubscribe, where } from "@react-native-firebase/firestore";
import { uniqBy } from "lodash";
import reviewSelector from "../review.store";

export function subscribeAllQuizzes(uid: string, connections: Connection[]) {
    const activeConnections = connections.filter((c) => c.meta && c.meta.status === "CONNECTED");
    const activeConnectionUids: string[] = activeConnections.map((c) => c.data.uid);
    console.log("total active connections", activeConnectionUids.length);
    const activeConnectionUidGrouped: string[][] = splitArr(activeConnectionUids, uid, 10);

    const quizRef = collection(db, COL.QUIZZES);
    let unsubs: Unsubscribe[] = [];

    for (const uids of activeConnectionUidGrouped) {
        const quizQ = query(
            quizRef,
            where("status", "==", "LIVE"),
            where("createdBy", "in", uids),
            orderBy("createdAt", "desc")
        );
        const unsub = quizQ.onSnapshot((snap) => {
            console.log("subscribeAllQuizzes snapshot");
            if (!snap) return;
            const newData = snap
                .docChanges()
                .filter((change) => change.type === "added")
                .map((d) => d.doc.data()) as QuizDoc[];
            const updatedData = snap
                .docChanges()
                .filter((change) => change.type === "modified")
                .map((d) => d.doc.data()) as QuizDoc[];
            const removedData = snap
                .docChanges()
                .filter((change) => change.type === "removed")
                .map((d) => d.doc.data()) as QuizDoc[];

            const prevQuzzes = reviewSelector.getState().quizzes;
            const withUpdatedData = prevQuzzes.map((q) => {
                const hasUpdate = updatedData.find((u) => u.quiz_id === q.quiz_id);
                if (hasUpdate) {
                    return hasUpdate;
                }
                return q;
            });
            const withoutRemovedData = withUpdatedData.filter((q) => {
                const isRemoved = removedData.some((u) => u.quiz_id === q.quiz_id);
                if (isRemoved) {
                    return false;
                }
                return true;
            });
            const withNewData = uniqBy(
                [...newData, ...withoutRemovedData].sort((a, b) => b.createdAt - a.createdAt),
                "quiz_id"
            );

            // save quizzes to store
            reviewSelector.setState(() => ({
                quizzes: withNewData,
            }));
        });

        unsubs.push(unsub);
    }

    const multiUnsub: Unsubscribe = () => {
        unsubs.forEach((u) => u());
    };

    return multiUnsub;
}

function splitArr(arr: string[], uid: string, length: number): string[][] {
    const result = [[uid]];
    let idx = 0;
    for (const id of arr) {
        if (result[idx].length === 30) {
            result.push([id]);
            ++idx;
        } else {
            result[idx].push(id);
        }
    }
    return result;
}
