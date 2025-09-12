import { COL } from "@/constants/collections";
import { auth, db } from "@/firebase";
import { extractAuthUser } from "@/lib/utils/extraAuthUser";
import { signInAnonymously } from "@react-native-firebase/auth";
import { doc, setDoc } from "@react-native-firebase/firestore";
import userSelector from "../user.store";

export async function anonSignin() {
    const result = await signInAnonymously(auth);
    const user = result.user;
    const additonal = result.additionalUserInfo;
    const isNewUser = additonal?.isNewUser;

    const userRef = doc(db, COL.USERS, user.uid);
    const authUser = extractAuthUser(user);
    if (isNewUser) {
        console.log("new user detected, creating firestore user document.");
        await setDoc(userRef, authUser);
        userSelector.setState({
            user: authUser,
        });
    }
}
