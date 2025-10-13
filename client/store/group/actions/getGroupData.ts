import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { Group, GroupDoc, UserData } from "@/types/user";
import {
    collection,
    doc,
    getCountFromServer,
    getDoc,
    query,
    where,
} from "@react-native-firebase/firestore";

export async function getGroupData(gid: string): Promise<Group> {
    const groupRef = doc(db, COL.GROUPS, gid);
    const groupSnap = await getDoc(groupRef);
    const groupData = groupSnap.data() as GroupDoc;
    if (!groupData) {
        throw new Error("Group document not found.");
    }
    const groupMembersRef = collection(db, COL.GROUP_MEMBERS);
    const groupMembersQ = query(groupMembersRef, where("gid", "==", gid));
    const groupMemberSnap = await getCountFromServer(groupMembersQ);
    const memberCount = groupMemberSnap.data().count;

    const userDataRef = doc(db, COL.USERS_DATA, groupData.owner);
    const userDataSnap = await getDoc(userDataRef);
    const userData = userDataSnap.data() as UserData | undefined;

    return {
        ...groupData,
        memberCount,
        ownerData: userData ?? null,
    };
}
