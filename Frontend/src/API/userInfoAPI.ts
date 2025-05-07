import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "./axios";
import {AxiosResponse} from "axios";
import ApiResponseDTO from "./common";

export enum GenderEnum {
    MALE = "MALE",
    FEMALE = "FEMALE",
    THIRD_GENDER = "THIRD_GENDER",
    UNKNOWN = "UNKNOWN"
}

export interface UserInfoResponse {
    id: string;
    email: string;
    username: string;
    birthDate: string;
    gender: GenderEnum;
    profile: string | undefined;
    createdAt: string;
    updatedAt: string;
    roles: string[]
}

export interface UserProfileUpdateResponse {
    email: string,
    userName: string,
    gender: GenderEnum,
    "birthDate": "2025-05-07T10:40:24.355Z"
}

export const userInfoUpdate = async (password: string | null, nickname: string | null, birthDate: string | null, gender: string | null) => {
    console.log("userInfoUpdate called with:", { password, nickname, birthDate, gender });
    try {
        const response = await axios.post("https://wuung.mori.space/auth/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "Authorization": `Bearer ${await AsyncStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({  
                password,
                gender: gender?.toUpperCase() || null, 
                user_name: nickname,
                birth_date: birthDate, }),
        }) as AxiosResponse<ApiResponseDTO<UserProfileUpdateResponse>>

        return response.data.data;
    } catch (error) {
        console.error("Error during user info update:", error);
        throw error;
    }

}

export const getUserInfo = async () => {
    try {
        const response = await axios.get("/auth/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "Authorization": `Bearer ${await AsyncStorage.getItem("accessToken")}`,
            },
        }) as AxiosResponse<ApiResponseDTO<UserInfoResponse>>

        return response.data.data;
    } catch (error) {
        console.error("Error during user info update:", error);
        throw error;
    }

}

export const putProfileImg = async (profileImage: { uri: string; name: string; type: string }) => {
    console.log("putProfileImg called with:", profileImage);
    const formData = new FormData();
    formData.append("multipartFile", {
        uri: profileImage.uri,
        name: profileImage.name,
        type: profileImage.type,
      } as any);
  
    try {
      const response = await axios.put("https://wuung.mori.space/auth/profile", {
        method: "PUT",
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${await AsyncStorage.getItem("accessToken")}`,
        },
        body: formData,
      }) as AxiosResponse<ApiResponseDTO<UserInfoResponse>>;

      return response.data.data;
    } catch (error) {
      console.error("Error during profile image update:", error);
      throw error;
    }
  };
  