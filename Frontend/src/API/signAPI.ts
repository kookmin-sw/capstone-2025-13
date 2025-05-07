import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {ApiResponseDTO} from "./axios";
import {AxiosResponse} from "axios";

interface SignInResponse {
    accessToken: string;
    refreshToken: string;
}

export const refreshAccessToken = async (): Promise<string> => {
    try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        const response = await axios.post("/auth/refresh", { refreshToken }, {}) as AxiosResponse<ApiResponseDTO<SignInResponse>>

        if (response.data.error) {
            throw new Error("Failed to refresh tokens: " + response.data.message);
        }

        const data = response.data.data;

        await AsyncStorage.setItem("accessToken", data.accessToken);
        await AsyncStorage.setItem("refreshToken", data.refreshToken);

        return data.accessToken;
    } catch (error) {
        console.error("Error refreshing tokens:", error);
        throw error;
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        const response = await axios.post("/auth/login", {
            email,
            password
        }) as AxiosResponse<ApiResponseDTO<SignInResponse>>

        console.log(response.data)

        if (response.data.error) {
            throw new Error("Failed to login: " + response.data.message);
        }

        const data = response.data.data;

        await AsyncStorage.setItem("accessToken", data.accessToken);
        await AsyncStorage.setItem("refreshToken", data.refreshToken);

        return data;
    } catch (error) {
        console.error("Error during sign-in:", error);
        throw error;
    }
};

export const signOut = async (accessToken: string, refreshToken: string): Promise<boolean> => {
    try {
        const response = await axios.post("/auth/logout", { accessToken, refreshToken }, {}) as AxiosResponse<ApiResponseDTO<string>>

        if (response.data.error) {
            throw new Error("Failed to refresh tokens: " + response.data.message);
        }

        // Clear tokens from AsyncStorage
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");

        return true;
    } catch (error) {
        console.error("Error during sign-out:", error);
        throw error;
    }
};

export const signUp = async (
    email: string,
    password: string,
    nickname: string,
    birthDate: string,
    gender: string
) => {
    try {
        const response = await axios.post("/auth/signup",
            {
                email,
                password,
                gender: gender.toUpperCase(),
                user_name: nickname,
                birth_date: birthDate,
            }, {}
        ) as AxiosResponse<ApiResponseDTO<SignInResponse>>

        if (response.data.error) {
            throw new Error("Network response was not ok: " + response.data.message);
        }

        const data = response.data.data;

        await AsyncStorage.setItem("accessToken", data.accessToken);
        await AsyncStorage.setItem("refreshToken", data.refreshToken);

        return data;
    } catch (error) {
        console.error("Error during sign-up:", error);
        throw error;
    }
};
