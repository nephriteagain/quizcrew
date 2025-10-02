import { COL } from "@/constants/collections";
import { analytics, db } from "@/firebase";
import { UserData } from "@/types/user";
import { logEvent } from "@react-native-firebase/analytics";
import {
    collection,
    doc,
    getCountFromServer,
    getDoc,
    query,
    setDoc,
    updateDoc,
    where,
} from "@react-native-firebase/firestore";

export enum ADD_USERNAME_RESULT {
    SUCESS = "success",
    // errors
    NO_USERNAME = "no_username",
    ALREADY_USED = "already_used",
    UNEXPECTED = "unexpected",
}

export async function addUsername(uid: string, username: string): Promise<ADD_USERNAME_RESULT> {
    try {
        if (!username) {
            return ADD_USERNAME_RESULT.NO_USERNAME;
        }
        // check uniqueness
        const dataRef = collection(db, COL.USERS_DATA);
        const dataQ = query(dataRef, where("username", "==", username));
        const dataSnap = await getCountFromServer(dataQ);
        const count = dataSnap.data().count;
        if (count > 0) {
            logEvent(analytics, "username_unavailable", { username_length: username.length });
            return ADD_USERNAME_RESULT.ALREADY_USED;
        }

        const userDataRef = doc(db, COL.USERS_DATA, uid);
        const userSnap = await getDoc(userDataRef);
        const userData = userSnap.data() as UserData | undefined;
        if (!userData) {
            await setDoc(userDataRef, { username, uid }, { merge: true });
            logEvent(analytics, "create_username", { username_length: username.length, result: "success" });
            return ADD_USERNAME_RESULT.SUCESS;
        }
        await updateDoc(userDataRef, { username });
        console.log("username added");
        logEvent(analytics, "create_username", { username_length: username.length, result: "success" });
        return ADD_USERNAME_RESULT.SUCESS;
    } catch (error) {
        console.error(error);
        return ADD_USERNAME_RESULT.UNEXPECTED;
    }
}
