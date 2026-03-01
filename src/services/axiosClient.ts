import useUserStore from "@/store/userStore";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export class AxiosClient {
  protected readonly axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  private accessToken: string | null;

  constructor() {
    this.accessToken = useUserStore.getState().accessToken;
    // console.log("🔐 token", this.token);
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // Attempt to refresh the access token
            const { accessToken, refreshToken } = await this.refreshToken();
            useUserStore.getState().setAccessToken(accessToken);
            useUserStore.getState().setRefreshToken(refreshToken);
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return this.axiosInstance.request(originalRequest);
          } catch (error) {
            // Refresh token expired, handle the error
            // window.location.href = "/";
            throw new Error(
              `API request failed, Refresh token expired: ${error}`,
            );
          }
        }
        return Promise.reject(error);
      },
    );
  }

  private async refreshToken() {
    try {
      const res = await this.axiosInstance.get("/auth/refresh-token", {
        headers: {
          Authorization: `Bearer ${useUserStore.getState().refreshToken}`,
        },
      });
      this.accessToken = res.data?.data?.accessToken;
      console.log("🔐 token refreshed");
      return {
        accessToken: res.data?.data?.accessToken,
        refreshToken: res.data?.data?.refreshToken,
      };
    } catch (error) {
      // if the refresh token fails, log out the user
      useUserStore.getState().logout();
      throw new Error(`API request failed, Refresh token expired: ${error}`);
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
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`API request failed: ${error}`);
    }
  }
}

export const axiosClient = new AxiosClient();
