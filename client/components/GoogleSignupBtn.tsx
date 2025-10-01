import { COL } from "@/constants/collections";
import { auth, db } from "@/firebase";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { GoogleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";
import { doc, setDoc } from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Dispatch, SetStateAction } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import Svg, { Path } from "react-native-svg";

function GoogleSignupBtn({
    type = "short",
    variant = "signup",
    isLoading = false,
    setIsLoading,
    disabled = false,
}: {
    type?: "long" | "short";
    variant?: "signup" | "signin";
    isLoading?: boolean;
    setIsLoading?: Dispatch<SetStateAction<boolean>>;
    disabled?: boolean;
}) {
    //   const isLogginIn = termsSelector.use.isLoggingIn?.();
    const theme = useAppTheme();
    const styles = makeStyles(theme);

    const signInWithGoogle = async () => {
        try {
            setIsLoading?.(true);
            const hasPlay = await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
            if (!hasPlay) {
                Alert.alert("Google Play Services API not found.");
                return;
            }
            const signInResult = await GoogleSignin.signIn();
            const idToken = signInResult.data?.idToken;
            if (!idToken) {
                throw new Error("No ID token found");
            }
            const googleCredential = GoogleAuthProvider.credential(idToken);

            const result = await signInWithCredential(auth, googleCredential);
            const isNewUser = result.additionalUserInfo?.isNewUser;
            if (isNewUser) {
                console.log("new user detected, creating firestore user document.");
                const userDataRef = doc(db, COL.USERS_DATA, result.user.uid);
                const userData = { uid: result.user.uid, status: "ACTIVE" } as const;
                await setDoc(userDataRef, userData, { merge: true });
            }

            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading?.(false);
        }
    };

    if (type === "long") {
        return (
            <Button
                contentStyle={styles.buttonContent}
                loading={isLoading}
                disabled={disabled || isLoading}
                mode="contained"
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
                onPress={signInWithGoogle}
                // disabled={isLogginIn}
            >
                <Text style={styles.buttonText}>
                    {variant === "signup" ? "Sign up using Google" : "Log in with Google"}
                </Text>
            </Button>
        );
    }

    return (
        <TouchableOpacity
            style={
                [
                    // loginStyle.altLoginButton,
                    // {
                    //   opacity: isLogginIn ? 0.6 : 1,
                    // },
                ]
            }
            onPress={signInWithGoogle}
            //   disabled={isLogginIn}
        >
            <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <Path
                    d="M32 16.3636C32 15.2291 31.8961 14.1382 31.7032 13.0909H16.3265V19.2873H25.1132C24.7273 21.28 23.5696 22.9673 21.833 24.1018V28.1309H27.1317C30.2189 25.3382 32 21.2364 32 16.3636Z"
                    fill="#4285F4"
                />
                <Path
                    d="M16.3265 32C20.7347 32 24.4304 30.5745 27.1317 28.1309L21.833 24.1018C20.3785 25.0618 18.5232 25.6436 16.3265 25.6436C12.0816 25.6436 8.47495 22.8364 7.18367 19.0545H1.75139V23.1855C4.43785 28.4073 9.94434 32 16.3265 32Z"
                    fill="#34A853"
                />
                <Path
                    d="M7.18367 19.04C6.85714 18.08 6.66419 17.0618 6.66419 16C6.66419 14.9382 6.85714 13.92 7.18367 12.96V8.82909H1.75139C0.638219 10.9818 0 13.4109 0 16C0 18.5891 0.638219 21.0182 1.75139 23.1709L5.98145 19.9418L7.18367 19.04Z"
                    fill="#FBBC05"
                />
                <Path
                    d="M16.3265 6.37091C18.731 6.37091 20.8683 7.18545 22.5751 8.75636L27.2505 4.17455C24.4156 1.58545 20.7347 0 16.3265 0C9.94434 0 4.43785 3.59273 1.75139 8.82909L7.18367 12.96C8.47495 9.17818 12.0816 6.37091 16.3265 6.37091Z"
                    fill="#EA4335"
                />
            </Svg>
        </TouchableOpacity>
    );
}

const makeStyles = (theme: AppTheme) => {
    return StyleSheet.create({
        buttonContent: {
            paddingVertical: 12,
            paddingHorizontal: 24,
        },
        button: {
            flexDirection: "row",
            columnGap: 8,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors?.surface,
            borderRadius: 16,
            borderColor: theme.colors.primary,
            borderWidth: 1,
        },
        buttonText: {
            fontSize: 18,
            fontWeight: "600",
        },
    });
};

export default GoogleSignupBtn;
