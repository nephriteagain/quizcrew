import { auth } from "@/firebase";
import { signOut } from "@react-native-firebase/auth";
import authSelector from "../user.store";

export async function logout() {
    try {
        await signOut(auth);
        // Clear user data from store
        authSelector.setState({
            user: null,
            userData: null,
            connections: [],
            groups: [],
        });
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}