import { analytics } from "@/firebase";
import { logEvent } from "@react-native-firebase/analytics";
import { UnknownOutputParams, useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect } from "react";

export function useLogScreen() {
    const pathname = usePathname();
    const params = useGlobalSearchParams();

    useEffect(() => {
        console.log(generateSearchParams(pathname, params));
        logEvent(analytics, "screen_view", {
            firebase_screen: pathname,
            firebase_screen_class: JSON.stringify(params, null, 2),
        });
    }, [pathname, params]);

    return null;
}

function generateSearchParams(pathname: string, params: UnknownOutputParams) {
    let result = "";
    const keys = Object.keys(params);
    if (keys.length > 0) {
        result += "?";
    }
    keys.forEach((key, i) => {
        if (i !== 0) {
            result += "&";
        }
        result += key;
        result += "=";
        result += params[key];
    });
    return `${pathname}${result}`;
}
