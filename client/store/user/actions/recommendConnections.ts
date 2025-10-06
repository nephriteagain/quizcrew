import { COL } from "@/constants/collections";
import { db } from "@/firebase";
import { Connection, UserData } from "@/types/user";
import {
    collection,
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from "@react-native-firebase/firestore";
import { cloneDeep, uniqBy } from "lodash";
import authSelector from "../user.store";

export async function recommendConnections() {
    const user = authSelector.getState().user;
    const connections = cloneDeep(authSelector.getState().connections);
    const allConnectionIds = connections.map((c) => c.data.uid);

    // used to decrease likelyhood of fetching already connected users
    const latestConnectionIds = connections
        .map((c) => c)
        .sort((a, b) => {
            const aTime = a.meta?.updatedAt?.toDate?.()?.getTime?.() ?? 0;
            const bTime = b.meta?.updatedAt?.toDate?.()?.getTime?.() ?? 0;
            return bTime - aTime; // descending order (newest first)
        })
        .slice(0, 30)
        .map((c) => c.data.uid);

    // fetch the last 10 connections
    const activeConnectionIds = connections
        .filter((c) => c.meta?.status === "CONNECTED")
        .sort((a, b) => {
            const aTime = a.meta?.updatedAt?.toDate?.()?.getTime?.() ?? 0;
            const bTime = b.meta?.updatedAt?.toDate?.()?.getTime?.() ?? 0;
            return bTime - aTime; // descending order (newest first)
        })
        .slice(0, 10)
        .map((c) => c.data.uid);

    // build the queries for each of the last connections
    const userDataRef = collection(db, COL.USERS_DATA);
    const connectionQueries = activeConnectionIds.map((id) => {
        const userDataDocRef = doc(userDataRef, id);
        const userConnectionRef = collection(userDataDocRef, COL.CONNECTIONS);
        const userConnectionQ = query(
            userConnectionRef,
            where("uid", "not-in", latestConnectionIds),
            orderBy("createdAt"),
            limit(5)
        );
        return userConnectionQ;
    });
    const connectionSnaps = (await Promise.all(
        connectionQueries.map((q) => getDocs(q))
    )) as FirebaseFirestoreTypes.QuerySnapshot[];

    const recommendedConnectionIds = connectionSnaps.map((s) => s.docs.map((d) => d.id));
    const recommendedConnectionIdsFlatten = recommendedConnectionIds.flat();

    // don't include recommend active and pending connections and own user id
    const filteredRecommendedConnectionIds = recommendedConnectionIdsFlatten.filter(
        (id) => allConnectionIds.every((i) => i !== id) && user?.uid !== id
    );
    const userDataRefs = filteredRecommendedConnectionIds.map((id) => doc(db, COL.USERS_DATA, id));
    const userDataSnaps = await Promise.all(userDataRefs.map((ref) => getDoc(ref)));
    const userDataDocs = userDataSnaps.map((u) => u.data()).filter(Boolean) as UserData[];
    const connectionData: Connection[] = userDataDocs.map((u) => ({ data: u, meta: null }));
    // save to store
    authSelector.setState({
        recommendedConnections: uniqBy(connectionData, "uid"),
    });
    return connectionData;
}
