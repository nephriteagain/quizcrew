import { analytics } from "@/firebase";
import { useEffectLogRoute } from "@/hooks/useEffectLogRoute";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { logEvent } from "@react-native-firebase/analytics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { debounce } from "lodash";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

interface StartQuizModalProps {
    title: string;
    description: string;
    totalQuestions: number;
    quizType?: string;
}

export function StartQuizModal({ title, description, totalQuestions, quizType }: StartQuizModalProps) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);

    const [isVisible, setIsVisible] = useState(false);
    const params = useLocalSearchParams<{ quiz_id: string }>();
    const quiz_id = params.quiz_id;

    const router = useRouter();

    const hideModal = () => {
        logEvent(analytics, "start_quiz", { quiz_id, quiz_type: quizType, question_count: totalQuestions });
        setIsVisible(false);
    };

    const handleCancel = () => {
        logEvent(analytics, "cancel_quiz_start", { quiz_id, quiz_type: quizType });
        router.back();
        hideModal();
    };

    useEffectLogRoute(() => {
        const delaySetVisible = debounce(setIsVisible, 100);
        delaySetVisible(true);
    }, []);

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={hideModal}
            statusBarTranslucent
            style={styles.modal}
        >
            <Animated.View style={styles.overlay} entering={FadeIn.duration(300)}>
                <Animated.View style={styles.card} entering={FadeInUp.delay(200)}>
                    <Animated.View style={styles.header} entering={FadeInUp.delay(300)}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="school" size={48} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.titleText}>{title}</Text>
                        <Text style={styles.descriptionText}>{description}</Text>
                    </Animated.View>

                    <Animated.View style={styles.quizInfo} entering={FadeInDown.delay(400)}>
                        <View style={styles.infoRow}>
                            <Ionicons
                                name="help-circle-outline"
                                size={24}
                                color={theme.colors.primary}
                            />
                            <Text style={styles.infoText}>
                                {totalQuestions} {totalQuestions === 1 ? "question" : "questions"}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
                            <Text style={styles.infoText}>No time limit</Text>
                        </View>
                    </Animated.View>

                    <Animated.View style={styles.buttonContainer} entering={FadeInDown.delay(500)}>
                        <Pressable
                            onPress={handleCancel}
                            style={styles.cancelButton}
                            android_ripple={{ color: theme.colors.onSurfaceVariant + "20" }}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={hideModal}
                            style={styles.startButton}
                            android_ripple={{ color: "#ffffff40" }}
                        >
                            <Text style={styles.startButtonText}>Start Quiz</Text>
                            <Ionicons name="play" size={20} color="#ffffff" />
                        </Pressable>
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        modal: {
            flex: 1,
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
        },
        card: {
            width: "100%",
            maxWidth: 360,
            borderRadius: 24,
            backgroundColor: theme.colors.surface,
            padding: 32,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 10,
            },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 20,
        },
        header: {
            alignItems: "center",
            gap: 16,
        },
        iconContainer: {
            width: 96,
            height: 96,
            borderRadius: 48,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.primary + "20",
        },
        titleText: {
            fontSize: 24,
            fontWeight: "800",
            color: theme.colors.onSurface,
            textAlign: "center",
        },
        descriptionText: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
            lineHeight: 22,
        },
        quizInfo: {
            width: "100%",
            gap: 12,
            paddingVertical: 24,
        },
        infoRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },
        infoText: {
            fontSize: 16,
            color: theme.colors.onSurface,
            fontWeight: "500",
        },
        buttonContainer: {
            width: "100%",
            flexDirection: "row",
            gap: 12,
        },
        cancelButton: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 16,
            backgroundColor: theme.colors.surfaceVariant,
        },
        cancelButtonText: {
            color: theme.colors.onSurfaceVariant,
            fontWeight: "600",
            fontSize: 16,
        },
        startButton: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 16,
            backgroundColor: theme.colors.primary,
            gap: 8,
        },
        startButtonText: {
            color: "#ffffff",
            fontWeight: "700",
            fontSize: 16,
        },
    });
