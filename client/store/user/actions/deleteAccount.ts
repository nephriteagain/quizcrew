import { COL } from "@/constants/collections";
import { analytics, auth, db } from "@/firebase";
import { logEvent } from "@react-native-firebase/analytics";
import { deleteUser } from "@react-native-firebase/auth";
import { doc, writeBatch } from "@react-native-firebase/firestore";
import authSelector from "../user.store";

export async function deleteAccount() {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No user is currently signed in");
        }

        // Mark user as deleted in Firestore
        const batch = writeBatch(db);
        const userDataRef = doc(db, COL.USERS_DATA, user.uid);
        const userRef = doc(db, COL.USERS, user.uid);
        batch.update(userDataRef, {
            status: "DELETED",
        });
        batch.update(userRef, {
            status: "DELETED",
        });

        // Delete the Firebase Auth user
        await deleteUser(user);
        await batch.commit();

        // Clear user data from store
        authSelector.setState({
            user: null,
            userData: null,
            connections: [],
            groups: [],
        });

        logEvent(analytics, "delete_account", {});
    } catch (error) {
        console.error("Error deleting account:", error);
        throw error;
    }
}
