import { FirebaseAuthTypes } from "@react-native-firebase/auth";

/** strips all method in FirebaseAuthTypes.User */
export type AuthUser = {
    [K in keyof FirebaseAuthTypes.User as FirebaseAuthTypes.User[K] extends Function
        ? never
        : K]: FirebaseAuthTypes.User[K];
};

export type UserData = {
    username?: string;
    uid: string;
    photoURL?: string;
};

export interface Connection {
    id: string;
    name: string;
    avatar: string;
    status: "online" | "offline" | "away";
    lastSeen?: string;
    mutualFriends?: number;
}

export interface Group {
    id: string;
    name: string;
    avatar: string;
    memberCount: number;
    lastActivity: string;
    unreadMessages?: number;
    description: string;
}
