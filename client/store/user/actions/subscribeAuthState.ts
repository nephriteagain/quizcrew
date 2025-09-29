import { COL } from "@/constants/collections";
import { auth, db } from "@/firebase";
import { extractAuthUser } from "@/lib/utils/extraAuthUser";
import { onAuthStateChanged } from "@react-native-firebase/auth";
import { doc, setDoc } from "@react-native-firebase/firestore";
import { isEqual } from "lodash";
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
            const userRef = doc(db, COL.USERS, user.uid);
            const currentUser = authSelector.getState().user;
            const deepEqual = isEqual(currentUser, extracted);
            if (!deepEqual) {
                console.log("user doc changed, updating...");
                setDoc(userRef, extracted);
            }
        } else {
            authSelector.setState({ user: null });
        }
    });
    return unsub;
}
