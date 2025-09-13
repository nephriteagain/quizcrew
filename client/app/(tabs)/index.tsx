import QuizList from "@/components/QuizList";
import reviewSelector from "@/store/review/review.store";
import { Quiz, QUIZ_TYPE } from "@/types/review";
import { Link, LinkProps, useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const routes: {
    name: LinkProps["href"];
    label: string;
}[] = [{ name: "/quiz-types", label: "Create Quiz" }];

export default function Index() {
    const reviewer = reviewSelector.use.quizzes();
    const router = useRouter();

    const handlePress = useCallback(
        (quiz: Quiz) => {
            if (quiz.type === QUIZ_TYPE.MCQ) {
                router.push({
                    pathname: "../mcq",
                    params: {
                        quiz_id: quiz.quiz_id,
                    },
                });
            } else if (quiz.type === QUIZ_TYPE.TOFQ) {
                router.push({
                    pathname: "../tofq",
                    params: {
                        quiz_id: quiz.quiz_id,
                    },
                });
            } else if (quiz.type === QUIZ_TYPE.DNDQ) {
                router.push({
                    pathname: "/dndq",
                    params: {
                        quiz_id: quiz.quiz_id,
                    },
                });
            }
        },
        [router]
    );

    return (
        <View style={styles.container}>
            <View>
                {routes.map((route) => (
                    <Link href={route.name} asChild key={route.label}>
                        <Pressable style={styles.routeButton}>
                            <Text style={styles.routeButtonText}>{route.label}</Text>
                        </Pressable>
                    </Link>
                ))}
            </View>
            <QuizList quizzes={reviewer} onQuizPress={handlePress} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        rowGap: 10,
    },
    routeButton: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#d81f1fff",
    },
    routeButtonText: {
        fontSize: 24,
        fontWeight: "700",
        color: "white",
    },
});
