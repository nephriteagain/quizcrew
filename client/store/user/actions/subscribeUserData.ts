import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { AuthUser, UserData } from "@/types/user";
import { doc, onSnapshot } from "@react-native-firebase/firestore";
import authSelector from "../user.store";

export function subscribeUserData(uid: string) {
    const userDataRef = doc(db, COL.USERS_DATA, uid);
    const unsubUserData = onSnapshot(userDataRef, (snap) => {
        console.log("userData snapshot");
        try {
            const userData = snap.data() as UserData | undefined;
            if (userData) {
                authSelector.setState({ userData });
            } else {
                console.log("user data not found.");
                authSelector.setState({ userData: null });
            }
        } catch (error) {
            console.error(error);
        }
    });
    const userRef = doc(db, COL.USERS, uid);
    const unsubUser = onSnapshot(userRef, (snap) => {
        console.log("user snapshot");
        try {
            const user = snap.data() as AuthUser | undefined;
            if (user) {
                authSelector.setState({ user });
            } else {
                authSelector.setState({ user: null });
            }
        } catch (error) {
            console.error(error);
        }
    });

    return () => {
        unsubUserData();
        unsubUser();
    };
}
