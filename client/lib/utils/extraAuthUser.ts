import { AuthUser } from "@/types/user";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export function extractAuthUser(user: FirebaseAuthTypes.User): AuthUser {
    const extracted: AuthUser = {
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        metadata: user.metadata,
        multiFactor: user.multiFactor,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        providerData: user.providerData,
        providerId: user.providerId,
        uid: user.uid,
    };
    return extracted;
}
