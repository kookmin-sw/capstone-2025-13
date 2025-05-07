import React from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import { View, ScrollView } from "react-native";
import HomeCircle from "../components/Home_circle";
import HeaderForest from "../components/Header_forest";
import StatusBox from "../components/StatusBox";
import HomeButton from "../components/HomeButton";
import FloatingButton from "../components/FloatingButton";
import CalendarBadge from "../components/CalendarBadge";
import styles from "../styles/homeStyles";

export default function Home() {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return (
        <View style={styles.container}>
            {}
            <View style={styles.headerWrapper}>
                <View
                    style={{
                        position: "absolute",
                        top: 155,
                        right: 55,
                        zIndex: 3,
                    }}
                >
                    <CalendarBadge
                        day={
                            ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][
                                new Date().getDay()
                            ]
                        }
                        date={new Date().getDate()}
                    />
                </View>
                <HeaderForest />
                <HomeCircle style={styles.circle} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <StatusBox />

                <View style={styles.buttonGroup}>
                    <HomeButton
                        icon="heart-pulse"
                        title="마음 건강 진단"
                        subtitle="지금, 내 마음 상태 알아보기"
                        onPress={() => navigation.navigate("FormalDiagnosis")}
                    />
                    <HomeButton
                        icon="book-open-variant"
                        title="일기"
                        subtitle="오늘 하루, 나의 마음 기록하기"
                        onPress={() => navigation.navigate("Record")}
                    />
                    <HomeButton
                        icon="target"
                        title="퀘스트"
                        subtitle="작은 실천 모아 나의 마음 건강 지키기"
                        onPress={() => navigation.navigate("Quest")}
                    />
                </View>
                <View style={styles.floatingButtonWrapper}>
                    <FloatingButton />
                </View>
            </ScrollView>
        </View>
    );
}
