import authSelector from "@/store/user/user.store";
import utilsSelector from "@/store/utils/utils.store";
import { useEffect } from "react";
import AddUsernameDialog from "./AddUsernameDialog";

export default function CreateUsernameModal() {
    const userData = authSelector.use.useUserData();
    const user = authSelector.use.useUser();
    const isCreateUsernameModalShown = utilsSelector.use.useIsCreateUsernameModalShown();

    const username = userData?.username;

    const handleClose = () => {
        utilsSelector.setState({ isCreateUsernameModalShown: false });
    };

    const handleSuccess = (username: string) => {
        console.log("Username created:", username);
        utilsSelector.setState({ isCreateUsernameModalShown: false });
    };

    useEffect(() => {
        // make sure there is a user account before showing the modal
        if (!username && user?.uid) {
            utilsSelector.setState({ isCreateUsernameModalShown: true });
        } else {
            utilsSelector.setState({ isCreateUsernameModalShown: false });
        }
    }, [username, user?.uid]);

    return (
        <AddUsernameDialog
            visible={isCreateUsernameModalShown}
            onClose={handleClose}
            onSuccess={handleSuccess}
        />
    );
}
