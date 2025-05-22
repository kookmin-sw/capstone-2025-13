import axios from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiResponseDTO, { refreshAccessToken, } from "./common";

export enum DiagnosisTypeEnum {
  "Simple" = "Simple",
  "PHQ-9" = "PHQ-9",
  "GAD-7" = "GAD-7",
  "BDI" = "BDI"
}
export interface DiagnosisList {
  id: number;
  type: DiagnosisTypeEnum;
  title: string;
  description: string;
  questions: DiagnosisQuestion[];
  scale: DiagnosisScale[];
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosisQuestion {
  seq: number;
  text: string;
  answers: DiagnosisAnswers[]; 
}

export interface DiagnosisAnswers {
  text: string;
  score: number;
}

export interface DiagnosisScale {
  start: number;
  scaleName: string;
  description: string;
}

export interface DiagnosisQuestion {
  seq: number;
  text: string;
  answers: DiagnosisAnswers[];
}

export interface DiagnosisAnswers {
  text: string;
  score: number;
}

export interface DiagnosisScale {
  start: number;
  scaleName: string;
  description: string;
}
export interface DiagnosisResult {
    id: string;
    diagnosisId: number;
    result: number;
    scale: number;
    createdAt: string;
    updatedAt: string;
}

export interface DiagnosisSpecificResult {
    id: string;
    diagnosisId: number;
    result: number;
    scale: number;
    scale_description: ScaleDescription[];
    createdAt: string;
    updatedAt: string;
}
interface ScaleDescription {
    start: number;
    scaleName: string;
    description: string;
}


const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) throw new Error("❌ 로그인되지 않았습니다.");
  return { Authorization: `Bearer ${token}` };
};

const handleAuthRequest = async <T>(requestFn: () => Promise<T>): Promise<T | null> => {
  try {
    return await requestFn();
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log("🔄 토큰 만료됨, 재발급 시도");
      const newToken = await refreshAccessToken();
      if (newToken) {
        try {
          return await requestFn();
        } catch (retryError) {
          console.error("❌ 재시도 실패:", retryError);
        }
      } else {
        console.error("❌ 토큰 재발급 실패로 요청 중단");
      }
    } else {
      console.error("❌ 요청 실패:", error);
    }
    return null;
  }
};

export const fetchDiagnosisList = async (): Promise<DiagnosisList[] | null> => {
  return handleAuthRequest(async () => {
    const headers = await getAuthHeaders();
    const { data } = await axios.get<ApiResponseDTO<DiagnosisList[]>>("/diagnosis/list", { headers });
    return data.data;
  });
};

export const fetchDiagnosisDetail = async (id: number): Promise<DiagnosisList | null> => {
  return handleAuthRequest(async () => {
    const headers = await getAuthHeaders();
    const { data } = await axios.get<ApiResponseDTO<DiagnosisList>>(`/diagnosis/${id}`, { headers });
    return data.data;
  });
};


export const putDiagnosisResult = async (id: number, scale: number, result: number) => {
  return handleAuthRequest(async () => {
    const headers = await getAuthHeaders();
    const body = { id, scale, result };
    console.log(body);
    const { data } = await axios.put<ApiResponseDTO<DiagnosisList>>("/diagnosis/submit", body, { headers });
    return data.data;
  });
};


export const getDiagnosisResult = async (start: string): Promise<DiagnosisResult[] | null> => {
 return handleAuthRequest(async () => {
    const headers = await getAuthHeaders();
    const { data } = await axios.get<ApiResponseDTO<DiagnosisResult[]>>(
      `/diagnosis/results?start=${start}`,
      { headers }
    );
    return data.data;
  });
};

export const getDiagnosisSpecificResult = async (
  resultId: string | number
): Promise<DiagnosisSpecificResult | null> => {
  console.log("resultId", resultId);
  return handleAuthRequest(async () => {
    const headers = await getAuthHeaders();
    const { data } = await axios.get<ApiResponseDTO<DiagnosisSpecificResult>>(
      `/diagnosis/result/${resultId}`,
      { headers }
    );
    return data.data;
  });
};
