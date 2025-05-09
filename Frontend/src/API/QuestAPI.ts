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

