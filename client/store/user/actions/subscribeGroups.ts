import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { Group, GroupDoc, UserData, UserGroupMeta } from "@/types/user";
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
    const userGroupsRef = collection(db, COL.USERS_DATA, uid, COL.USER_GROUPS);
    const userGroupsQ = query(
        userGroupsRef,
        where("status", "in", ["CONNECTED", "INVITED", "REQUESTED"])
    );

    const unsub = userGroupsQ.onSnapshot((snap) => {
        console.log("subscribeGroups snapshot");
        if (!snap) return;
        const groupsMeta = snap.docs.map((d) => d.data()) as UserGroupMeta[];
        handleGroups(groupsMeta);
    });

    return unsub;
}

async function handleGroups(groupsMeta: UserGroupMeta[]) {
    const result = await Promise.all(groupsMeta.map(getGroupData));
    authSelector.setState({ groups: result });
}

async function getGroupData(groupMeta: UserGroupMeta): Promise<Group> {
    const groupRef = doc(db, COL.GROUPS, groupMeta.gid);
    const groupSnap = await getDoc(groupRef);
    const groupData = groupSnap.data() as GroupDoc;
    if (!groupData) {
        throw new Error("Group document not found.");
    }
    const groupMembersRef = collection(db, COL.GROUPS, groupData.gid, COL.MEMBERS);
    const groupMemberSnap = await getCountFromServer(groupMembersRef);
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
