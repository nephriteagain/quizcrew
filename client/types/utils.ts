import { FieldValue, Timestamp } from "@react-native-firebase/firestore";

// Utility type to recursively convert Timestamp to FieldValue
export type ToFieldValue<T> = T extends Timestamp
    ? FieldValue
    : T extends object
      ? { [K in keyof T]: ToFieldValue<T[K]> }
      : T;
