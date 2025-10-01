import { COL } from "@/constants/collections";
import { auth, db } from "@/firebase";
import { extractAuthUser } from "@/lib/utils/extraAuthUser";
import { createUserWithEmailAndPassword } from "@react-native-firebase/auth";
import { doc, setDoc } from "@react-native-firebase/firestore";
import authSelector from "../user.store";

export async function signupEmail(email: string, password: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const additonal = result.additionalUserInfo;
    const isNewUser = additonal?.isNewUser;

    const userDataRef = doc(db, COL.USERS_DATA, user.uid);
    const authUser = extractAuthUser(user);
    if (isNewUser) {
        console.log("new user detected, creating firestore user document.");
        const userData = { uid: user.uid, status: "ACTIVE" } as const;
        await setDoc(userDataRef, userData, { merge: true });
        authSelector.setState({
            user: authUser,
            userData,
        });
    }
    return true;
}
