import { COL } from "@/constants/collections";
import { auth, db } from "@/firebase";
import { extractAuthUser } from "@/lib/utils/extraAuthUser";
import { GoogleAuthProvider, linkWithCredential } from "@react-native-firebase/auth";
import { doc, setDoc } from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import authSelector from "../user.store";

export async function linkAnonAccToGoogle() {
    const user = auth.currentUser;
    if (!user) {
        console.error("user not logged in");
        return;
    }
    const hasPlay = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
    });
    if (!hasPlay) {
        Alert.alert("Google Play Services API not found.");
        return;
    }
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken;
    if (!idToken) {
        throw new Error("No ID token found");
    }
    const googleCredential = GoogleAuthProvider.credential(idToken);
    const result = await linkWithCredential(user, googleCredential);
    console.log(`anonymous account link to google ${result.user}, updating firebase document...`);
    const userRef = doc(db, COL.USERS, user.uid);
    const extracted = extractAuthUser(result.user);
    await setDoc(userRef, extracted, { merge: true });
    authSelector.setState({ user: extracted });
    return result;
}
