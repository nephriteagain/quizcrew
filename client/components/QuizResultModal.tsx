import React, { useEffect, useMemo, useRef } from "react";
import { Modal, Pressable, Text, View } from "react-native";
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
    const confettiCount = Math.max(20, Math.floor(scorePercent * 1000));

    // Auto start confetti when modal opens
    useEffect(() => {
        if (visible) {
            setTimeout(() => confettiRef.current?.start(), 300);
        }
    }, [visible]);

    const scoreText =
        scorePercent === 1
            ? "Perfect!"
            : scorePercent >= 0.7
              ? "Great Job!"
              : scorePercent >= 0.4
                ? "Not Bad!"
                : "Better Luck Next Time!";

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {/* Card */}
                <View
                    style={{
                        width: "80%",
                        padding: 24,
                        borderRadius: 16,
                        backgroundColor: "white",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>
                        {scoreText}
                    </Text>

                    <Text style={{ fontSize: 18, marginBottom: 20 }}>
                        You scored {score}/{totalQuestion} ({(scorePercent * 100).toFixed(0)}%)
                    </Text>

                    <Pressable
                        onPress={onClose}
                        style={({ pressed }) => ({
                            backgroundColor: pressed ? "#45a049" : "#4CAF50",
                            paddingVertical: 12,
                            paddingHorizontal: 24,
                            borderRadius: 12,
                        })}
                    >
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                            Close
                        </Text>
                    </Pressable>
                </View>

                {/* 🎉 Confetti (scaled by score) */}
                <ConfettiCannon
                    count={confettiCount}
                    origin={{ x: -10, y: 0 }}
                    autoStart={false}
                    fadeOut
                    ref={confettiRef}
                />
            </View>
        </Modal>
    );
}
