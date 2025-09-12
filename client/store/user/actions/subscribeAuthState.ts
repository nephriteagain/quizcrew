import { auth } from "@/firebase";
import { onAuthStateChanged } from "@react-native-firebase/auth";
import userSelector from "../user.store";

export function subscribeAuthState() {
    const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(
                `${user.isAnonymous ? "anonymous " : ""}user detected ${user.email ? `email: ${user.email}` : ""}`
            );
        } else {
            console.log("no user detected");
        }
        userSelector.setState({ user });
    });
    return unsub;
}
