import React, { useEffect, useState } from "react";
import {
    View,
    ScrollView,
    SafeAreaView,
    Pressable,
    TouchableWithoutFeedback,
    StyleSheet,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import HomeCircle from "../components/Home_circle";
import HeaderForest from "../components/Header_forest";
import StatusBox from "../components/StatusBox";
import HomeButton from "../components/HomeButton";
import FloatingButton from "../components/FloatingButton";
import CalendarBadge from "../components/CalendarBadge";
import SimpleResult from "../components/SimpleResult";
import styles from "../styles/homeStyles";

export default function Home() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "Home">>();
    const [simpleScale, setSimpleScale] = useState(route.params?.simpleScale ?? '');
    useEffect(() => {
        console.log(simpleScale);
    }, [simpleScale]);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: "#0A814C" }} />
                <View style={{ flex: 1, backgroundColor: "#F9FAEC" }} />
            </View>
            <View style={StyleSheet.absoluteFill}>
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
                    contentContainerStyle={[styles.scroll, { paddingBottom: 0 }]}
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
                            onPress={() => navigation.navigate("Record", {})}
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

                {simpleScale !== '' && (
                    <View
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            zIndex: 10,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                        }}
                    >
                        <Pressable
                            style={{ flex: 1 }}
                            onPress={() => setSimpleScale('')}
                        />

                        <View style={[styles.simpleResultWrapper, { zIndex: 20 }]}>
                            <SimpleResult simpleScale={simpleScale} />
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}