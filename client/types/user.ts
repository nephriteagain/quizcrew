import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Timestamp } from "@react-native-firebase/firestore";

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

export interface UserGroupMeta {
    status: UserGroupStatus;
    gid: string;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

export type GroupStatus = "DELETED" | "ACTIVE";

export interface GroupDoc {
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    gid: string;
    name: string;
    avatar: string;
    description: string;
    owner: string;
    status: GroupStatus;
}

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

export interface Connection {
    data: UserData;
    meta: ConnectionMeta | null;
}
