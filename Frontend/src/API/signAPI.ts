import AsyncStorage from "@react-native-async-storage/async-storage";
import {AxiosResponse} from "axios";
import ApiResponseDTO, {RefreshAccessTokenResponse} from "./common";
import axios from "./axios";

export type SingOutResponse = string;

export const signIn = async (email: string, password: string) => {
    try {
        const response = await axios.post("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify({ email, password }),
        }) as AxiosResponse<ApiResponseDTO<RefreshAccessTokenResponse>>

        return response.data.data
    } catch (error) {
        console.error("Error during sign-in:", error);
        throw error;
    }
};

export const signOut = async (accessToken: string, refreshToken: string) => {
    try {
        const response = await axios.post("/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken, refreshToken }),
        }) as AxiosResponse<ApiResponseDTO<SingOutResponse>>;

        const data = response.data.data;

        // Clear tokens from AsyncStorage
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");

        return data;
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
        const response = await axios.post("/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                gender: gender.toUpperCase(),
                user_name: nickname,
                birth_date: birthDate,
            }),
        }) as AxiosResponse<ApiResponseDTO<RefreshAccessTokenResponse>>;

        return response.data.data;
    } catch (error) {
        console.error("Error during sign-up:", error);
        throw error;
    }
};
