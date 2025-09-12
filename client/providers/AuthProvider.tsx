import { subscribeAuthState } from "@/store/user/actions/subscribeAuthState";
import { ReactNode, useEffect } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        const unsub = subscribeAuthState();
        return () => {
            unsub();
        };
    }, []);

    return <>{children}</>;
}
