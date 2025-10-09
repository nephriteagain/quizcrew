import Container from "@/components/Container";
import QuizList from "@/components/QuizList";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import reviewSelector from "@/store/review/review.store";
import { Quiz, QUIZ_TYPE } from "@/types/review";
import { Group } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Button, FAB, Text } from "react-native-paper";

const mockGroup: Group = {
    gid: "1",
    status: "ACTIVE",
    name: "React Native Developers",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop",
    description: "A community for React Native developers to share knowledge and experiences",
    owner: "owner1",
    createdAt: new Date() as any,
    memberCount: 1250,
    ownerData: {
        uid: "owner1",
        username: "Group Owner",
        photoURL:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
        status: "ACTIVE",
    },
};

export default function GroupProfile() {
    const { gid } = useLocalSearchParams<{ gid: string }>();

    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const quizzes = reviewSelector.use.useQuizzes();
    const router = useRouter();

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

    const isMember = true;

    return (
        <Container style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{
                            uri: mockGroup.avatar,
                        }}
                        style={styles.avatar}
                    />
                </View>
                <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{mockGroup.name}</Text>
                    <Text style={styles.groupDescription}>{mockGroup.description}</Text>
                    <View style={styles.groupStats}>
                        <View style={styles.stat}>
                            <Ionicons name="people" size={16} color={theme.colors.primary} />
                            <Text style={styles.statText}>{mockGroup.memberCount} members</Text>
                        </View>
                        <View style={styles.stat}>
                            <Ionicons name="time" size={16} color={theme.colors.primary} />
                            <Text style={styles.statText}>
                                Created{" "}
                                {mockGroup.createdAt?.toDate?.()
                                    ? mockGroup.createdAt.toDate().toLocaleDateString()
                                    : "Recently"}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.actionButtons}>
                <Button
                    mode="contained"
                    onPress={handleJoinGroup}
                    style={styles.primaryButton}
                    icon="account-plus"
                >
                    Join Group
                </Button>
                <Button
                    mode="outlined"
                    onPress={handleShareQuiz}
                    style={styles.secondaryButton}
                    icon="share"
                >
                    Share Quiz
                </Button>
                <Pressable style={styles.menuButton} onPress={handleLeaveGroup}>
                    <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.onSurface} />
                </Pressable>
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
            {isMember && (
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
            borderRadius: 12,
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
