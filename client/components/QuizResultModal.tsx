import { useEffectLogRoute } from "@/hooks/useEffectLogRoute";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { AudioPlayer, useAudioPlayer } from "expo-audio";
import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from "react-native-reanimated";

interface QuizResultModalProps {
    score: number;
    visible: boolean;
    totalQuestion: number;
    onClose: () => void;
}

const APPLAUSE1 = require("@/assets/sounds/applause1.wav"); // highest
const APPLAUSE2 = require("@/assets/sounds/applause2.wav");
const APPLAUSE3 = require("@/assets/sounds/applause3.wav");

export function QuizResultModal({ score, totalQuestion, visible, onClose }: QuizResultModalProps) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const scorePercent = score / totalQuestion;

    // Animation values
    const progressValue = useSharedValue(0);
    const scaleValue = useSharedValue(0.8);

    const player1 = useAudioPlayer(APPLAUSE1);
    const player2 = useAudioPlayer(APPLAUSE2);
    const player3 = useAudioPlayer(APPLAUSE3);

    // Auto start confetti and sound when modal opens
    useEffectLogRoute(() => {
        const playClapSound = async () => {
            try {
                let player: AudioPlayer;
                if (scorePercent >= 0.8) {
                    player = player1; // highest
                } else if (scorePercent >= 0.5) {
                    player = player2;
                } else {
                    player = player3; // lowest
                }

                await player.seekTo(0);
                player.play();
                player.play();
            } catch (error) {
                console.warn("Could not play clap sound:", error);
            }
        };

        const startCelebration = () => {
            playClapSound();
            // Start animations
            scaleValue.value = withSpring(1, { damping: 15, stiffness: 100 });
            progressValue.value = withDelay(500, withTiming(scorePercent, { duration: 1500 }));
        };

        if (visible) {
            const timer = setTimeout(startCelebration, 300);
            return () => clearTimeout(timer);
        } else {
            // Reset animations when modal closes
            progressValue.value = 0;
            scaleValue.value = 0.8;
        }
    }, [visible, player1, player2, player3, scorePercent, progressValue, scaleValue]);

    const getScoreData = () => {
        if (scorePercent === 1) {
            return {
                text: "Perfect!",
                icon: "trophy" as const,
                color: "#FFD700",
                message: "Outstanding performance!",
            };
        }
        if (scorePercent >= 0.8) {
            return {
                text: "Excellent!",
                icon: "medal" as const,
                color: "#631d76",
                message: "You're doing great!",
            };
        }
        if (scorePercent >= 0.6) {
            return {
                text: "Good Job!",
                icon: "thumbs-up" as const,
                color: "#9e4770",
                message: "Nice work there!",
            };
        }
        if (scorePercent >= 0.4) {
            return {
                text: "Not Bad!",
                icon: "checkmark-circle" as const,
                color: "#2e2532",
                message: "Keep practicing!",
            };
        }
        return {
            text: "Try Again!",
            icon: "refresh" as const,
            color: "#9e4770",
            message: "Practice makes perfect!",
        };
    };

    const scoreData = getScoreData();

    // Animated styles
    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${progressValue.value * 100}%`,
        };
    });

    const cardStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scaleValue.value }],
        };
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
            style={styles.modal}
        >
            <Animated.View style={styles.overlay} entering={FadeIn.duration(300)}>
                <Animated.View style={[styles.card, cardStyle]}>
                    {/* Header with Icon */}
                    <Animated.View style={styles.header} entering={FadeInUp.delay(300)}>
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: scoreData.color + "20" },
                            ]}
                        >
                            <Ionicons name={scoreData.icon} size={48} color={scoreData.color} />
                        </View>
                        <Text style={[styles.scoreText, { color: scoreData.color }]}>
                            {scoreData.text}
                        </Text>
                        <Text style={styles.messageText}>{scoreData.message}</Text>
                    </Animated.View>

                    {/* Score Display */}
                    <Animated.View style={styles.scoreContainer} entering={FadeInDown.delay(400)}>
                        <View style={styles.scoreRow}>
                            <Text style={styles.scoreLabel}>Your Score</Text>
                            <Text style={styles.scoreValue}>
                                {score}/{totalQuestion}
                            </Text>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressTrack}>
                                <Animated.View
                                    style={[
                                        styles.progressFill,
                                        { backgroundColor: scoreData.color },
                                        progressStyle,
                                    ]}
                                />
                            </View>
                            <Text style={[styles.percentText, { color: scoreData.color }]}>
                                {(scorePercent * 100).toFixed(0)}%
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Action Buttons */}
                    <Animated.View style={styles.buttonContainer} entering={FadeInDown.delay(600)}>
                        <Pressable
                            onPress={onClose}
                            style={[styles.closeButton, { backgroundColor: scoreData.color }]}
                            android_ripple={{ color: "#ffffff40" }}
                        >
                            <Text style={styles.closeButtonText}>Continue</Text>
                            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                        </Pressable>
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        modal: { flex: 1 },
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
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 20,
        },
        header: {
            alignItems: "center",
            marginBottom: 32,
        },
        iconContainer: {
            width: 96,
            height: 96,
            borderRadius: 48,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
        },
        scoreText: {
            fontSize: 32,
            fontWeight: "800",
            marginBottom: 8,
            textAlign: "center",
        },
        messageText: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
            textAlign: "center",
            fontWeight: "500",
        },
        scoreContainer: {
            width: "100%",
            marginBottom: 32,
        },
        scoreRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
        },
        scoreLabel: {
            fontSize: 18,
            color: theme.colors.onSurface,
            fontWeight: "600",
        },
        scoreValue: {
            fontSize: 24,
            fontWeight: "800",
            color: theme.colors.onSurface,
        },
        progressContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
        },
        progressTrack: {
            flex: 1,
            height: 8,
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 4,
            overflow: "hidden",
        },
        progressFill: {
            height: "100%",
            borderRadius: 4,
        },
        percentText: {
            fontSize: 18,
            fontWeight: "700",
            minWidth: 50,
            textAlign: "right",
        },
        buttonContainer: {
            width: "100%",
        },
        closeButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 16,
            gap: 8,
        },
        closeButtonText: {
            color: "#ffffff",
            fontWeight: "700",
            fontSize: 18,
        },
    });
