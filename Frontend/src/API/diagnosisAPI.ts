import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    console.log("📦 현재 refreshToken:", refreshToken);

    if (!refreshToken) {
        console.error("❗ refreshToken이 없습니다. 재발급 불가");
        return null;
    }

    try {
        console.log("📡 토큰 재발급 요청 시작");
        const res = await axios.post(
            "https://wuung.mori.space/auth/refresh",
            { refreshToken },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ 토큰 재발급 응답 전체:", res.data);

        const { accessToken: newAccessToken } = res.data.data;
        await AsyncStorage.setItem("accessToken", newAccessToken);
        console.log("💾 새 accessToken 저장 완료:", newAccessToken);
        return newAccessToken;
    } catch (error: any) {
        console.error("❌ 토큰 재발급 실패:");
        console.error("🔍 요청 payload:", { refreshToken });
        console.error("🔍 요청 헤더:", {
            "Content-Type": "application/json",
        });
        console.error(
            "🔍 전체 에러 응답:",
            JSON.stringify(error.response?.data || error.message, null, 2)
        );
        return null;
    }
};

export const fetchDiagnosisList = async () => {
    let token = await AsyncStorage.getItem("accessToken");

    if (!token) {
        console.log("❌ 로그인되지 않았습니다.");
        return null;
    }

    try {
        const response = await axios.get(
            "https://wuung.mori.space/diagnosis/list",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data?.data || [];
    } catch (error: any) {
        if (error.response?.status === 401) {
            console.log("🔄 토큰 만료됨, 재발급 시도");
            token = await refreshAccessToken();
            if (token) {
                const retryResponse = await axios.get(
                    "https://wuung.mori.space/diagnosis/list",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                return retryResponse.data?.data || [];
            } else {
                console.error("❌ 토큰 재발급 실패로 요청 중단");
                return null;
            }
        } else {
            console.error("❌ axios 요청 실패:", error);
            return null;
        }
    }
};

export const fetchDiagnosisDetail = async (id: number) => {
    let token = await AsyncStorage.getItem("accessToken");

    if (!token) {
        console.log("❌ 로그인되지 않았습니다.");
        return null;
    }

    try {
        const response = await axios.get(
            `https://wuung.mori.space/diagnosis/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data?.data || null;
    } catch (error: any) {
        if (error.response?.status === 401) {
            console.log("🔄 토큰 만료됨, 재발급 시도");
            token = await refreshAccessToken();
            if (token) {
                try {
                    const retryResponse = await axios.get(
                        `https://wuung.mori.space/diagnosis/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    return retryResponse.data?.data || null;
                } catch (retryError: any) {
                    console.error("❌ 재시도 실패:", retryError);
                    return null;
                }
            } else {
                console.error("❌ 토큰 재발급 실패로 요청 중단");
                return null;
            }
        } else {
            console.error("❌ 요청 실패:", error);
            return null;
        }
    }
};
