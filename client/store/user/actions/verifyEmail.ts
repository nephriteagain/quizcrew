import { analytics, auth } from "@/firebase";
import { logEvent } from "@react-native-firebase/analytics";
import { sendEmailVerification } from "@react-native-firebase/auth";

export async function verifyEmail() {
    if (!auth.currentUser) {
        console.error("no currentUser");
        return;
    }
    await sendEmailVerification(auth.currentUser);
    logEvent(analytics, "send_verification_email", {});
    return true;
}
