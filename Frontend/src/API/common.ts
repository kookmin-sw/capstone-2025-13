import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "./axios";
import { AxiosResponse } from "axios";

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

export const logout = async () => {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
    const accessToken = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    console.log("🚪 로그아웃 처리 완료");
    console.log("🧪 accessToken 상태:", accessToken);
    console.log("🧪 refreshToken 상태:", refreshToken);
};

export const refreshAccessToken = async (): Promise<string | undefined> => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    console.log("📦 현재 refreshToken:", refreshToken);

    if (!refreshToken) {
        console.error("❗ refreshToken이 없습니다. 재발급 불가");
        await logout();
        return undefined;
    }

    try {
        console.log("📡 토큰 재발급 요청 시작");

        const res = await axios.post<
            ApiResponseDTO<RefreshAccessTokenResponse>
        >(
            "/auth/refresh",
            { refreshToken }, // 👈 body에 refreshToken 포함
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            res.data.data;

        await AsyncStorage.multiSet([
            ["accessToken", newAccessToken],
            ["refreshToken", newRefreshToken],
        ]);

        console.log("✅ 새 토큰 저장 완료:", {
            newAccessToken,
            newRefreshToken,
        });
        return newAccessToken;
    } catch (error: any) {
        console.error(
            "❌ 토큰 재발급 실패:",
            error?.response?.data || error.message
        );
        await logout(); // 🔒 강제 로그아웃 처리
        // TODO: 필요 시 로그인 화면으로 네비게이션 이동 로직 추가
        return undefined;
    }
};
