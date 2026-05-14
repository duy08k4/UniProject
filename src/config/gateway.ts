import axios, { AxiosError, type AxiosResponse } from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL,
    timeout: 20000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
})

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError): Promise<any> => {
        return Promise.reject(error);
    }
);

export default api;
