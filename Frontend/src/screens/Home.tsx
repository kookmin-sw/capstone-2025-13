// Home.tsx
import React from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";
import homeStyles from "../styles/homeStyles";

export default function Home() {
    return (
        <ScrollView contentContainerStyle={homeStyles.container}>
            <Text style={homeStyles.title}>우웅~ 홈</Text>
            <Text style={homeStyles.subtitle}>오늘도 좋은 하루 보내세요!</Text>

            <View style={homeStyles.card}>
                <Text style={homeStyles.cardTitle}>오늘의 퀘스트</Text>
                <Text style={homeStyles.cardText}>• 물 한잔 마시기</Text>
                <Text style={homeStyles.cardText}>• 5분간 심호흡</Text>
                <Text style={homeStyles.cardText}>• 감사한 일 3가지 적기</Text>
                <TouchableOpacity
                    style={homeStyles.button}
                    onPress={() => Alert.alert("퀘스트 완료!")}
                >
                    <Text style={homeStyles.buttonText}>퀘스트 완료하기</Text>
                </TouchableOpacity>
            </View>

            <View style={homeStyles.card}>
                <Text style={homeStyles.cardTitle}>자가진단</Text>
                <Text style={homeStyles.cardText}>최근 기분을 체크해보세요.!</Text>
                <TouchableOpacity
                    style={[homeStyles.button, homeStyles.outlineButton]}
                    onPress={() => Alert.alert("자가진단 시작!")}
                >
                    <Text style={[homeStyles.buttonText, homeStyles.outlineButtonText]}>
                        자가진단 시작
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

