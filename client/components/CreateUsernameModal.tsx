import userSelector from "@/store/user/user.store";
import utilsSelector from "@/store/utils/utils.store";
import { useEffect } from "react";
import UsernameDialog from "./UsernameDialog";

export default function CreateUsernameModal() {
    const userData = userSelector.use.userData();
    const user = userSelector.use.user();

    const username = userData?.username;
    const isCreateUsernameModalShown = utilsSelector.use.isCreateUsernameModalShown();

    useEffect(() => {
        // make sure there is a user account before showing the modal
        if (!username && user?.uid) {
            utilsSelector.setState({ isCreateUsernameModalShown: true });
        } else {
            utilsSelector.setState({ isCreateUsernameModalShown: false });
        }
    }, [username, user?.uid]);

    const handleClose = () => {
        utilsSelector.setState({ isCreateUsernameModalShown: false });
    };

    const handleSuccess = (username: string) => {
        console.log("Username created:", username);
        utilsSelector.setState({ isCreateUsernameModalShown: false });
    };

    return (
        <UsernameDialog
            visible={isCreateUsernameModalShown}
            onClose={handleClose}
            onSuccess={handleSuccess}
        />
    );
}
