import Container from "@/components/Container";
import QuizList from "@/components/QuizList";
import { DEFAULT_USER } from "@/constants/values";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useAsyncStateEffect } from "@/hooks/useAsyncStateEffect";
import { useEffectLogRoute } from "@/hooks/useEffectLogRoute";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { subscribeOtherUserQuizzes } from "@/store/review/actions/subsribeOtherUserQuizzes";
import { approveConnection } from "@/store/user/actions/approveConnection";
import { getTotalConnections } from "@/store/user/actions/getTotalConnections";
import { getTotalGroups } from "@/store/user/actions/getTotalGroups";
import { rejectConnection } from "@/store/user/actions/rejectConnection";
import { requestConnection } from "@/store/user/actions/requestConnection";
import { subscribeOtherConnection } from "@/store/user/actions/subscribeOtherUserConnection";
import authSelector from "@/store/user/user.store";
import { Quiz, QUIZ_TYPE, QuizDoc } from "@/types/review";
import { ConnectionMeta, UserData } from "@/types/user";
import { Unsubscribe } from "@react-native-firebase/firestore";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { Toast } from "toastify-react-native";

export default function Profile() {
    const { uid } = useLocalSearchParams<{ uid: string }>();

    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [quizzes, setQuizzes] = useState<QuizDoc[]>([]);
    const [profile, setProfile] = useState<{ data: UserData | null; meta: ConnectionMeta | null }>({
        data: null,
        meta: null,
    });

    const user = authSelector.use.useUser();

    const router = useRouter();
    const [requestConnectionFn, { isLoading: connectLoading }] = useAsyncAction(requestConnection);
    const [rejectConnectionFn, { isLoading: cancelLoading }] = useAsyncAction(rejectConnection);
    const [approveConnectionFn, { isLoading: approveLoading }] = useAsyncAction(approveConnection);
    const [totalConnections] = useAsyncStateEffect(async () => getTotalConnections(uid), [uid], {
        initialValue: 0,
    });
    const [totalGroups] = useAsyncStateEffect(async () => getTotalGroups(uid), [uid], {
        initialValue: 0,
    });

    const handleConnect = async (uid: string) => {
        console.log({ uid });
        const { error } = await requestConnectionFn(uid);
        if (error) {
            Toast.error(error?.message);
        } else {
            Toast.success("Connection requested");
        }
    };

    const handleCancel = async (uid: string) => {
        const { error } = await rejectConnectionFn(uid);
        if (error) {
            Toast.error(error?.message);
        } else {
            Toast.success("Connection request cancelled");
        }
    };
    const handleAccept = async (uid: string) => {
        const { error } = await approveConnectionFn(uid);
        if (error) {
            Toast.error(error?.message);
        } else {
            Toast.success("Connection request accepted");
        }
    };

    const handleReject = async (uid: string) => {
        const { error } = await rejectConnectionFn(uid);
        if (error) {
            Toast.error(error?.message);
        } else {
            Toast.success("Connection request rejected");
        }
    };

    const handlePress = (quiz: Quiz) => {
        if (quiz.type === QUIZ_TYPE.MCQ) {
            router.push({
                pathname: "../mcq",
                params: {
                    quiz_id: quiz.quiz_id,
                    quiz: JSON.stringify(quiz),
                },
            });
        } else if (quiz.type === QUIZ_TYPE.TOFQ) {
            router.push({
                pathname: "../tofq",
                params: {
                    quiz_id: quiz.quiz_id,
                    quiz: JSON.stringify(quiz),
                },
            });
        } else if (quiz.type === QUIZ_TYPE.DNDQ) {
            router.push({
                pathname: "/dndq",
                params: {
                    quiz_id: quiz.quiz_id,
                    quiz: JSON.stringify(quiz),
                },
            });
        }
    };

    useEffectLogRoute(() => {
        let unsub: Unsubscribe | null;
        subscribeOtherConnection({
            uid,
            selfUid: user?.uid,
            onChange: (result) => {
                setProfile(result);
            },
        }).then((u) => (unsub = u));

        return () => {
            unsub?.();
        };
    }, [user?.uid, uid]);

    useEffectLogRoute(() => {
        const unsub = subscribeOtherUserQuizzes(uid, (quizzes) => {
            setQuizzes(quizzes);
        });
        return () => {
            unsub();
        };
    }, [uid]);

    const showConnectBtn = user && !profile.meta && user.uid !== profile.data?.uid;
    const showAcceptAndRejectBtn = user && profile.meta?.status === "INVITED";
    const showCancelBtn = user && profile.meta?.status === "REQUESTED";

    return (
        <Container style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Avatar.Image
                        source={{
                            uri: profile.data?.photoURL ?? DEFAULT_USER,
                        }}
                        size={80}
                    />
                </View>
                <View>
                    <Text
                        style={[
                            styles.displayName,
                            {
                                color:
                                    profile.data?.status === "DELETED"
                                        ? "red"
                                        : theme.colors?.onBackground,
                            },
                        ]}
                    >
                        {profile?.data?.username}
                        {profile.data?.status === "DELETED" && " (DELETED)"}
                    </Text>
                    {showConnectBtn && (
                        <TouchableOpacity
                            style={styles.connectButton}
                            disabled={connectLoading}
                            onPress={() => {
                                handleConnect(uid);
                            }}
                        >
                            <Text style={styles.connectButtonText}>Connect</Text>
                        </TouchableOpacity>
                    )}
                    {showAcceptAndRejectBtn && (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.acceptButton}
                                disabled={approveLoading || cancelLoading}
                                onPress={() => {
                                    handleAccept(uid);
                                }}
                            >
                                <Text style={styles.acceptButtonText}>Accept</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.rejectButton}
                                disabled={approveLoading || cancelLoading}
                                onPress={() => {
                                    handleReject(uid);
                                }}
                            >
                                <Text style={styles.rejectButtonText}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {showCancelBtn && (
                        <TouchableOpacity
                            style={styles.cancelButton}
                            disabled={cancelLoading}
                            onPress={() => {
                                handleCancel(uid);
                            }}
                        >
                            <Text style={styles.connectButtonText}>Cancel Request</Text>
                        </TouchableOpacity>
                    )}
                    <View style={styles.statsContainer}>
                        <Link href={"/connections"}>
                            <Text style={{ color: theme.colors.onSurfaceVariant }}>
                                <Text style={{ fontWeight: "600", color: theme.colors.onSurface }}>
                                    {totalConnections}{" "}
                                </Text>
                                connections
                            </Text>
                        </Link>
                        <Link href={"/under-construction"}>
                            <Text style={{ color: theme.colors.onSurfaceVariant }}>
                                <Text style={{ fontWeight: "600", color: theme.colors.onSurface }}>
                                    {totalGroups}{" "}
                                </Text>
                                groups
                            </Text>
                        </Link>
                    </View>
                </View>
            </View>

            <View style={styles.quizzesSection}>
                <QuizList
                    onQuizPress={handlePress}
                    quizzes={quizzes}
                    ListHeaderComponent={
                        <Text style={styles.sectionTitle}>Quizzes ({quizzes.length})</Text>
                    }
                />
            </View>
        </Container>
    );
}

const makeStyles = (theme: AppTheme) => {
    return StyleSheet.create({
        container: {},
        header: {
            flexDirection: "row",
            columnGap: 16,
            paddingTop: 16,
            paddingHorizontal: 16,
        },
        actionButtons: {
            flexDirection: "row",
            columnGap: 8,
        },
        statsContainer: {
            flexDirection: "row",
            columnGap: 8,
        },
        editPhotoButton: {
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: theme.colors.primary,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: theme.colors.surface,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 5,
        },
        displayName: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.colors.onSurface,
        },
        email: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
        },
        quizzesSection: {
            flex: 1,
            padding: 16,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.onSurface,
        },
        listContainer: {
            paddingBottom: 20,
        },
        quizItem: {
            backgroundColor: theme.colors.surface,
            padding: 16,
            rowGap: 8,
            borderRadius: 8,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        quizTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.onSurface,
        },
        quizDescription: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
        },
        quizType: {
            fontSize: 12,
            fontWeight: "bold",
            color: theme.colors.primary,
        },
        quizDate: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
        },
        tagsContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
        },
        tag: {
            fontSize: 12,
            color: theme.colors.primary,
        },
        connectButton: {
            backgroundColor: theme.colors.primary,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 8,
            alignItems: "center",
        },
        connectButtonText: {
            color: theme.colors.onPrimary,
            fontSize: 12,
            fontWeight: "600",
        },
        acceptButton: {
            backgroundColor: "#34C759",
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 8,
            alignItems: "center",
        },
        acceptButtonText: {
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: "600",
        },
        rejectButton: {
            backgroundColor: "#FF3B30",
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 8,
            alignItems: "center",
        },
        rejectButtonText: {
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: "600",
        },
        cancelButton: {
            backgroundColor: theme.colors.error,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 8,
            alignItems: "center",
        },
    });
};
