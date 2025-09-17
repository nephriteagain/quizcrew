import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { UserData } from "@/types/user";
import { collection, endAt, orderBy, query, startAt } from "@react-native-firebase/firestore";

export async function searchNewConnection(keyword: string) {
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
    console.log(JSON.stringify(data, null, 2));
    return data;
}
