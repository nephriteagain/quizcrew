import AsyncStorage from "@react-native-async-storage/async-storage";
import { Timestamp } from "@react-native-firebase/firestore";
import { StorageValue } from "zustand/middleware";

export function createZustandAsyncStorage() {
    return {
        getItem: async <T>(name: string): Promise<StorageValue<T> | null> => {
            try {
                const raw = await AsyncStorage.getItem(name);
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                const deserialized = deserializeFirestoreData(parsed);
                console.log("-----------PERSISTED DATA----------");
                console.log(JSON.stringify(deserialized, null, 2));
                console.log("-----------------------------------");

                return deserialized;
            } catch {
                return null;
            }
        },
        setItem: async <T>(name: string, value: StorageValue<T>): Promise<void> => {
            try {
                const converted = serializeFirestoreData(value);
                await AsyncStorage.setItem(name, JSON.stringify(converted));
            } catch (error) {
                console.error(error);
                console.error("failed to serialize firestore document to local storage");
                // Handle storage errors silently
            }
        },
        removeItem: async (name: string): Promise<void> => {
            try {
                await AsyncStorage.removeItem(name);
            } catch {
                // Handle storage errors silently
            }
        },
    };
}

// 🔁 Recursively serializes firestore data
// converts Timestamp to JSON {seconds:string;nanoseconds:string}
// converts Date to ISO string
function serializeFirestoreData(obj: any): any {
    if (obj instanceof Timestamp) {
        return { seconds: obj.seconds, nanoseconds: obj.nanoseconds };
    }
    if (obj instanceof Date) {
        return obj.toISOString();
    }
    if (Array.isArray(obj)) {
        return obj.map(serializeFirestoreData);
    }
    if (obj && typeof obj === "object") {
        const result: any = {};
        for (const key in obj) {
            result[key] = serializeFirestoreData(obj[key]);
        }
        return result;
    }
    return obj;
}

// 🔁 Recursively deserialize firestore data
// converts JSON timestamp to Timestamp
// converts ISO string date to Date
function deserializeFirestoreData(obj: any): any {
    if (
        obj &&
        typeof obj === "object" &&
        typeof obj.seconds === "number" &&
        typeof obj.nanoseconds === "number"
    ) {
        return new Timestamp(obj.seconds, obj.nanoseconds);
    }

    if (typeof obj === "string" && /^\d{4}-\d{2}-\d{2}T/.test(obj)) {
        return new Date(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(deserializeFirestoreData);
    }

    if (obj && typeof obj === "object") {
        const result: any = {};
        for (const key in obj) {
            result[key] = deserializeFirestoreData(obj[key]);
        }
        return result;
    }

    return obj;
}
