import { useEffectLogRoute } from "@/hooks/useEffectLogRoute";
import { subscribeUserQuizzes } from "@/store/review/actions/subscribeUserQuizzes";
import { subscribeAuthState } from "@/store/user/actions/subscribeAuthState";
import { subscribeConnections } from "@/store/user/actions/subscribeConnection";
import { subscribeGroups } from "@/store/user/actions/subscribeGroups";
import { subscribeUserData } from "@/store/user/actions/subscribeUserData";
import authSelector from "@/store/user/user.store";
import utilsSelector from "@/store/utils/utils.store";
import { ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const user = authSelector.use.useUser();

    useEffectLogRoute(() => {
        let unsub: () => void | undefined;
        if (!user?.uid) {
        } else {
            utilsSelector.setState({ isLoading: false, loadingText: null });
            // fetch quizzes
            const quizzesUnsub = subscribeUserQuizzes(user.uid);
            const userDataUnsub = subscribeUserData(user.uid);
            const connectionUnsub = subscribeConnections(user.uid);
            const groupUnsub = subscribeGroups(user.uid);

            unsub = () => {
                quizzesUnsub();
                userDataUnsub();
                connectionUnsub();
                groupUnsub();
            };
        }
        return () => {
            unsub?.();
        };
    }, [user?.uid]);

    useEffectLogRoute(() => {
        const unsub = subscribeAuthState();
        return () => {
            unsub();
        };
    }, []);

    return <>{children}</>;
}
