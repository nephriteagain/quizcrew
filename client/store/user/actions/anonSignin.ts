import { COL } from "@/constants/collections";
import { auth, db } from "@/firebase";
import { extractAuthUser } from "@/lib/utils/extraAuthUser";
import { signInAnonymously } from "@react-native-firebase/auth";
import { doc, writeBatch } from "@react-native-firebase/firestore";
import authSelector from "../user.store";

export async function anonSignin() {
    const result = await signInAnonymously(auth);
    const user = result.user;
    const additonal = result.additionalUserInfo;
    const isNewUser = additonal?.isNewUser;

    const userRef = doc(db, COL.USERS, user.uid);
    const userDataRef = doc(db, COL.USERS_DATA, user.uid);
    const authUser = extractAuthUser(user);
    if (isNewUser) {
        console.log("new user detected, creating firestore user document.");
        const batch = writeBatch(db);
        const userData = { uid: user.uid, status: "ACTIVE" } as const;
        batch.set(userRef, authUser);
        batch.set(userDataRef, userData);
        await batch.commit();
        authSelector.setState({
            user: authUser,
            userData,
        });
    }
}
