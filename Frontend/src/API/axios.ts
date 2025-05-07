import axios from 'axios';

const customAxios = axios.create({
    baseURL: 'https://wuung.mori.space/',
    headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
    }
});

export default customAxios;