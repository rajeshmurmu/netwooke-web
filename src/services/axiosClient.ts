import useUserStore from "@/store/userStore";
import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export class AxiosClient {
  protected readonly axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  constructor() {
    // Attach token automatically
    this.axiosInstance.interceptors.request.use((config) => {
      const token = useUserStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle refresh logic on 401 responses
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Prevent crash
        if (!error.response) {
          return Promise.reject(error);
        }

        // Prevent infinite loop
        if (originalRequest.url === "/auth/refresh-token") {
          return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const { accessToken, refreshToken } = await this.refreshToken();

            useUserStore.getState().setAccessToken(accessToken);
            useUserStore.getState().setRefreshToken(refreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return this.axiosInstance(originalRequest);
          } catch (err) {
            useUserStore.getState().logout();
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private async refreshToken() {
    try {
      const refreshToken = useUserStore.getState().refreshToken;

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const res = await this.axiosInstance.get("/auth/refresh-token", {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      // console.log("🔐 token refreshed");
      return {
        accessToken: res.data?.data?.accessToken,
        refreshToken: res.data?.data?.refreshToken,
      };
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        throw new Error(
          `API request failed: ${error?.response?.data?.message || error.message}`,
        );
      }

      throw new Error(`API request failed, Refresh token expired`);
    }
  }

  // Generic request handler
  protected async request<T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        method,
        url,
        data,
      });

      return response.data;
    } catch (error) {
      throw new Error(`API request failed: ${error}`);
    }
  }
}

export const axiosClient = new AxiosClient();
