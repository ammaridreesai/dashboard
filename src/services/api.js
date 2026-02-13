import axios from "axios";

//const BASE_URL = "https://thefmastery.co.uk"; // For production
const BASE_URL = "http://18.170.98.40:3200"; //Staging
//const BASE_URL = "http://localhost:3200"; // For local development

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("refresh_token");

          if (refreshToken) {
            const response = await axios.post(
              `${BASE_URL}/authentication/refresh`,
              {
                refresh_token: refreshToken,
              },
            );

            if (response.data.isRequestSuccessful) {
              const { access_token, refresh_token } =
                response.data.successResponse;

              localStorage.setItem("access_token", access_token);
              localStorage.setItem("refresh_token", refresh_token);

              originalRequest.headers.Authorization = `Bearer ${access_token}`;
              return apiClient(originalRequest);
            }
          }
        }
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
