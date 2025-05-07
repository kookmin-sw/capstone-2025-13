import axios from 'axios';

const createdAxios = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
});

export default createdAxios;