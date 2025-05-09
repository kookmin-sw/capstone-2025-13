import axios from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiResponseDTO, { refreshAccessToken } from "./common";

export enum QuestType {
    "MEDITATE" = "MEDITATE",
    "ACTIVITY" = "ACTIVITY",
    "EMOTION" = "EMOTION"
}

export interface Quest {
    id : number, //"id": 1,
    type : QuestType, //"type": "EMOTION",
    name : String, //"name": "웃어보기!",
    description : String, //"description": "활짝 5초동안 웃어보세요!",
    target : number, //"target": 5,
    createdAt : String, //"createdAt": "2025-04-19T17:36:12",
    updatedAt : String, // "updatedAt": "2025-04-19T17:36:17"
}

export interface UserQuest {
    id : String, //"id": "cf7fa6fd-c4a0-49e4-b234-c978e486ee14",
    name : String, //"name": "웃어보기!",
    description : String, //"description": "활짝 5초동안 웃어보세요!",
    type : QuestType, //"type": "EMOTION",
    progress : number, //"progress": 0,
    target : number, //"target": 5,
    createdAt : String, //"createdAt": "2025-05-09T14:26:50.321421",
    updatedAt : String//"updatedAt": "2025-05-09T14:26:50.321423"
}

export interface QuestList {
    quests : Quest[]
}

export interface UserQuestList {
    userQuests : UserQuest[]
}

// 내보내기 선언 안 되어 있어서 그냥 복붙했어요 export 키워드 붙이면 import문으로 가져와도 무관
const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) throw new Error("❌ 로그인되지 않았습니다.");
    return { Authorization: `Bearer ${token}` };
};

// 이것도 마찬가지.
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

// 데이터 가져오는 코드 예시
export const fecthQuestList = async (): Promise<QuestList[] | null> => {
    return handleAuthRequest(async () => {
        const headers = await getAuthHeaders();
        const { data } = await axios.get<ApiResponseDTO<QuestList[]>>("/quests/me", { headers });
        return data.data;
    });
};

