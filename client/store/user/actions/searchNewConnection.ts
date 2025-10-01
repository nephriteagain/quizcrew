import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { UserData } from "@/types/user";
import { collection, endAt, orderBy, query, startAt } from "@react-native-firebase/firestore";
import authSelector from "../user.store";

export async function searchNewConnection(keyword: string) {
    const selfUid = authSelector.getState().user?.uid;
    console.log({ selfUid });
    const userDataRef = collection(db, COL.USERS_DATA);
    const userDataQ = query(
        userDataRef,
        orderBy("username"),
        startAt(keyword),
        endAt(`${keyword}\uf8ff`)
    );
    console.log("searching...");
    const snap = await userDataQ.get();
    const data = snap.docs.map((d) => d.data()) as UserData[];
    const filtered = data.filter((d) => d.uid !== selfUid);
    // filter yourself
    console.log(JSON.stringify(filtered, null, 2));
    return filtered;
}
