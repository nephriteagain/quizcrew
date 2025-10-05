import { analytics, auth } from "@/firebase";
import reviewSelector from "@/store/review/review.store";
import utilsSelector from "@/store/utils/utils.store";
import { logEvent } from "@react-native-firebase/analytics";
import { signOut } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import authSelector from "../user.store";

export async function logout() {
    try {
        const user = auth.currentUser;
        const loginMethod = user?.providerData[0]?.providerId;
        await signOut(auth);
        await GoogleSignin.signOut();
        // Clear user data from store
        authSelector.setState({
            user: null,
            userData: null,
            connections: [],
            groups: [],
        });
        reviewSelector.setState({
            quizzes: [],
            userQuizzes: [],
        });
        utilsSelector.setState({
            isLoading: false,
            loadingText: null,
            isCreateUsernameModalShown: false,
            isVerifyEmailModalShown: false,
        });
        logEvent(analytics, "logout", { method: loginMethod });
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}
