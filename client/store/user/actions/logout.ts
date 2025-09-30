import { auth } from "@/firebase";
import { signOut } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import authSelector from "../user.store";

export async function logout() {
    try {
        await signOut(auth);
        await GoogleSignin.signOut();
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
