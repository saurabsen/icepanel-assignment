import axios from "axios";
import { useRouter } from "vue-router";
const setupAxiosInstance = () => {
  const router = useRouter();
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default setupAxiosInstance;
