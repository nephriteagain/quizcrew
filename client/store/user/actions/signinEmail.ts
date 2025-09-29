import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "@react-native-firebase/auth";

export async function signinEmail(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
}
