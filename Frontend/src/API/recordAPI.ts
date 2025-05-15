import customAxios from "./axios";

export const createRecord = async (data:string) => {
    const response = await customAxios.put("/records/create", {
        data: `${data}`,
    });
    return response.data.data;
};

export const getRecord = async (recordId:string) => {
    const response = await customAxios.get(`/records/{recordId}?recordId=${recordId}`, {});
    return response.data.data;
};

export const postRecord = async (recordId:string, rate: number, comment:string) => {
    const response = await customAxios.post(`/records/${recordId}`, {
        rate, comment
    });
    return response.data.data;
};

export const getRecordMe = async (date:string) => {
    const response = await customAxios.get(`/records/me?date=${date}`, {});
    return response.data.data;
};