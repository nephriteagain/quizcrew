import { COL } from "@/constants/collections";
import { analytics, auth, db, storage } from "@/firebase";
import { uploadImageResumable } from "@/lib/utils/uploadImageResumable";
import { logEvent } from "@react-native-firebase/analytics";
import { doc, updateDoc } from "@react-native-firebase/firestore";
import { ref } from "@react-native-firebase/storage";

export async function addGroupProfilePic(imageUri: string) {
    const uid = auth.currentUser?.uid;
    if (!uid) {
        return;
    }
    const path = `users/${uid}/groups/profile-${Date.now()}.png`;
    const storageRef = ref(storage, path);
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const url = await uploadImageResumable(storageRef, blob);

    const userDataRef = doc(db, COL.USERS_DATA, uid);
    await updateDoc(userDataRef, {
        photoURL: url,
    });
    logEvent(analytics, "update_profile_picture", { url });
    return url;
}
