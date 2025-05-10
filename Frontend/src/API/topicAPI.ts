import customAxios from "./axios";
import ApiResponseDTO from "./common";

export enum TopicFeedbackStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

export interface TopicFeedbackResponse {
    id: string;
    data: string;
    aiFeedback: string;
    status: TopicFeedbackStatus;
}

export const getTodayTopic = async () => {
    const response = await customAxios.get("/topic/me");
    return response.data.data;
};

export const createTopic = async () => {
    const response = await customAxios.put("/topic/create", {
        rate: 75,
        data: "",
    });
    return response.data.data;
};

export const submitFeedback = async (topicId: string, answer: string) => {
    const response = await customAxios.put(`/topic/feedback/${topicId}`, {
        data: answer,
    });
    return response.data.data; // topicFeedbackId
};

export const getFeedbackById = async (topicFeedbackId: string) => {
    const response = await customAxios.get<ApiResponseDTO<TopicFeedbackResponse>>(
        `/topic/feedback/${topicFeedbackId}`
    );
    return response.data.data;
};

export const getTopicDetails = async (topicId: string) => {
    const response = await customAxios.get(`/topic/${topicId}`);
    return response.data.aiFeedback;
};
