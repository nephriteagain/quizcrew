import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { UserData } from "@/types/user";
import {
    collection,
    doc,
    getCountFromServer,
    getDoc,
    query,
    setDoc,
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
            return ADD_USERNAME_RESULT.ALREADY_USED;
        }

        const userDataRef = doc(db, COL.USERS_DATA, uid);
        const userSnap = await getDoc(userDataRef);
        const userData = userSnap.data() as UserData | undefined;
        if (!userData) {
            await setDoc(userDataRef, { username, uid }, { merge: true });
            return ADD_USERNAME_RESULT.SUCESS;
        }
        await setDoc(userDataRef, { username });
        console.log("username added");
        return ADD_USERNAME_RESULT.SUCESS;
    } catch (error) {
        console.error(error);
        return ADD_USERNAME_RESULT.UNEXPECTED;
    }
}
