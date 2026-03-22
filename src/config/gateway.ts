import axios, { AxiosError, type AxiosResponse } from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL,
    timeout: 5000,
    headers: { "Content-Type": "application/json" }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`

        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError): Promise<any> => {
        return Promise.reject(error);
    }
);

export default api;
