import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { ConnectionMeta, UserData } from "@/types/user";
import { doc, getDoc, onSnapshot } from "@react-native-firebase/firestore";

export async function subscribeOtherConnection({
    uid,
    selfUid,
    onChange,
}: {
    uid: string;
    selfUid?: string;
    onChange: (result: { data: UserData | null; meta: ConnectionMeta | null }) => void;
}) {
    console.log("subscribeOtherConnection");
    console.log({ uid, selfUid, onChange });
    if (!selfUid) {
        console.log("no self uid");
        const data = await getUserData(uid);
        onChange({
            data: data ?? null,
            meta: null,
        });
        return null;
    }

    const userConnectionRef = doc(db, COL.USERS_DATA, selfUid, COL.CONNECTIONS, uid);
    const userConnectionUnsub = onSnapshot(userConnectionRef, (snap) => {
        try {
            if (!snap) {
                console.log("invalid snap");
            }
            console.log(userConnectionRef.path);
            console.log(snap);
            const meta = snap.data() as ConnectionMeta | undefined;
            getUserData(uid).then((data) => {
                console.log(data);
                onChange({
                    data: data ?? null,
                    meta: meta ?? null,
                });
            });
        } catch (error) {
            console.error(error);
        }
    });
    return userConnectionUnsub;
}

async function getUserData(uid: string) {
    const userDataRef = doc(db, COL.USERS_DATA, uid);
    const snap = await getDoc(userDataRef);
    const data = snap.data() as UserData | undefined;
    return data;
}
