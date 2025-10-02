import { analytics, auth } from "@/firebase";
import { logEvent } from "@react-native-firebase/analytics";
import { signInWithEmailAndPassword } from "@react-native-firebase/auth";

export async function signinEmail(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
    logEvent(analytics, "login", { method: "email" });
    return true;
}
