import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageValue } from "zustand/middleware";

export function createZustandAsyncStorage() {
    return {
        getItem: async <T>(name: string): Promise<StorageValue<T> | null> => {
            try {
                const item = await AsyncStorage.getItem(name);
                return item ? JSON.parse(item) : null;
            } catch {
                return null;
            }
        },
        setItem: async <T>(name: string, value: StorageValue<T>): Promise<void> => {
            try {
                await AsyncStorage.setItem(name, JSON.stringify(value));
            } catch {
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
