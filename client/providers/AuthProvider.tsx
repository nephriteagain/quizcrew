import { subscribeUserQuizzes } from "@/store/review/actions/subscribeUserQuizzes";
import { anonSignin } from "@/store/user/actions/anonSignin";
import { subscribeAuthState } from "@/store/user/actions/subscribeAuthState";
import userSelector from "@/store/user/user.store";
import utilsSelector from "@/store/utils/utils.store";
import { ReactNode, useEffect } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const user = userSelector.use.user();

    useEffect(() => {
        if (!user?.uid) {
            utilsSelector.setState({ isLoading: true, loadingText: "Configuring..." });
            anonSignin();
        } else {
            utilsSelector.setState({ isLoading: false, loadingText: null });
            // fetch quizzes
            const unsub = subscribeUserQuizzes(user.uid);
            return () => {
                unsub();
            };
        }
    }, [user?.uid]);

    useEffect(() => {
        const unsub = subscribeAuthState();
        return () => {
            unsub();
        };
    }, []);

    return <>{children}</>;
}
