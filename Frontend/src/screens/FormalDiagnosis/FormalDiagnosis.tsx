// 🔄 토큰 갱신 함수
const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    try {
        const res = await axios.post("https://wuung.mori.space/auth/refresh", {
            refreshToken: refreshToken,
        });
        const { accessToken: newAccessToken } = res.data.data;
        await AsyncStorage.setItem("accessToken", newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error("❌ 토큰 재발급 실패:", error);
        return null;
    }
};

import React, { use } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import axios from "axios";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HeaderTitle from "../../components/HeaderTitle";
import EmotionChartBox from "../../components/EmotionChartBox";
import SectionLabel from "../../components/SectionLabel";
import MethodCard from "../../components/MethodCard";
import styles from "../../styles/formalDialogueStyles";

export default function FormalDiagnosis() {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [diagnosisList, setDiagnosisList] = useState([]);

    useEffect(() => {
        const fetchDiagnosisList = async () => {
            try {
                let token = await AsyncStorage.getItem("accessToken");
                if (!token) {
                    console.log("❌ 로그인되지 않았습니다.");
                    return;
                }
                console.log("✅ 로그인 상태입니다. 토큰:", token);

                let response;
                try {
                    response = await axios.get(
                        "https://wuung.mori.space/diagnosis/list",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } catch (error: any) {
                    if (error.response?.status === 401) {
                        console.log("🔄 토큰 만료됨, 재발급 시도");
                        token = await refreshAccessToken();
                        if (token) {
                            response = await axios.get(
                                "https://wuung.mori.space/diagnosis/list",
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                        } else {
                            console.log("❌ 토큰 재발급 실패로 요청 중단");
                            return;
                        }
                    } else {
                        throw error;
                    }
                }

                console.log("✅ axios 응답:", response.data);
                setDiagnosisList(response.data?.data || []);
            } catch (axiosError) {
                console.error("❌ axios 요청 실패:", axiosError);
            }

            try {
                const token = await AsyncStorage.getItem("accessToken");
                const fetchResponse = await fetch(
                    "https://wuung.mori.space/diagnosis/list",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await fetchResponse.json();
                console.log("📦 fetch 응답:", data);
            } catch (fetchError) {
                console.error("❌ fetch 요청 실패:", fetchError);
            }
        };
        fetchDiagnosisList();
    }, []);

    return (
        <View style={styles.container}>
            <HeaderTitle title="마음 건강 진단" />
            <EmotionChartBox subtitle="지난 2주 간 나의 마음 변화 흐름" />
            <ScrollView contentContainerStyle={styles.scroll}>
                <SectionLabel text="이런 방법들이 있어요" />
                {diagnosisList.map((item) => (
                    <MethodCard
                        key={item.id}
                        label={item.title}
                        onPress={() => {
                            console.log(`${item.title} 버튼 클릭됨`);
                            if (item.title === "BDI 기반 정식 검사") {
                                navigation.navigate("FormalDiagnosisSurvey");
                            }
                        }}
                    />
                ))}
            </ScrollView>
        </View>
    );
}
