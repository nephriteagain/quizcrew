import { auth } from "@/firebase";
import { sendEmailVerification } from "@react-native-firebase/auth";

export async function verifyEmail() {
    if (!auth.currentUser) {
        console.error("no currentUser");
        return;
    }
    await sendEmailVerification(auth.currentUser);
    return true;
}
