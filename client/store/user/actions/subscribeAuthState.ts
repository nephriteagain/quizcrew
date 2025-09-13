import { auth } from "@/firebase";
import { extractAuthUser } from "@/lib/utils/extraAuthUser";
import { onAuthStateChanged } from "@react-native-firebase/auth";
import authSelector from "../user.store";

export function subscribeAuthState() {
    const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(
                `${user.isAnonymous ? "anonymous " : ""}user detected ${user.email ? `email: ${user.email}` : ""}`
            );
        } else {
            console.log("no user detected");
        }
        if (user) {
            const extracted = extractAuthUser(user);
            authSelector.setState({ user: extracted });
        } else {
            authSelector.setState({ user: null });
        }
    });
    return unsub;
}
