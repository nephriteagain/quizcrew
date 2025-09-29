import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useEffectLogRoute } from "@/hooks/useEffectLogRoute";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { logout } from "@/store/user/actions/logout";
import { verifyEmail } from "@/store/user/actions/verifyEmail";
import authSelector from "@/store/user/user.store";
import utilsSelector from "@/store/utils/utils.store";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function VerifyEmailModal() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const user = authSelector.use.useUser();
    const verifyEmailModalShown = utilsSelector.use.useIsVerifyEmailModalShown();
    const [verifyEmailFn, { isLoading }] = useAsyncAction(verifyEmail);

    const [cooldownSeconds, setCooldownSeconds] = useState(0);

    const handleClose = () => {
        utilsSelector.setState({ isVerifyEmailModalShown: false });
    };

    const handleResendEmail = async () => {
        setCooldownSeconds(60);
        verifyEmailFn();
    };

    const handleLogout = async () => {
        await logout();
        handleClose();
    };

    useEffect(() => {
        let interval: number;
        if (cooldownSeconds > 0) {
            interval = setInterval(() => {
                setCooldownSeconds((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [cooldownSeconds]);

    useEffectLogRoute(() => {
        // make sure user has  verified email, if he signed in in using email,
        if (user?.uid && user.email && !user.emailVerified) {
            console.log(JSON.stringify(user, null, 2));
            if (!verifyEmailModalShown) {
                handleResendEmail(); // send email verification
                utilsSelector.setState({ isVerifyEmailModalShown: true });
            }
        } else {
            utilsSelector.setState({ isVerifyEmailModalShown: false });
        }
    }, [user?.uid, user?.emailVerified]);

    return (
        <Modal
            visible={verifyEmailModalShown}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <Text variant="titleLarge" style={styles.title}>
                        Verify Your Email
                    </Text>

                    <Text style={styles.message}>
                        We&apos;ve sent a verification link to {user?.email}. Please check your
                        email and click the link to verify your account.
                    </Text>

                    <View style={styles.reloginContainer}>
                        <Button
                            mode="outlined"
                            style={styles.reloginButton}
                            labelStyle={styles.reloginButtonText}
                            onPress={handleLogout}
                        >
                            Confirm Verification
                        </Button>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Text style={styles.baseText}>Didn&apos;t receive link? </Text>
                        <Pressable
                            onPress={handleResendEmail}
                            disabled={cooldownSeconds > 0 || isLoading}
                            style={styles.resendLink}
                        >
                            <Text style={styles.resendLinkText}>
                                {cooldownSeconds > 0 ? `Resend in ${cooldownSeconds}s` : "Resend"}
                            </Text>
                        </Pressable>
                    </View>

                    <Button
                        mode="text"
                        onPress={handleLogout}
                        style={styles.logoutButton}
                        labelStyle={styles.logoutButtonText}
                    >
                        Logout
                    </Button>
                </View>
            </View>
        </Modal>
    );
}

const makeStyles = (theme: AppTheme) => {
    return StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
        },
        dialog: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 24,
            width: "100%",
            maxWidth: 400,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
            rowGap: 10,
        },
        title: {
            textAlign: "center",
            color: theme.colors.onSurface,
        },
        message: {
            textAlign: "center",
            color: theme.colors.onSurface,
            lineHeight: 20,
        },
        buttonContainer: {
            columnGap: 4,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
        },
        baseText: {
            textAlign: "center",
            color: theme.colors.onSurface,
            fontSize: 14,
        },
        resendLink: {},
        resendLinkText: {
            color: theme.colors.primary,
            textDecorationLine: "underline",
            fontSize: 14,
        },
        closeButton: {
            borderRadius: 8,
        },
        logoutButton: {
            alignSelf: "center",
        },
        logoutButtonText: {
            fontSize: 12,
            color: theme.colors.outline,
        },
        reloginContainer: {
            paddingVertical: 8,
        },
        reloginButton: {
            borderRadius: 8,
            borderColor: theme.colors.primary,
        },
        reloginButtonText: {
            fontSize: 12,
            color: theme.colors.primary,
        },
    });
};
