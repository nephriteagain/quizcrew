import { Modal, Text, View } from "react-native";

export default function LoadingModal({
    isVisible,
    loadingText,
}: {
    isVisible: boolean;
    loadingText: string;
}) {
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
                    // StyleSheet.absoluteFill,
                    {
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        justifyContent: "center",
                        alignItems: "center",
                    },
                ]}
            >
                <Text
                    style={{
                        fontWeight: "600",
                        fontSize: 20,
                        textAlign: "center",
                        color: "white",
                        zIndex: 10,
                    }}
                >
                    {loadingText}
                </Text>
            </View>
        </Modal>
    );
}
