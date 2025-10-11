import { db } from "@/config/firebase";
import { FirebaseError } from "firebase/app";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface UserInfo {
  userAgent: string | null;
  platform: string | null;
  language: string | null;
  screenResolution: string | null;
}

export async function requestAcctDeletion(email: string, userInfo: UserInfo) {
  try {
    const acctDeletionRequestRef = collection(db, "_account_deletion_requests");

    await addDoc(acctDeletionRequestRef, {
      email: email.toLowerCase(),
      userInfo,
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    if (error instanceof FirebaseError) {
      return error;
    }
    if (error instanceof Error) {
      return error;
    }
    return new Error("Unknown error");
  }
}
