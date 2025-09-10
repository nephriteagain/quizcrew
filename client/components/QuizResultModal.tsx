import { WIDTH } from "@/constants/values";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

interface QuizResultModalProps {
    score: number;
    visible: boolean;
    totalQuestion: number;
    onClose: () => void;
}

export function QuizResultModal({ score, totalQuestion, visible, onClose }: QuizResultModalProps) {
    const scorePercent = useMemo(() => {
        return score / totalQuestion;
    }, [score, totalQuestion]);

    const confettiRef = useRef<ConfettiCannon | null>(null);
    // 🎉 Confetti count based on score (min 20, max 200)
    const confettiCount = useMemo(
        () => Math.max(20, Math.floor(scorePercent * 500)),
        [scorePercent]
    );

    const startConfetti = useCallback(() => {
        confettiRef.current?.start();
    }, []);

    // Auto start confetti when modal opens
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(startConfetti, 300);
            return () => clearTimeout(timer);
        }
    }, [visible, startConfetti]);

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

const styles = StyleSheet.create({
    modal: { flex: 1 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "80%",
        padding: 24,
        borderRadius: 16,
        backgroundColor: "white",
        alignItems: "center",
    },
    scoreText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 12,
    },
    resultText: {
        fontSize: 18,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
