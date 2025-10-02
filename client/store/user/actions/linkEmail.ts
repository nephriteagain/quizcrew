import { analytics, auth } from "@/firebase";
import { logEvent } from "@react-native-firebase/analytics";
import { EmailAuthProvider, linkWithCredential } from "@react-native-firebase/auth";

export async function linkEmail(email: string, password: string) {
    const user = auth.currentUser;
    if (!user) return;
    const previousMethod = user.isAnonymous ? "anonymous" : user.providerData[0]?.providerId;
    const credential = new EmailAuthProvider(email, password);
    await linkWithCredential(user, credential);
    console.log(`email ${email} linked to account`);
    logEvent(analytics, "link_account", { method: "email", previous_method: previousMethod });
    return true;
}
