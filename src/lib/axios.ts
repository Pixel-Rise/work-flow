import axios, {type AxiosHeaderValue, type HeadersDefaults } from "axios";
import { refreshToken } from "@/lib/refresh-token";

type Headers = {
  "Content-Type": string;
  Authorization: string;
} & { [key: string]: AxiosHeaderValue };

const API_URL = import.meta.env.VITE_API_URL;

const publicAxiosClient = axios.create({
  baseURL: API_URL,
});

const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.defaults.headers = {
  "Content-Type": "application/json",
} as Headers & HeadersDefaults;

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const config = err.config;

    if (config.url !== "/login" && err.response) {
      if (err.response.status === 403 && !config?.sent) {
        config.sent = true;
        localStorage.removeItem("accessToken");
        const result = await refreshToken();
        if (result?.accessToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${result?.accessToken}`,
          };
          return axios(config);
        }
      }
    }
    return Promise.reject(err);
  },
);

export default axiosClient;
export { publicAxiosClient };