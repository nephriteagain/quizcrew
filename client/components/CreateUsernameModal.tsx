import { useEffectLogRoute } from "@/hooks/useEffectLogRoute";
import authSelector from "@/store/user/user.store";
import utilsSelector from "@/store/utils/utils.store";
import AddUsernameDialog from "./AddUsernameDialog";

export default function CreateUsernameModal() {
    const userData = authSelector.use.useUserData();
    const isCreateUsernameModalShown = utilsSelector.use.useIsCreateUsernameModalShown();

    const handleClose = () => {
        utilsSelector.setState({ isCreateUsernameModalShown: false });
    };

    const handleSuccess = (username: string) => {
        console.log("Username created:", username);
        utilsSelector.setState({ isCreateUsernameModalShown: false });
    };

    useEffectLogRoute(() => {
        // make sure there is a user account before showing the modal
        if (userData && !userData.username) {
            utilsSelector.setState({ isCreateUsernameModalShown: true });
        } else {
            utilsSelector.setState({ isCreateUsernameModalShown: false });
        }
    }, [userData]);

    return (
        <AddUsernameDialog
            visible={isCreateUsernameModalShown}
            onClose={handleClose}
            onSuccess={handleSuccess}
        />
    );
}
