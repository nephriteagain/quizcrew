import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { GroupMember } from "@/types/user";
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    limit,
    query,
    where,
} from "@react-native-firebase/firestore";

export async function getGroupMemberData(gid: string, uid?: string) {
    const groupMemberRef = collection(db, COL.GROUP_MEMBERS);
    const groupMemberQ = query(
        groupMemberRef,
        where("uid", "==", uid),
        where("gid", "==", gid),
        limit(1)
    );
    const snap: FirebaseFirestoreTypes.QuerySnapshot = await getDocs(groupMemberQ);
    const docs = snap.docs.map((d) => d.data()) as GroupMember[];
    if (docs.length === 0) return null;
    return docs[0];
}
