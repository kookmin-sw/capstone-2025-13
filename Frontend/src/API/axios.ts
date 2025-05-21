import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const customAxios = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

// 👉 요청 시 accessToken 자동 첨부
customAxios.interceptors.request.use(async (config) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// 👉 응답에서 401이면 refresh 시도 후 재요청
customAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem("refreshToken");

                const res = await axios.post(`${apiUrl}/auth/refresh`, {
                    refreshToken: refreshToken,
                });

                const newAccessToken = res.data.data.accessToken;
                await AsyncStorage.setItem("accessToken", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return customAxios(originalRequest);
            } catch (refreshError) {
                console.error("❌ 토큰 재발급 실패:", refreshError);
                await logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

const logout = async () => {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
    console.log("🚪 로그아웃 처리 완료");
};

export default customAxios;
