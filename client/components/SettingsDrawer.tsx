import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { forwardRef, ReactNode, useImperativeHandle, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Drawer } from "react-native-drawer-layout";

interface SettingsDrawerProps {
    children: ReactNode;
    renderDrawerContent: ReactNode;
    onSheetChanges?: (isOpen: boolean) => void;
}

export interface SettingsDrawerRef {
    open: () => void;
    close: () => void;
}

const SettingsDrawer = forwardRef<SettingsDrawerRef, SettingsDrawerProps>(
    ({ children, renderDrawerContent, onSheetChanges }, ref) => {
        const theme = useAppTheme();
        const styles = makeStyles(theme);
        const [isOpen, setIsOpen] = useState(false);

        const open = () => {
            setIsOpen(true);
            onSheetChanges?.(true);
        };

        const close = () => {
            setIsOpen(false);
            onSheetChanges?.(false);
        };

        useImperativeHandle(ref, () => ({
            open,
            close,
        }));

        return (
            <Drawer
                open={isOpen}
                onOpen={open}
                onClose={close}
                drawerPosition="right"
                drawerStyle={styles.drawer}
                overlayStyle={styles.overlay}
                drawerType="slide"
                renderDrawerContent={() => (
                    <View style={styles.drawerContent}>{renderDrawerContent}</View>
                )}
            >
                {children}
            </Drawer>
        );
    }
);

SettingsDrawer.displayName = "SettingsDrawer";

export default SettingsDrawer;

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        drawer: {
            backgroundColor: theme.colors.surface,
            width: 300,
        },
        drawerContent: {
            flex: 1,
            padding: 16,
        },
    });
