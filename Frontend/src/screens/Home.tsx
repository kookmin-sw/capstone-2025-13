import React, { useEffect, useRef, useState } from "react";
import {
    View,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    Dimensions,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import useBlockBackHandler from "../hooks/useBlockBackHandler";
import TooltipComponent from "../components/TooltipComponent ";
import {
    CopilotStep,
    walkthroughable,
    useCopilot,
    CopilotProvider,
} from "react-native-copilot";
import customAxios from "../API/axios";

import * as Notifications from "expo-notifications";
import * as Permissions from "expo-notifications";
import { Platform, Alert } from "react-native";
import dayjs from "dayjs";
import { useLoading } from "../API/contextAPI";

const WalkthroughableView = walkthroughable(View);
const { width, height } = Dimensions.get("window");
const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;

function HomeContent({ navigation }: { navigation: any }) {
    const getQuote = async () => {
        try {
            const response = await customAxios.get("/quests/quote");
            return response.data.data; // 응답 구조에 맞게 조정
        } catch (error) {
            console.error("명언 가져오기 실패:", error);
            throw error;
        }
    };

    // 알림 권한 요청 함수
    async function requestNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      Alert.alert("알림 권한이 필요해요!");
      return false;
    }
  }
  return true;
}


    async function sendLocalNotification(title: string, body: string) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
            },
            trigger: null, // 즉시 알림
        });
    }
    const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "Home">>();
    const { showLoading, hideLoading } = useLoading();
    const [simpleScale, setSimpleScale] = useState(
        route.params?.simpleScale ?? ""
    );
    const { start, copilotEvents } = useCopilot();

    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        showLoading();
        const checkFirstVisitToday = async () => {
            await requestNotificationPermission();

            const today = dayjs().format("YYYY-MM-DD");
            const lastVisit = await AsyncStorage.getItem("lastHomeVisit");

            console.log("📆 Today:", today);
            console.log("📆 LastVisit:", lastVisit);
            const quoteData = await getQuote();

            if (lastVisit !== today) {

                try {
                    await sendLocalNotification("오늘의 명언", quoteData);
                } catch (error) {
                    console.error("❌ 명언 알림 전송 실패:", error);
                }
            } 
            hideLoading();
        };

        checkFirstVisitToday();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem("secondPasswordPassed", "false");
    }, []);

    useBlockBackHandler();

    const [copilotReady, setCopilotReady] = useState(false);

    useEffect(() => {
        setCopilotReady(true);
    }, []);

    useEffect(() => {
        const scale = route.params?.simpleScale;
        if (scale) {
            setSimpleScale(scale);
            const timer = setTimeout(() => {
                setSimpleScale(""); // 오버레이 닫기
                console.log("🎯 Copilot 시작");
                start(); // Copilot 가이드 시작
            }, 3000);

            return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
        }
    }, [copilotReady]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: "#0A814C" }} />
                <View style={{ flex: 1, backgroundColor: "#F9FAEC" }} />
            </View>
            <View style={StyleSheet.absoluteFill}>
                <View style={styles.headerWrapper}>
                    <CopilotStep
                        text={`여기는 캘린더야.\n한 달 동안 얼마나 많은 활동을 했는지\n한눈에 확인할 수 있어!`}
                        order={8}
                        name="calendarBadge"
                    >
                        <WalkthroughableView
                            style={{
                                position: "absolute",
                                top: hp(17),
                                right: wp(14),
                                zIndex: 3,
                            }}
                        >
                            <CalendarBadge
                                day={
                                    [
                                        "SUN",
                                        "MON",
                                        "TUE",
                                        "WED",
                                        "THU",
                                        "FRI",
                                        "SAT",
                                    ][new Date().getDay()]
                                }
                                date={new Date().getDate()}
                            />
                        </WalkthroughableView>
                    </CopilotStep>
                    <HeaderForest />
                    <HomeCircle style={styles.circle} />
                </View>

                <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={[
                        styles.scroll,
                        { paddingBottom: 0 },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    <CopilotStep
                        text={`여기는 마음 정원이야.\n앞서 소개한 기능들을 수행하면 물주기 쿠폰이 쌓여서\n너만의 클로버 정원을 키울 수 있어!`}
                        order={7}
                        name="statusBox"
                    >
                        <WalkthroughableView>
                            <StatusBox />
                        </WalkthroughableView>
                    </CopilotStep>
                    <View style={styles.buttonGroup}>
                        <CopilotStep
                            text={`실제 진단에 쓰이는 검사들을 직접 해보고,\n그 결과를 한눈에 확인할 수 있어.`}
                            order={1}
                            name="formalDiagnosis"
                        >
                            <WalkthroughableView>
                                <HomeButton
                                    icon="heart-pulse"
                                    title="마음 건강 진단"
                                    subtitle="지금, 내 마음 상태 알아보기"
                                    onPress={() =>
                                        nav.navigate("FormalDiagnosis")
                                    }
                                />
                            </WalkthroughableView>
                        </CopilotStep>

                        <CopilotStep
                            text={`단순한 일기? 아니지!\n여기서 너가 하루를 기록하면,\n그 기록을 럭키비키하게 바꿔줄게-!`}
                            order={2}
                            name="recordDiary"
                        >
                            <WalkthroughableView>
                                <HomeButton
                                    icon="book-open-variant"
                                    title="일기"
                                    subtitle="오늘 하루, 나의 마음 기록하기"
                                    onPress={() => nav.navigate("Record", {})}
                                />
                            </WalkthroughableView>
                        </CopilotStep>

                        <CopilotStep
                            text={`우울감을 날려버릴 다양한 퀘스트들이 있어.\n하루에 하나씩 도전하면서 너만의 루틴을 만들어봐!`}
                            order={3}
                            name="quest"
                        >
                            <WalkthroughableView>
                                 <HomeButton
                                    icon="target"
                                    title="퀘스트"
                                    subtitle="작은 실천 모아 나의 마음 건강 지키기"
                                    onPress={() => nav.navigate("Quest")}
                                />
                            </WalkthroughableView>
                        </CopilotStep>
                    </View>
                    <View>
                        <WalkthroughableView
                            style={styles.floatingButtonWrapper}
                        >
                            <FloatingButton />
                        </WalkthroughableView>
                    </View>
                </ScrollView>

                {simpleScale !== "" && (
                    <View
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            zIndex: 10,
                            backgroundColor: "rgba(0,0,0,0.3)",
                        }}
                    >
                        <View
                            style={[styles.simpleResultWrapper, { zIndex: 20 }]}
                        >
                            <SimpleResult simpleScale={simpleScale} />
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

export default function Home(props: { navigation: any }) {
    return (
        <CopilotProvider
            animated
            overlay="svg"
            backdropColor="rgba(0, 0, 0, 0.6)"
            tooltipComponent={TooltipComponent}
        >
            <HomeContent navigation={props.navigation} />
        </CopilotProvider>
    );
}
