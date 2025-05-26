import React, { useEffect, useState } from "react";
import {
    View,
    ScrollView,
    SafeAreaView,
    Pressable,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import useBlockBackHandler from "../hooks/useBlockBackHandler";
import TooltipComponent
    from "../components/TooltipComponent ";
import {
    CopilotStep,
    walkthroughable,
    useCopilot,
    CopilotProvider,
} from "react-native-copilot";

const WalkthroughableView = walkthroughable(View);

function HomeContent({ navigation }: { navigation: any }) {
    const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "Home">>();
    const [simpleScale, setSimpleScale] = useState(route.params?.simpleScale ?? "");
    const { start } = useCopilot();

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

            // 5초 후 오버레이 닫고 Copilot start
            const timer = setTimeout(() => {
                setSimpleScale(""); // 오버레이 닫기
                console.log("🎯 Copilot 시작");
                start();            // Copilot 가이드 시작
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
                        text="나의 이력을 볼 수 있어요!"
                        order={7}
                        name="calendarBadge"
                    >
                        <WalkthroughableView
                            style={{
                                position: "absolute",
                                top: 155,
                                right: 55,
                                zIndex: 3,
                            }}
                        >
                            <CalendarBadge
                                day={["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date().getDay()]}
                                date={new Date().getDate()}
                            />
                        </WalkthroughableView>
                    </CopilotStep>
                    <HeaderForest />
                    <HomeCircle style={styles.circle} />
                </View>

                <ScrollView
                    contentContainerStyle={[styles.scroll, { paddingBottom: 0 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <CopilotStep
                        text="나만의 마음정원을 키워봐요!"
                        order={6}
                        name="statusBox"
                    >
                        <WalkthroughableView>
                            <StatusBox />
                        </WalkthroughableView>
                    </CopilotStep>
                    <View style={styles.buttonGroup}>
                        <CopilotStep
                            text="지금, 내 마음 상태를 진단해보세요!"
                            order={1}
                            name="formalDiagnosis"
                        >
                            <WalkthroughableView>
                                <HomeButton
                                    icon="heart-pulse"
                                    title="마음 건강 진단"
                                    subtitle="지금, 내 마음 상태 알아보기"
                                    onPress={() => nav.navigate("FormalDiagnosis")}
                                />
                            </WalkthroughableView>
                        </CopilotStep>

                        <CopilotStep
                            text="오늘 하루, 나의 마음 기록하기"
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
                            text="작은 실천으로 마음 건강 지키기!"
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
                        <CopilotStep
                            text="도움이 필요하면 불러주세요!"
                            order={4}
                            name="floatingButton"
                        >
                            <WalkthroughableView style={styles.floatingButtonWrapper}>
                                <FloatingButton />
                            </WalkthroughableView>
                        </CopilotStep>
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
                        <Pressable style={{ flex: 1 }} onPress={() => setSimpleScale("")} />
                        <View style={[styles.simpleResultWrapper, { zIndex: 20 }]}>
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
