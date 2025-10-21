import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { collection, getCountFromServer, query, where } from "@react-native-firebase/firestore";

export async function getTotalGroups(uid: string) {
    const groupMembersRef = collection(db, COL.GROUP_MEMBERS);
    const groupMembersQ = query(groupMembersRef, where("uid", "==", uid));
    const snap = await getCountFromServer(groupMembersQ);
    const count = snap.data().count;
    return count;
}
