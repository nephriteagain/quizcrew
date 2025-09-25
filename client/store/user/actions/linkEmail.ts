import { auth } from "@/firebase";
import { EmailAuthProvider, linkWithCredential } from "@react-native-firebase/auth";

export async function linkEmail(email: string, password: string) {
    const user = auth.currentUser;
    if (!user) return;
    const credential = new EmailAuthProvider(email, password);
    await linkWithCredential(user, credential);
    console.log(`email ${email} linked to account`);
    return true;
}
