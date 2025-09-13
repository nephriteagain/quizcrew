import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { UserData } from "@/types/user";
import { doc, onSnapshot } from "@react-native-firebase/firestore";
import userSelector from "../user.store";

export function subscribeUserData(uid: string) {
    const userDataRef = doc(db, COL.USERS_DATA, uid);
    const unsub = onSnapshot(userDataRef, (snap) => {
        const userData = snap.data() as UserData | undefined;
        if (userData) {
            userSelector.setState({ userData });
        } else {
            console.log("user data not found.");
            userSelector.setState({ userData: null });
        }
    });

    return unsub;
}
