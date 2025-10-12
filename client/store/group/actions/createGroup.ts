import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { GroupDoc, GroupForm, GroupMember } from "@/types/user";
import { ToFieldValue } from "@/types/utils";
import {
    collection,
    doc,
    FirebaseFirestoreTypes,
    serverTimestamp,
    writeBatch,
} from "@react-native-firebase/firestore";

export async function createGroup(groupData: GroupForm, ownerId: string) {
    const groupsRef = collection(db, COL.GROUPS);
    const groupRef: FirebaseFirestoreTypes.DocumentReference = doc(groupsRef);
    const payload: ToFieldValue<GroupDoc> = {
        ...groupData,
        createdAt: serverTimestamp(),
        status: "ACTIVE",
        gid: groupRef.id,
        owner: ownerId,
    };
    const groupMembersRef = collection(db, COL.GROUP_MEMBERS);
    const groupMemberDoc = doc(groupMembersRef);
    const groupMembersPayload: ToFieldValue<GroupMember> = {
        gid: groupRef.id,
        uid: ownerId,
        gmId: groupMemberDoc.id,
        status: "CONNECTED",
        createdAt: serverTimestamp(),
        memberType: "OWNER",
    };
    const batch = writeBatch(db);
    batch.set(groupRef, payload);
    batch.set(groupMemberDoc, groupMembersPayload);
    await batch.commit();
    return groupRef.id;
}
