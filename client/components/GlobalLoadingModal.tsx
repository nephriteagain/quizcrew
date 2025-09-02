import utilsSelector from "@/store/utils/utils.store";
import { Modal, StyleSheet, Text, View } from "react-native";

export default function GlobalLoadingModal() {
    const isVisible = utilsSelector.use.isLoading();
    const text = utilsSelector.use.loadingText();

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            // onRequestClose={onClose}
            statusBarTranslucent
            style={{ flex: 1 }}
        >
            <View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        justifyContent: "center",
                        alignItems: "center",
                    },
                ]}
            >
                <Text style={{ fontWeight: "600", fontSize: 20, textAlign: "center" }}>{text}</Text>
            </View>
        </Modal>
    );
}
