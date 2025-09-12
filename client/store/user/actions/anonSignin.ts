import { auth } from "@/firebase";
import { signInAnonymously } from "@react-native-firebase/auth";
import userSelector from "../user.store";

export async function anonSignin() {
    const result = await signInAnonymously(auth);
    const user = result.user;

    console.log("user anonymously signed in");
    userSelector.setState({
        user,
    });
}
