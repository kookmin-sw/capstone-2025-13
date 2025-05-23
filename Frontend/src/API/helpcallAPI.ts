import axios from 'axios';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const getCenters = async (page = 1, rows = 100) => {
    const SERVICE_KEY = process.env.SERVICE_KEY;
    const url = "http://api.data.go.kr/openapi/tn_pubr_public_hp_cnter_api";

    try {
        const response = await axios.get(url, {
            params: {
                serviceKey: SERVICE_KEY,
                pageNo: page,
                numOfRows: rows,
                type: 'json'
            }
        });

        return response.data.response?.body?.items || [];
    } catch (error) {
        if (error instanceof Error) {
            console.error('API 호출 오류:', error.message);
        } else {
            console.error('API 호출 오류:', error);
        }
        throw error;
    }
};
