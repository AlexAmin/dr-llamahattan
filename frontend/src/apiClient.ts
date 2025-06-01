import axios from 'axios';
import {useAppStore} from "./stores/app.ts";

export const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    config.headers.userId = useAppStore().activeUserId
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
