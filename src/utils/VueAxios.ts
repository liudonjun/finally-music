import axios from "axios";

const VueAxios = axios.create({
  timeout: 3000 * 10,
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

VueAxios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

VueAxios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default VueAxios;
