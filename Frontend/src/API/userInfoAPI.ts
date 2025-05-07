import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {ApiResponseDTO} from "./axios";
import {AxiosResponse} from "axios";

export enum GenderEnum {
    MALE = "MALE",
    FEMALE = "FEMALE",
    THIRD_GENDER = "THIRD_GENDER",
    UNKNOWN = "UNKNOWN",
}

export interface UserInfoResponse {
    id: number;
    email: string;
    username: string;
    birthDate: string;
    gender: GenderEnum;
    profile: string;
    createdAt: string;
    updatedAt: string;
    roles: string[];
}

export interface UpdateUserResponse {
    email: string;
    userName: string;
    gender: GenderEnum;
    birthDate: string;
}

export const userInfoUpdate = async (password: string | null, nickname: string | null, birthDate: string | null, gender: string | null) => {
    console.log("userInfoUpdate called with:", { password, nickname, birthDate, gender });
    try {
        const response = await axios.post("/auth/update",
        {
            password,
            gender: gender?.toUpperCase() || null,
            user_name: nickname,
            birth_date: birthDate
        },
        {
            headers: {
                "Authorization": `Bearer ${await AsyncStorage.getItem("accessToken")}`,
            }
        }) as AxiosResponse<ApiResponseDTO<UpdateUserResponse>>

        if (response.data.error) {
            throw new Error("Network response was not ok: " + response.data.message);
        }

        return response.data.data
    } catch (error) {
        console.error("Error during user info update:", error);
        throw error;
    }

}

export const getUserInfo = async () => {
    try {
        const response = await axios.get("/auth/me", {
            headers: {
                "Authorization": `Bearer ${await AsyncStorage.getItem("accessToken")}`,
            },
        }) as AxiosResponse<ApiResponseDTO<UserInfoResponse>>

        if (response.data.error) {
            throw new Error("Network response was not ok: " + response.data.message);
        }

        return response.data.data
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
      const response = await axios.put("/auth/profile", formData, {
        headers: {
            "Authorization": `Bearer ${await AsyncStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data"
        }
      }) as AxiosResponse<ApiResponseDTO<UserInfoResponse>>
  
      if (response.data.error) {
        throw new Error("Network response was not ok: " + response.data.message);
      }
  
      return response.data.data;
    } catch (error) {
      console.error("Error during profile image update:", error);
      throw error;
    }
  };
  