import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Timestamp } from "@react-native-firebase/firestore";
import { ToFieldValue } from "./utils";

/** strips all method in FirebaseAuthTypes.User */
export type AuthUser = {
    [K in keyof FirebaseAuthTypes.User as FirebaseAuthTypes.User[K] extends Function
        ? never
        : K]: FirebaseAuthTypes.User[K];
};

export type UserData = {
    uid: string;
    status: "DELETED" | "ACTIVE";
    username?: string;
    photoURL?: string;
};

export type UserGroupStatus = "INVITED" | "REQUESTED" | "CONNECTED";

export type GroupStatus = "DELETED" | "ACTIVE";

export interface GroupDoc {
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    status: GroupStatus;
    gid: string;
    owner: string;

    name: string;
    avatar: string | null;
    description: string;
    isPrivate: boolean;
}

export type GroupForm = Omit<GroupDoc, "createdAt" | "updatedAt" | "gid" | "status" | "owner">;

export interface Group extends GroupDoc {
    memberCount: number;
    ownerData: UserData | null;
}

export type ConnectionStatus = "INVITED" | "REQUESTED" | "CONNECTED";

export interface ConnectionMeta {
    uid: string;
    status: ConnectionStatus;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

export interface GroupMember {
    gid: string;
    uid: string;
    /** group member id (doc id) */
    gmId: string;
    status: ConnectionStatus;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    memberType: "OWNER" | "ADMIN" | "MEMBER";
    invitedBy?: string;
}

export interface Connection {
    data: UserData;
    /** the null is the handle search connections */
    meta: ConnectionMeta | null;
}

export type ConnectionMetaPayload = ToFieldValue<ConnectionMeta>;
