import utilsSelector from "../utils.store";

export function showLoadingModal(text: string, isLoading: string) {
    utilsSelector.setState({
        isLoading: true,
        loadingText: text,
    });
}

export function hideLoadingModal(isLoading: boolean) {
    utilsSelector.setState({
        isLoading,
        loadingText: null,
    });
}
