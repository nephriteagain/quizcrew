import Container from "@/components/Container";
import QuizList from "@/components/QuizList";
import { useAppTheme } from "@/providers/ThemeProvider";
import reviewSelector from "@/store/review/review.store";
import { Quiz, QUIZ_TYPE } from "@/types/review";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, LinkProps, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const routes: {
    name: LinkProps["href"];
    label: string;
}[] = [{ name: "/quiz-types", label: "Create New Quiz" }];

export default function Index() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const reviewer = reviewSelector.use.useQuizzes();
    const router = useRouter();

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

    return (
        <Container style={styles.container}>
            <View>
                {routes.map((route) => (
                    <Link href={route.name} asChild key={route.label}>
                        <Pressable style={styles.routeButton}>
                            <LinearGradient
                                colors={[theme.colors.inversePrimary, theme.colors?.primary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.gradientButton}
                            >
                                <View style={styles.buttonContent}>
                                    <Ionicons
                                        name="add-circle"
                                        size={28}
                                        color={theme.colors.onPrimary}
                                        style={styles.buttonIcon}
                                    />
                                    <Text style={styles.routeButtonText}>{route.label}</Text>
                                </View>
                            </LinearGradient>
                        </Pressable>
                    </Link>
                ))}
            </View>
            <QuizList quizzes={reviewer} onQuizPress={handlePress} />
        </Container>
    );
}

const makeStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            padding: 10,
            rowGap: 10,
            paddingBottom: 0,
        },
        routeButton: {
            width: "100%",
            borderRadius: 16,
            shadowColor: theme.colors.onSurface,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            overflow: "hidden",
        },
        gradientButton: {
            width: "100%",
            paddingVertical: 18,
            paddingHorizontal: 24,
            borderRadius: 16,
        },
        buttonContent: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        },
        buttonIcon: {
            marginRight: 12,
        },
        routeButtonText: {
            fontSize: 18,
            fontWeight: "700",
            color: theme.colors.onPrimary,
            letterSpacing: 0.5,
            textTransform: "uppercase",
        },
    });
