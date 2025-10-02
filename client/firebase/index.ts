import { getAnalytics } from "@react-native-firebase/analytics";
import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getCrashlytics } from "@react-native-firebase/crashlytics";
import { getFirestore } from "@react-native-firebase/firestore";
import { getStorage } from "@react-native-firebase/storage";

export const app = getApp();

export const db = getFirestore();

export const auth = getAuth();

export const storage = getStorage();

export const analytics = getAnalytics();

export const crashlytics = getCrashlytics();
