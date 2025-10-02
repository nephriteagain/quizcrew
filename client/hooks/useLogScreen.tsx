import { analytics } from "@/firebase";
import { logEvent } from "@react-native-firebase/analytics";
import { useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect } from "react";

export function useLogScreen() {
    const pathname = usePathname();
    const params = useGlobalSearchParams();

    useEffect(() => {
        console.log({ pathname, params });
        logEvent(analytics, "screen_view", {
            firebase_screen: pathname,
            firebase_screen_class: JSON.stringify(params, null, 2),
        });
    }, [pathname, params]);

    return null;
}
