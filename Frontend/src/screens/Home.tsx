import React from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import { View, ScrollView } from "react-native";
import HomeCircle from "../components/Home_circle"; // HomeCircle 추가
import HeaderForest from "../components/Header_forest";
import StatusBox from "../components/StatusBox";
import HomeButton from "../components/HomeButton";
import FloatingButton from "../components/FloatingButton";
import styles from "../styles/homeStyles";

export default function Home() {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return (
        <View style={styles.container}>
            {/* 헤더와 타원을 ScrollView 바깥에 위치 */}
            <View style={styles.headerWrapper}>
                <HeaderForest />
                <HomeCircle style={styles.circle} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <StatusBox />

                <View style={styles.buttonGroup}>
                    <HomeButton
                        icon="heart-pulse"
                        title="마음 건강 진단"
                        subtitle="PHQ-9 기반 설문 자가 진단하기"
                        onPress={() => console.log("진단")}
                    />
                    <HomeButton
                        icon="book-heart"
                        title="일기"
                        subtitle="오늘 하루 나의 마음 기록하기"
                        onPress={() => console.log("일기")}
                    />
                    <HomeButton
                        icon="target"
                        title="퀘스트"
                        onPress={() => navigation.navigate("Quest")}
                    />
                </View>
            </ScrollView>

            <FloatingButton />
        </View>
    );
}
