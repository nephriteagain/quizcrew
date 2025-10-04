import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { ConnectionMetaPayload } from "@/types/user";
import { doc, serverTimestamp, writeBatch } from "@react-native-firebase/firestore";
import authSelector from "../user.store";

export async function approveConnection(uid: string) {
    const selfUid = authSelector.getState().user!.uid;

    const selfConnectionRef = doc(db, COL.USERS_DATA, selfUid, COL.CONNECTIONS, uid);
    const otherConnectionRef = doc(db, COL.USERS_DATA, uid, COL.CONNECTIONS, selfUid);

    const selfPayload: Pick<ConnectionMetaPayload, "status" | "updatedAt"> = {
        status: "CONNECTED",
        updatedAt: serverTimestamp(),
    };

    const otherPayload: Pick<ConnectionMetaPayload, "status" | "updatedAt"> = {
        status: "CONNECTED",
        updatedAt: serverTimestamp(),
    };

    const batch = writeBatch(db);
    batch.update(selfConnectionRef, selfPayload);
    batch.update(otherConnectionRef, otherPayload);

    await batch.commit();

    return true;
}
