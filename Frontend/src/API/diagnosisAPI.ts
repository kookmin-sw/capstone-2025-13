import axios, {ApiResponseDTO} from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {refreshAccessToken} from "./signAPI";
import { AxiosResponse } from "axios";

export enum DiagnosisEnum {
    SIMPLE = 'SIMPLE',
    'PHQ-9' = 'PHQ-9',
    'GAD-7' = 'GAD-7',
    BDI = 'BDI'
}

export interface Diagnosis {
    id: number;
    type: DiagnosisEnum;
    title: string;
    description: string;
    questions: DiagnosisQuestions[],
    scale: DiagnosisScales[],
    createdAt: string;
    updatedAt: string;
}

export interface DiagnosisQuestions {
    seq: number;
    text: string;
    answers: DiagnosisAnswers[]
}

export interface DiagnosisAnswers {
    text: string;
    score: number;
}

export interface DiagnosisScales {
    start: number;
    scaleName: string;
    description: string;
}

export const fetchDiagnosisList = async () => {
    let token = await AsyncStorage.getItem("accessToken");

    if (!token) {
        console.log("❌ 로그인되지 않았습니다.");
        return null;
    }

    try {
        const response = await axios.get(
            "/diagnosis/list", {
                headers: {
                    "Authorization": `Bearer ${await AsyncStorage.getItem("accessToken")}`,
                }
            }
        ) as AxiosResponse<ApiResponseDTO<Diagnosis[]>>;
        return response.data?.data || [];
    } catch (error: any) {
        if (error.response?.status === 401) {
            console.log("🔄 토큰 만료됨, 재발급 시도");
            token = await refreshAccessToken();
            if (token) {
                const retryResponse = await axios.get(
                    "/diagnosis/list", {
                        headers: {
                            "Authorization": `Bearer ${await AsyncStorage.getItem("accessToken")}`,
                        }
                    }
                ) as AxiosResponse<ApiResponseDTO<Diagnosis[]>>;
            } else {
                console.error("❌ 토큰 재발급 실패로 요청 중단");
                return null;
            }
        } else {
            console.error("❌ axios 요청 실패:", error);
            return null;
        }
    }
};

export const fetchDiagnosisDetail = async (id: number) => {
    let token = await AsyncStorage.getItem("accessToken");

    if (!token) {
        console.log("❌ 로그인되지 않았습니다.");
        return null;
    }

    try {
        const response = await axios.get(`/diagnosis/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ) as AxiosResponse<ApiResponseDTO<Diagnosis>>;
        return response.data?.data || null;
    } catch (error: any) {
        if (error.response?.status === 401) {
            console.log("🔄 토큰 만료됨, 재발급 시도");
            token = await refreshAccessToken();
            if (token) {
                try {
                    const retryResponse = await axios.get(`/diagnosis/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    ) as AxiosResponse<ApiResponseDTO<Diagnosis>>;
                } catch (retryError: any) {
                    console.error("❌ 재시도 실패:", retryError);
                    return null;
                }
            } else {
                console.error("❌ 토큰 재발급 실패로 요청 중단");
                return null;
            }
        } else {
            console.error("❌ 요청 실패:", error);
            return null;
        }
    }
};
