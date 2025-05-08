import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosResponse } from "axios";
import ApiResponseDTO, { RefreshAccessTokenResponse } from "./common";
import axios from "./axios";

export type SignOutResponse = string;

// 로그인
export const signIn = async (email: string, password: string) => {
    try {
        const response = await axios.post("/auth/login", {
            email,
            password
        }) as AxiosResponse<ApiResponseDTO<RefreshAccessTokenResponse>>;

        return response.data.data;
    } catch (error) {
        console.error("Error during sign-in:", error);
        throw error;
    }
};

// 로그아웃
export const signOut = async (accessToken: string, refreshToken: string) => {
    try {
        const response = await axios.post("/auth/logout", {
            accessToken,
            refreshToken
        }) as AxiosResponse<ApiResponseDTO<SignOutResponse>>;

        const data = response.data.data;

        // Clear tokens from AsyncStorage
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");

        return true;
    } catch (error) {
        console.error("Error during sign-out:", error);
        throw error;
    }
};

// 회원가입
export const signUp = async (
    email: string,
    password: string,
    nickname: string,
    birthDate: string,
    gender: string
) => {
    try {
        const upperGender = gender.toUpperCase();

        const response = await axios.post("/auth/signup", {
            email,
            password,
            gender: upperGender,
            user_name: nickname,
            birth_date: birthDate,
        }) as AxiosResponse<ApiResponseDTO<RefreshAccessTokenResponse>>;

        return response.data.data;
    } catch (error) {
        console.error("Error during sign-up:", error);
        throw error;
    }
};
