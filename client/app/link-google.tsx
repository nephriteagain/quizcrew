import Container from "@/components/Container";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { linkAnonAccToGoogle } from "@/store/user/actions/linkAnonAccToGoogle";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import Svg, { Path } from "react-native-svg";

export default function LinkGoogle() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const router = useRouter();
    const [linkAnonAccToGoogleFn, { isLoading }] = useAsyncAction(linkAnonAccToGoogle);

    const handleLinkGoogle = async () => {
        const { data, error } = await linkAnonAccToGoogleFn();
        console.log({ data, error });
        if (error) {
            Alert.alert("Link Failed", error.message);
            await GoogleSignin.signOut();
            return;
        }
        if (data) {
            router.back();
            return;
        }
    };

    return (
        <Container style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            style={{ transform: [{ scale: 3 }] }}
                        >
                            <Path
                                d="M24 12.2727C24 11.4218 23.9221 10.6036 23.7774 9.81818H12.2449V14.4655H18.8349C18.5455 15.96 17.6772 17.2255 16.3748 18.0764V21.0982H20.3488C22.6642 19.0036 24 15.9273 24 12.2727Z"
                                fill="#4285F4"
                            />
                            <Path
                                d="M12.2449 24C15.551 24 18.3228 22.9309 20.3488 21.0982L16.3748 18.0764C15.2839 18.7964 13.8924 19.2327 12.2449 19.2327C9.06122 19.2327 6.35622 17.1273 5.38776 14.2909H1.31354V17.3891C3.32839 21.3055 7.45826 24 12.2449 24Z"
                                fill="#34A853"
                            />
                            <Path
                                d="M5.38776 14.28C5.14286 13.56 4.99814 12.7964 4.99814 12C4.99814 11.2036 5.14286 10.44 5.38776 9.72V6.62182H1.31354C0.478664 8.23636 0 10.0582 0 12C0 13.9418 0.478664 15.7636 1.31354 17.3782L4.48609 14.9564L5.38776 14.28Z"
                                fill="#FBBC05"
                            />
                            <Path
                                d="M12.2449 4.77818C14.0482 4.77818 15.6512 5.38909 16.9314 6.56727L20.4378 3.13091C18.3117 1.18909 15.551 0 12.2449 0C7.45826 0 3.32839 2.69455 1.31354 6.62182L5.38776 9.72C6.35622 6.88364 9.06122 4.77818 12.2449 4.77818Z"
                                fill="#EA4335"
                            />
                        </Svg>
                    </View>
                    <Text style={styles.title}>Link Account</Text>
                    <Text style={styles.subtitle}>
                        Link your anonymous account to Google to secure your data and enable
                        cross-device access.
                    </Text>
                </View>

                <View style={styles.formSection}>
                    <Button
                        onPress={handleLinkGoogle}
                        loading={isLoading}
                        disabled={isLoading}
                        contentStyle={styles.buttonContent}
                        mode="elevated"
                        icon={() => (
                            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <Path
                                    d="M24 12.2727C24 11.4218 23.9221 10.6036 23.7774 9.81818H12.2449V14.4655H18.8349C18.5455 15.96 17.6772 17.2255 16.3748 18.0764V21.0982H20.3488C22.6642 19.0036 24 15.9273 24 12.2727Z"
                                    fill="#4285F4"
                                />
                                <Path
                                    d="M12.2449 24C15.551 24 18.3228 22.9309 20.3488 21.0982L16.3748 18.0764C15.2839 18.7964 13.8924 19.2327 12.2449 19.2327C9.06122 19.2327 6.35622 17.1273 5.38776 14.2909H1.31354V17.3891C3.32839 21.3055 7.45826 24 12.2449 24Z"
                                    fill="#34A853"
                                />
                                <Path
                                    d="M5.38776 14.28C5.14286 13.56 4.99814 12.7964 4.99814 12C4.99814 11.2036 5.14286 10.44 5.38776 9.72V6.62182H1.31354C0.478664 8.23636 0 10.0582 0 12C0 13.9418 0.478664 15.7636 1.31354 17.3782L4.48609 14.9564L5.38776 14.28Z"
                                    fill="#FBBC05"
                                />
                                <Path
                                    d="M12.2449 4.77818C14.0482 4.77818 15.6512 5.38909 16.9314 6.56727L20.4378 3.13091C18.3117 1.18909 15.551 0 12.2449 0C7.45826 0 3.32839 2.69455 1.31354 6.62182L5.38776 9.72C6.35622 6.88364 9.06122 4.77818 12.2449 4.77818Z"
                                    fill="#EA4335"
                                />
                            </Svg>
                        )}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Link with Google</Text>
                    </Button>
                </View>
            </ScrollView>
        </Container>
    );
}

const makeStyles = (theme: AppTheme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingVertical: 32,
        },
        header: {
            alignItems: "center",
            paddingBottom: 48,
        },
        logoContainer: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: theme.colors.primaryContainer,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 6,
        },
        title: {
            fontSize: 32,
            fontWeight: "bold",
            color: theme.colors.onSurface,
            marginBottom: 12,
            textAlign: "center",
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
            lineHeight: 24,
            paddingHorizontal: 16,
        },
        formSection: {
            gap: 16,
        },
        signUpButton: {
            borderRadius: 16,
            marginTop: 24,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
        },
        signUpButtonContent: {
            paddingVertical: 12,
            paddingHorizontal: 24,
        },
        signUpButtonLabel: {
            fontSize: 18,
            fontWeight: "600",
        },
        buttonContent: {
            paddingVertical: 12,
            paddingHorizontal: 24,
        },
        button: {
            flexDirection: "row",
            columnGap: 8,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors?.primaryContainer,
            borderRadius: 16,
            borderColor: theme.colors.primary,
            borderWidth: 1,
            //   opacity: isLogginIn ? 0.6 : 1,
        },
        buttonText: {
            fontSize: 18,
            fontWeight: "600",
            color: theme.colors.primary,
        },
    });
};
