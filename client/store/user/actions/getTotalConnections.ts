import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { collection, getCountFromServer, query, where } from "@react-native-firebase/firestore";

export async function getTotalConnections(uid: string) {
    const userConnectionRef = collection(db, COL.USERS_DATA, uid, COL.CONNECTIONS);
    const userConnectionQ = query(userConnectionRef, where("status", "==", "CONNECTED"));
    const snap = await getCountFromServer(userConnectionQ);
    const count = snap.data().count;
    return count;
}
