import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import utilsSelector from "@/store/utils/utils.store";
import { Modal, StyleSheet, View } from "react-native";
import { Portal, Text } from "react-native-paper";

export default function GlobalLoadingModal() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const isVisible = utilsSelector.use.useIsLoading();
    const text = utilsSelector.use.useLoadingText();

    return (
        <Portal>
            <Modal
                visible={isVisible}
                transparent
                animationType="fade"
                // onRequestClose={onClose}
                statusBarTranslucent
                style={{ flex: 1 }}
            >
                <View style={[styles.overlay, StyleSheet.absoluteFill]}>
                    <Text style={styles.text}>{text}</Text>
                </View>
            </Modal>
        </Portal>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: `${theme.colors.onSurface}80`,
            justifyContent: "center",
            alignItems: "center",
        },
        text: {
            fontWeight: "600",
            fontSize: 20,
            textAlign: "center",
            color: theme.colors.onPrimary,
        },
    });
