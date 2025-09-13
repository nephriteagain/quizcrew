import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import Container from "@/components/Container";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import reviewSelector from "@/store/review/review.store";
import { MultipleChoiceQ } from "@/types/review";
import { Link, useLocalSearchParams } from "expo-router";

export default function MultipleChoiceQuestions() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const [showAnswer, setShowAnswer] = useState(false);
    const [individualAnswers, setIndividualAnswers] = useState<Set<number>>(new Set());
    const toggleSwitch = () => {
        setShowAnswer((previousState) => !previousState);
        setIndividualAnswers(new Set());
    };

    const toggleIndividualAnswer = (questionIndex: number) => {
        setIndividualAnswers((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(questionIndex)) {
                newSet.delete(questionIndex);
            } else {
                newSet.add(questionIndex);
            }
            return newSet;
        });
    };
    const params = useLocalSearchParams<{ quiz_id: string }>();
    const quiz_id = params.quiz_id;
    const quizzes = reviewSelector.use.quizzes();
    const selectedQuiz = quizzes.find((q) => q.quiz_id === quiz_id) as MultipleChoiceQ | undefined;

    if (!quiz_id) {
        return (
            <View style={styles.errorContainer}>
                <Text>Invalid Quiz Id</Text>
            </View>
        );
    }

    if (!selectedQuiz) {
        return (
            <View style={styles.errorContainer}>
                <Text>Quiz not found.</Text>
            </View>
        );
    }

    return (
        <Container style={styles.container}>
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>
                    {showAnswer ? "Hide All Answers" : "Show All Answers"}
                </Text>
                <Switch
                    trackColor={{ false: theme.colors.outline, true: theme.colors.primary }}
                    thumbColor={showAnswer ? theme.colors.onPrimary : theme.colors.surface}
                    ios_backgroundColor={theme.colors.outline}
                    onValueChange={toggleSwitch}
                    value={showAnswer}
                />
            </View>
            <FlashList
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <Text style={styles.quizTitle}>{selectedQuiz.title}</Text>
                        <Text style={styles.quizDescription}>{selectedQuiz.description}</Text>
                    </View>
                }
                ListHeaderComponentStyle={styles.headerStyle}
                data={selectedQuiz.questions}
                keyExtractor={(q, index) =>
                    q.answer.valueOf() + JSON.stringify(q.question) + JSON.stringify(q.choices)
                }
                renderItem={({ item, index }) => {
                    const isIndividuallyShown = individualAnswers.has(index);
                    return (
                        <View style={styles.questionContainer}>
                            <Pressable
                                android_ripple={{ color: theme.colors.surfaceVariant }}
                                onPress={() => toggleIndividualAnswer(index)}
                                style={styles.questionPressable}
                            >
                                <Text style={styles.questionText}>
                                    {index + 1}. {item.question}
                                </Text>
                            </Pressable>

                            {item.choices.map((choice: string, cIndex: number) => {
                                const shouldShowAnswer =
                                    (showAnswer || isIndividuallyShown) &&
                                    choice === selectedQuiz.questions[index].answer;
                                return (
                                    <Pressable
                                        key={cIndex}
                                        style={[
                                            styles.choiceContainer,
                                            shouldShowAnswer && styles.correctChoice,
                                        ]}
                                        onPress={() => {
                                            if (
                                                isIndividuallyShown &&
                                                choice === selectedQuiz.questions[index].answer
                                            ) {
                                                toggleIndividualAnswer(index);
                                            }
                                        }}
                                    >
                                        <Text style={styles.choiceText}>{choice}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    );
                }}
            />
            <View style={styles.footerContainer}>
                <Link
                    href={{
                        pathname: "/mcq-answer",
                        params: {
                            quiz_id,
                        },
                    }}
                    asChild
                >
                    <Pressable
                        android_ripple={{ color: "#ccc", borderless: false }}
                        style={styles.takeQuizButton}
                    >
                        <Text style={styles.takeQuizText}>Take the Quiz</Text>
                    </Pressable>
                </Link>
            </View>
        </Container>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            padding: 16,
        },
        errorContainer: {
            flex: 1,
            padding: 16,
            backgroundColor: theme.colors.surface,
            alignItems: "center",
            justifyContent: "center",
        },
        toggleContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: theme.colors.surface,
            zIndex: 10,
        },
        toggleText: {
            fontWeight: "600",
            fontSize: 16,
            color: theme.colors.onSurface,
        },
        headerContainer: {
            rowGap: 6,
        },
        headerStyle: {
            paddingBottom: 10,
        },
        quizTitle: {
            fontWeight: "600",
            fontSize: 18,
            color: theme.colors.onSurface,
        },
        quizDescription: {
            color: theme.colors.onSurfaceVariant,
        },
        questionContainer: {
            marginBottom: 24,
        },
        questionPressable: {
            padding: 8,
            marginBottom: 8,
            borderRadius: 8,
            backgroundColor: "rgba(0,0,0,0.02)",
        },
        questionText: {
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 4,
            color: theme.colors.onSurface,
        },
        individualAnswerHint: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.colors.secondary,
            marginTop: 4,
            fontStyle: "italic",
        },
        choiceContainer: {
            padding: 12,
            marginVertical: 6,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "transparent",
            backgroundColor: theme.colors.surface,
        },
        correctChoice: {
            borderColor: theme.colors.secondary,
            backgroundColor: theme.colors.secondaryContainer,
        },
        choiceText: {
            fontSize: 14,
            color: theme.colors.onSurface,
        },
        footerContainer: {
            padding: 16,
            borderTopWidth: 1,
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.surface,
        },
        takeQuizButton: {
            backgroundColor: theme.colors.secondary,
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
        },
        takeQuizText: {
            color: theme.colors.onSecondary,
            fontWeight: "bold",
            fontSize: 16,
        },
    });
