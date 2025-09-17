import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { Connection, ConnectionMeta, UserData } from "@/types/user";
import { collection, doc, getDoc, query, where } from "@react-native-firebase/firestore";
import authSelector from "../user.store";

export function subscribeConnections(uid: string) {
    const connectionsRef = collection(db, COL.USERS_DATA, uid, COL.CONNECTIONS);
    const connectionsQ = query(
        connectionsRef,
        where("status", "in", ["CONNECTED", "INVITED", "REQUESTED"])
    );

    const unsub = connectionsQ.onSnapshot((snap) => {
        if (!snap) return;
        const connectionMeta = snap.docs.map((d) => d.data()) as ConnectionMeta[];
        handleConnections(connectionMeta);
    });

    return unsub;
}

async function handleConnections(connectionMeta: ConnectionMeta[]) {
    const result = await Promise.all(connectionMeta.map(getUserData));
    authSelector.setState({
        connections: result,
    });
}

async function getUserData(connectionMeta: ConnectionMeta): Promise<Connection> {
    const userDataRef = doc(db, COL.USERS_DATA, connectionMeta.uid);
    const userSnap = await getDoc(userDataRef);
    const userData = userSnap.data() as UserData;

    return {
        data: userData,
        meta: connectionMeta,
    };
}
