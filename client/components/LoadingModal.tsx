import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { Modal, StyleSheet, Text, View } from "react-native";

export default function LoadingModal({
    isVisible,
    loadingText,
}: {
    isVisible: boolean;
    loadingText: string;
}) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            statusBarTranslucent
            style={{ flex: 1 }}
        >
            <View style={styles.backdrop}>
                <Text style={styles.loadingText}>
                    {loadingText}
                </Text>
            </View>
        </Modal>
    );
}

const makeStyles = (theme: AppTheme) => {
    return StyleSheet.create({
        backdrop: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
        },
        loadingText: {
            fontWeight: "600",
            fontSize: 20,
            textAlign: "center",
            color: theme.colors.onPrimary,
            zIndex: 10,
        },
    });
};
