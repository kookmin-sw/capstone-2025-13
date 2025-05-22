import customAxios from "./axios";

export const getBehaviors = async (date: string) => {
    const response = await customAxios.get(`/etc/behavior?date=${date}`);
    return response.data.data;
};


export const getBehaviorsSummary = async (date: string) => {
    const response = await customAxios.get(`/etc/behavior/summary?date=${date}`);
    return response.data.data;
};
