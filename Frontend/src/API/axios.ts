import axios from 'axios';
// @ts-ignore
import { EXPO_PUBLIC_API_URL } from '@env';

const createdAxios = axios.create({
    baseURL: EXPO_PUBLIC_API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

export interface ApiResponseDTO<T> {
    error: boolean;
    message: string;
    code: number;
    data: T;
}

export default createdAxios;