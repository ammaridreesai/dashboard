import apiClient from "./api";

export const authService = {
  async login(email, password) {
    try {
      const response = await apiClient.post("/authentication/login", {
        Email: email,
        Password: password,
      });

      if (response.data.isRequestSuccessful) {
        const { access_token, refresh_token, user } =
          response.data.successResponse;

        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          localStorage.setItem("user", JSON.stringify(user));
        }

        return {
          success: true,
          data: response.data.successResponse,
        };
      } else {
        return {
          success: false,
          message: response.data.errorResponse?.message || "Login failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.errorResponse?.message ||
          "An error occurred during login",
      };
    }
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  },

  getUser() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  getAccessToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  },

  isAuthenticated() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      return !!token;
    }
    return false;
  },
};
