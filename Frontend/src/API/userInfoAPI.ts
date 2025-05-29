// 유저 프로필 이미지 삭제
export const deleteProfileImg = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");

    try {
        const response = await axios.delete(
            "https://wuung.mori.space/auth/profile",
            {
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        console.log("프로필 이미지 삭제 성공:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("프로필 이미지 삭제 실패:", error);
        throw error;
    }
};
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "./axios";
import { AxiosResponse } from "axios";
import ApiResponseDTO from "./common";
import Toast from "react-native-toast-message";
import { useCoupon } from "./potAPI";

export enum GenderEnum {
    MALE = "MALE",
    FEMALE = "FEMALE",
    THIRD_GENDER = "THIRD_GENDER",
    UNKNOWN = "UNKNOWN",
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
    roles: string[];
}

export interface UserProfileUpdateResponse {
    email: string;
    userName: string;
    gender: GenderEnum;
    birthDate: string;
}

// 유저 정보 수정
export const userInfoUpdate = async (
    password: string | null,
    nickname: string | null,
    birthDate: string | null,
    gender: string | null
) => {
    console.log("userInfoUpdate called with:", {
        password,
        nickname,
        birthDate,
        gender,
    });

    const accessToken = await AsyncStorage.getItem("accessToken");

    try {
        const response = (await axios.post(
            "https://wuung.mori.space/auth/update",
            {
                password,
                gender: gender?.toUpperCase() || null,
                user_name: nickname,
                birth_date: birthDate,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )) as AxiosResponse<ApiResponseDTO<UserProfileUpdateResponse>>;

        return response.data.data;
    } catch (error) {
        console.error("Error during user info update:", error);
        throw error;
    }
};

// 유저 정보 조회
export const getUserInfo = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");

    try {
        const response = (await axios.get("/auth/me", {
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        })) as AxiosResponse<ApiResponseDTO<UserInfoResponse>>;

        return response.data.data;
    } catch (error) {
        console.error("Error during user info get:", error);
        throw error;
    }
};

// 프로필 이미지 업로드
export const putProfileImg = async (profileImage: {
    uri: string;
    name: string;
    type: string;
    size?: number;
}) => {
    console.log("putProfileImg called with:", profileImage);
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (profileImage.size && profileImage.size > MAX_SIZE) {
        Toast.show({
            type: "error",
            text1: "저장 실패",
            text2: "이미지 크기는 5MB를 초과할 수 없습니다.",
            position: "bottom",
        });
        return;
    }

    const accessToken = await AsyncStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("multipartFile", {
        uri: profileImage.uri,
        name: profileImage.name,
        type: profileImage.type,
    } as any);

    try {
        const response = (await axios.put(
            "https://wuung.mori.space/auth/profile",
            formData,
            {
                headers: {
                    accept: "application/json",
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )) as AxiosResponse<ApiResponseDTO<UserInfoResponse>>;

        return response.data.data;
    } catch (error) {
        console.error("Error during profile image update:", error);
        throw error;
    }
};

// 로그아웃 핸들러
export const handleLogout = async () => {
    try {
        const localCoupon = await AsyncStorage.getItem("localCoupon");
        const couponCount = localCoupon ? Number(localCoupon) : 0;

        if (couponCount > 0) {
            await useCoupon(couponCount); // ✅ 서버에 반영
            await AsyncStorage.setItem("localCoupon", "0"); // ✅ 초기화
        }

        await AsyncStorage.removeItem("accessToken");
        Toast.show({
            type: "success",
            text1: "로그아웃 완료",
            text2: "정상적으로 로그아웃되었습니다.",
            position: "bottom",
        });
    } catch (error) {
        console.error("로그아웃 중 오류 발생:", error);
    }
};
