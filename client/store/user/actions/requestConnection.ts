import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { ConnectionMetaPayload } from "@/types/user";
import { doc, serverTimestamp, writeBatch } from "@react-native-firebase/firestore";
import { Toast } from "toastify-react-native";
import authSelector from "../user.store";

export async function requestConnection(uid: string) {
    const selfUid = authSelector.getState().user?.uid;
    if (!selfUid) {
        Toast.error("Invalid self UID");
        return;
    }

    const selfConnectionRef = doc(db, COL.USERS_DATA, selfUid, COL.CONNECTIONS, uid);
    const otherConnectionRef = doc(db, COL.USERS_DATA, uid, COL.CONNECTIONS, selfUid);

    const selfPayload: ConnectionMetaPayload = {
        uid,
        status: "REQUESTED",
        createdAt: serverTimestamp(),
    };

    const otherPayload: ConnectionMetaPayload = {
        uid: selfUid,
        status: "INVITED",
        createdAt: serverTimestamp(),
    };

    const batch = writeBatch(db);
    batch.set(selfConnectionRef, selfPayload);
    batch.set(otherConnectionRef, otherPayload);

    await batch.commit();

    return true;
}
