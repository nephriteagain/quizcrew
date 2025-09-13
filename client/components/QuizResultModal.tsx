import { WIDTH } from "@/constants/values";
import { AppTheme, useAppTheme } from "@/providers/ThemeProvider";
import { AudioPlayer, useAudioPlayer } from "expo-audio";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

interface QuizResultModalProps {
    score: number;
    visible: boolean;
    totalQuestion: number;
    onClose: () => void;
}

const APPLAUSE1 = require("@/assets/sounds/applause1.wav"); // highest
const APPLAUSE2 = require("@/assets/sounds/applause2.wav");
const APPLAUSE3 = require("@/assets/sounds/applause3.wav");
const APPLAUSE4 = require("@/assets/sounds/applause4.wav"); // lowest

export function QuizResultModal({ score, totalQuestion, visible, onClose }: QuizResultModalProps) {
    const theme = useAppTheme();
    const styles = makeStyles(theme);
    const scorePercent = useMemo(() => {
        return score / totalQuestion;
    }, [score, totalQuestion]);

    const confettiRef = useRef<ConfettiCannon | null>(null);
    // 🎉 Confetti count based on score (min 20, max 500)
    const confettiCount = useMemo(
        () => Math.max(20, Math.floor(scorePercent * 500)),
        [scorePercent]
    );
    const player1 = useAudioPlayer(APPLAUSE1);
    const player2 = useAudioPlayer(APPLAUSE2);
    const player3 = useAudioPlayer(APPLAUSE3);

    const playClapSound = useCallback(async () => {
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
    }, [scorePercent, player1, player2, player3]);

    const startConfetti = useCallback(() => {
        confettiRef.current?.start();
    }, []);

    const startCelebration = useCallback(() => {
        startConfetti();
        playClapSound();
    }, [startConfetti, playClapSound]);

    // Auto start confetti and sound when modal opens
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(startCelebration, 300);
            return () => clearTimeout(timer);
        }
    }, [visible, startCelebration]);

    const scoreText = useMemo(() => {
        if (scorePercent === 1) return "Perfect!";
        if (scorePercent >= 0.7) return "Great Job!";
        if (scorePercent >= 0.4) return "Not Bad!";
        return "Better Luck Next Time!";
    }, [scorePercent]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
            style={styles.modal}
        >
            <View style={styles.overlay}>
                {/* Card */}
                <View style={styles.card}>
                    <Text style={styles.scoreText}>{scoreText}</Text>

                    <Text style={styles.resultText}>
                        You scored {score}/{totalQuestion} ({(scorePercent * 100).toFixed(0)}%)
                    </Text>

                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                </View>

                {/* 🎉 Confetti (scaled by score) */}
                <ConfettiCannon
                    count={confettiCount}
                    origin={{ x: WIDTH / 2, y: 0 }}
                    autoStart={false}
                    fadeOut
                    ref={confettiRef}
                />
            </View>
        </Modal>
    );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
    modal: { flex: 1 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: `${theme.colors.onSurface}99`,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "80%",
        padding: 24,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        alignItems: "center",
    },
    scoreText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 12,
        color: theme.colors.onSurface,
    },
    resultText: {
        fontSize: 18,
        marginBottom: 20,
        color: theme.colors.onSurface,
    },
    closeButton: {
        backgroundColor: theme.colors.secondary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    closeButtonText: {
        color: theme.colors.onPrimary,
        fontWeight: "bold",
        fontSize: 16,
    },
});
