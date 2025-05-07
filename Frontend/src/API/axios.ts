import axios from 'axios';

const apiUrl = process.env.API_URL;

const customAxios = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
    }
});

export default customAxios;