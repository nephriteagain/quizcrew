import { FirebaseAuthTypes } from "@react-native-firebase/auth";

/** strips all method in FirebaseAuthTypes.User */
export type AuthUser = {
    [K in keyof FirebaseAuthTypes.User as FirebaseAuthTypes.User[K] extends Function
        ? never
        : K]: FirebaseAuthTypes.User[K];
};
