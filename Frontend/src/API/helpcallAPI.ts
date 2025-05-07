import axios from 'axios';

export const getCenters = async (page = 1, rows = 100) => {
    const SERVICE_KEY = "W6m5fMssN9qsVxsxz3JD%2BmpakcCWijQ8VJUyqDEIP4MaRQyWvzl4%2FgUdTl4MhZItcRMT9PadTG1JWcuUhAbOTg%3D%3D"; // 인코딩된 키
    const url = `http://api.data.go.kr/openapi/tn_pubr_public_hp_cnter_api?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=100&type=json`;

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
