import Container from "@/components/Container";
import QuizList from "@/components/QuizList";
import { DEFAULT_GROUP } from "@/constants/values";
import { useAsyncStateEffect } from "@/hooks/useAsyncStateEffect";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { getGroupData } from "@/store/group/actions/getGroupData";
import { getGroupMemberData } from "@/store/group/actions/getGroupMemberData";
import reviewSelector from "@/store/review/review.store";
import authSelector from "@/store/user/user.store";
import { Quiz, QUIZ_TYPE } from "@/types/review";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, FAB, Text } from "react-native-paper";

export default function GroupProfile() {
    const { gid } = useLocalSearchParams<{ gid: string }>();

    const user = authSelector.use.useUser();
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const quizzes = reviewSelector.use.useQuizzes();
    const router = useRouter();
    const params = useLocalSearchParams<{ gid: string }>();
    const [groupData] = useAsyncStateEffect(() => getGroupData(params.gid), [params.gid], {
        initialValue: null,
    });
    const [groupMemberData, { isLoading: groupMemberDataLoading }] = useAsyncStateEffect(
        () => getGroupMemberData(params.gid, user?.uid),
        [params.gid, user?.uid]
    );

    const [state, setState] = useState({ open: false });

    const onStateChange = ({ open }: { open: boolean }) => setState({ open });

    const { open } = state;

    const groupQuizzes = quizzes.filter(
        (quiz) => quiz.gids?.includes(gid || "") || quiz.privacy === "ALL"
    );

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

    const handleJoinGroup = () => {
        console.log("Join group:", gid);
    };

    const handleLeaveGroup = () => {
        console.log("Leave group:", gid);
    };

    const handleShareQuiz = () => {
        router.push({
            pathname: "/quiz-types",
            params: {
                gid: gid,
            },
        });
    };

    if (!groupData) {
        return (
            <Container style={{ alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size={48} />
            </Container>
        );
    }

    const isOwner = groupData.owner === user?.uid;
    const isJoined = groupMemberData?.status === "CONNECTED";
    const isInvited = groupMemberData?.status === "INVITED";
    const isRequested = groupMemberData?.status === "REQUESTED";
    const canManage =
        groupMemberData?.status === "CONNECTED" &&
        ["ADMIN", "OWNER"].includes(groupMemberData.memberType);

    return (
        <Container style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{
                            uri: groupData.avatar ?? DEFAULT_GROUP,
                        }}
                        style={styles.avatar}
                    />
                </View>
                <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{groupData.name}</Text>
                    <Text style={styles.groupDescription}>{groupData.description}</Text>
                    <View style={styles.groupStats}>
                        <View style={styles.stat}>
                            <Ionicons name="people" size={16} color={theme.colors.primary} />
                            <Text style={styles.statText}>
                                {groupData.memberCount} member
                                {groupData.memberCount > 1 ? "s" : ""}
                            </Text>
                        </View>
                        <View style={styles.stat}>
                            <Ionicons name="time" size={16} color={theme.colors.primary} />
                            <Text style={styles.statText}>
                                Created{" "}
                                {groupData.createdAt?.toDate?.()
                                    ? groupData.createdAt.toDate().toLocaleDateString()
                                    : "Recently"}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.actionButtons}>
                {groupMemberData && groupMemberData.status === "CONNECTED" && !isOwner && (
                    <Button
                        mode="outlined"
                        onPress={handleLeaveGroup}
                        style={styles.primaryButton}
                        icon="account-minus"
                        disabled={groupMemberDataLoading}
                    >
                        Leave Group
                    </Button>
                )}

                {!groupData && (
                    <Button
                        mode="contained"
                        onPress={handleJoinGroup}
                        style={styles.primaryButton}
                        icon="account-plus"
                        disabled={groupMemberDataLoading}
                    >
                        Join Group
                    </Button>
                )}
                {isInvited && (
                    <>
                        <Button
                            mode="contained"
                            onPress={handleJoinGroup}
                            style={styles.primaryButton}
                            icon="account-plus"
                            disabled={groupMemberDataLoading}
                        >
                            Accept Invitation
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleJoinGroup}
                            style={styles.primaryButton}
                            icon="account-plus"
                            disabled={groupMemberDataLoading}
                        >
                            Reject Invitation
                        </Button>
                    </>
                )}
                {isRequested && (
                    <>
                        <Button
                            mode="contained"
                            onPress={handleJoinGroup}
                            style={styles.primaryButton}
                            icon="account-plus"
                            disabled={groupMemberDataLoading}
                        >
                            Cancel Join Request
                        </Button>
                    </>
                )}
                {canManage && (
                    <Button
                        mode="outlined"
                        onPress={() => {
                            router.push("/members");
                        }}
                        style={styles.secondaryButton}
                        icon="account-group"
                    >
                        Manage Members
                    </Button>
                )}
            </View>

            <View style={styles.quizzesSection}>
                <Text style={styles.sectionTitle}>Shared Quizzes ({groupQuizzes.length})</Text>
                {groupQuizzes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="library-outline"
                            size={48}
                            color={theme.colors.onSurfaceVariant}
                        />
                        <Text style={styles.emptyTitle}>No quizzes shared yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Be the first to share a quiz with this group!
                        </Text>
                        <Button
                            mode="contained"
                            onPress={handleShareQuiz}
                            style={styles.shareQuizButton}
                            icon="plus"
                        >
                            Create & Share Quiz
                        </Button>
                    </View>
                ) : (
                    <QuizList
                        onQuizPress={handlePress}
                        quizzes={groupQuizzes}
                        emptyMessage="No quizzes shared with this group"
                    />
                )}
            </View>
            {isJoined && (
                <FAB.Group
                    backdropColor={"transparent"}
                    open={open}
                    visible
                    icon={open ? "close" : "plus"}
                    actions={[
                        {
                            icon: "account-plus",
                            label: "INVITE MEMBERS",
                            onPress: () => router.push("/invite-members"),
                            labelTextColor: theme.colors.tertiary,
                        },
                        {
                            icon: "eye",
                            label: "VIEW ALL MEMBERS",
                            onPress: () => router.push("/members"),
                            labelTextColor: theme.colors.tertiary,
                        },
                    ]}
                    onStateChange={onStateChange}
                    onPress={() => {
                        if (open) {
                            // do something if the speed dial is open
                        }
                    }}
                />
            )}
        </Container>
    );
}

const makeStyles = (theme: AppTheme) => {
    return StyleSheet.create({
        container: {},
        header: {
            alignItems: "center",
            flexDirection: "row",
            paddingTop: 16,
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.outline,
        },
        avatarContainer: {
            marginRight: 16,
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 40,
        },
        groupInfo: {
            flex: 1,
            gap: 8,
        },
        groupName: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.colors.onSurface,
        },
        groupDescription: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            lineHeight: 20,
        },
        groupStats: {
            flexDirection: "row",
            gap: 16,
        },
        stat: {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
        },
        statText: {
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
            fontWeight: "500",
        },
        actionButtons: {
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingVertical: 16,
            gap: 12,
            alignItems: "center",
        },
        primaryButton: {
            flex: 1,
        },
        secondaryButton: {
            flex: 1,
        },
        menuButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.surface,
            justifyContent: "center",
            alignItems: "center",
            elevation: 2,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.05,
            shadowRadius: 2,
        },
        quizzesSection: {
            flex: 1,
            padding: 16,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 16,
            color: theme.colors.onSurface,
        },
        emptyContainer: {
            alignItems: "center",
            paddingVertical: 60,
            paddingHorizontal: 32,
            gap: 16,
        },
        emptyTitle: {
            fontSize: 18,
            fontWeight: "600",
            color: theme.colors.onSurface,
        },
        emptySubtitle: {
            fontSize: 14,
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
            lineHeight: 20,
            marginBottom: 8,
        },
        shareQuizButton: {
            marginTop: 8,
        },
    });
};
