// App.tsx
import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";

export default function App() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>우웅~ 홈</Text>
            <Text style={styles.subtitle}>오늘도 좋은 하루 보내세요 😊</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>오늘의 퀘스트</Text>
                <Text style={styles.cardText}>• 물 한잔 마시기</Text>
                <Text style={styles.cardText}>• 5분간 심호흡</Text>
                <Text style={styles.cardText}>• 감사한 일 3가지 적기</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => Alert.alert("퀘스트 완료!")}
                >
                    <Text style={styles.buttonText}>퀘스트 완료하기</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>자가진단</Text>
                <Text style={styles.cardText}>최근 기분을 체크해보세요.</Text>
                <TouchableOpacity
                    style={[styles.button, styles.outlineButton]}
                    onPress={() => Alert.alert("자가진단 시작!")}
                >
                    <Text style={[styles.buttonText, styles.outlineButtonText]}>
                        자가진단 시작
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 100,
        backgroundColor: "#f3f4f6",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 4,
    },
    button: {
        marginTop: 12,
        backgroundColor: "#3b82f6",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    outlineButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    outlineButtonText: {
        color: "#333",
    },
});
