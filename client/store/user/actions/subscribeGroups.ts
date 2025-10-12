import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { Group, GroupDoc, GroupMember, UserData } from "@/types/user";
import {
    collection,
    doc,
    getCountFromServer,
    getDoc,
    query,
    where,
} from "@react-native-firebase/firestore";
import authSelector from "../user.store";

export function subscribeGroups(uid: string) {
    const groupMembersRef = collection(db, COL.GROUP_MEMBERS);
    const groupMembersQ = query(groupMembersRef, where("uid", "==", uid));

    const unsub = groupMembersQ.onSnapshot((snap) => {
        console.log("subscribeGroups snapshot");
        try {
            const groupsMeta = snap.docs.map((d) => d.data()) as GroupMember[];
            handleGroups(groupsMeta);
        } catch (error) {
            console.error(error);
        }
    });

    return unsub;
}

async function handleGroups(groupsMeta: GroupMember[]) {
    const result = await Promise.all(groupsMeta.map(getGroupData));
    authSelector.setState({ groups: result });
}

async function getGroupData(groupMeta: GroupMember): Promise<Group> {
    const groupRef = doc(db, COL.GROUPS, groupMeta.gid);
    const groupSnap = await getDoc(groupRef);
    const groupData = groupSnap.data() as GroupDoc;
    if (!groupData) {
        throw new Error("Group document not found.");
    }
    const groupMembersRef = collection(db, COL.GROUP_MEMBERS);
    const groupMembersQ = query(groupMembersRef, where("gid", "==", groupMeta.gid));
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
