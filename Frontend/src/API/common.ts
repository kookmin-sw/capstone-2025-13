import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "./axios";
import {AxiosResponse} from "axios";

export default interface ApiResponseDTO<T> {
    error: boolean;
    message: string;
    code: number;
    data: T;
}

export interface RefreshAccessTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export const refreshAccessToken = async (): Promise<string | undefined> => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    console.log("📦 현재 refreshToken:", refreshToken);

    if (!refreshToken) {
        console.error("❗ refreshToken이 없습니다. 재발급 불가");

        await Promise.all([
            AsyncStorage.removeItem("accessToken"),
            AsyncStorage.removeItem("refreshToken")
        ]);
        return undefined;
    }

    try {
        console.log("📡 토큰 재발급 요청 시작");
        const res = await axios.post(
            "/auth/refresh",
        ) as AxiosResponse<ApiResponseDTO<RefreshAccessTokenResponse>>;

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
        return undefined;
    }
};