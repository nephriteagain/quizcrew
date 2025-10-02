import { COL } from "@/constants/collections";
import { analytics, auth, db } from "@/firebase";
import { extractAuthUser } from "@/lib/utils/extraAuthUser";
import { logEvent } from "@react-native-firebase/analytics";
import { signInAnonymously } from "@react-native-firebase/auth";
import { doc, setDoc } from "@react-native-firebase/firestore";
import authSelector from "../user.store";

export async function anonSignin() {
    const result = await signInAnonymously(auth);
    const user = result.user;
    const additonal = result.additionalUserInfo;
    const isNewUser = additonal?.isNewUser;

    const userDataRef = doc(db, COL.USERS_DATA, user.uid);
    const authUser = extractAuthUser(user);
    if (isNewUser) {
        console.log("new user detected, creating firestore user document.");
        const userData = { uid: user.uid, status: "ACTIVE" } as const;
        await setDoc(userDataRef, userData);
        authSelector.setState({
            user: authUser,
            userData,
        });
        logEvent(analytics, "sign_up", { method: "anonymous" });
    }
}
