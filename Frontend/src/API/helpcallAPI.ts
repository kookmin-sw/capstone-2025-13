import customAxios from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiResponseDTO from "./common";

const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) throw new Error("❌ 로그인되지 않았습니다.");
    return { Authorization: `Bearer ${token}` };
};

export const getCenters = async (latitude: Number, longitude: Number, distance: Number = 100) => {
    try {
        const headers = await getAuthHeaders();
        const data = await customAxios.get<ApiResponseDTO<{}[]>>(
        `/help/hospital?latitude=${latitude}&longitude=${longitude}&distance=${distance}`, {
            headers
        });

        return data.data.data
    } catch (error) {
        if (error instanceof Error) {
            console.error('API 호출 오류:', error.message);
        } else {
            console.error('API 호출 오류:', error);
        }
        throw error;
    }
};