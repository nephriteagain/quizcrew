import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { doc, writeBatch } from "@react-native-firebase/firestore";
import authSelector from "../user.store";

export async function rejectConnection(uid: string) {
    const selfUid = authSelector.getInitialState().user!.uid;

    const selfConnectionRef = doc(db, COL.USERS_DATA, selfUid, COL.CONNECTIONS, uid);
    const otherConnectionRef = doc(db, COL.USERS_DATA, uid, COL.CONNECTIONS, selfUid);

    const batch = writeBatch(db);
    batch.delete(selfConnectionRef);
    batch.delete(otherConnectionRef);

    await batch.commit();

    return true;
}
