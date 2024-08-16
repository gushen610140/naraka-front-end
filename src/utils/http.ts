import axios, { AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_DEV_SERVER,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["token"] = token;
  }
  // 最后返回 config
  return config;
});

const http = async <T>(config: AxiosRequestConfig): Promise<Result<T>> => {
  const { data } = await instance.request<Result<T>>(config);
  return data;
};

export default http;
