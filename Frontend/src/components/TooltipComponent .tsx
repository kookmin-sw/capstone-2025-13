import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useCopilot } from "react-native-copilot";


const TooltipComponent = () => {
    const {
        isFirstStep,
        isLastStep,
        currentStep,
        goToNext,
        stop,
        goToPrev,
    } = useCopilot();

    return (
        <View style={styles.tooltipContainer}>
            <Text style={styles.tooltipText}>{currentStep?.text}</Text>
            <View style={styles.buttonRow}>
                {!isFirstStep && (
                    <TouchableOpacity onPress={goToPrev} style={styles.button}>
                        <Text style={styles.buttonText}>이전</Text>
                    </TouchableOpacity>
                )}
                {!isLastStep ? (
                    <TouchableOpacity onPress={goToNext} style={styles.button}>
                        <Text style={styles.buttonText}>다음</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={stop} style={styles.button}>
                        <Text style={styles.buttonText}>완료</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tooltipContainer: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 8,
        maxWidth: 250,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        bottom: 7,
    },
    tooltipText: {
        fontSize: 13,
        marginBottom: 12,
        color: "#333",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    button: {
        marginLeft: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: "#00aaff",
        borderRadius: 6,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    stepNumberContainer: {
        backgroundColor: "#00aaff",
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    stepNumberText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default TooltipComponent;