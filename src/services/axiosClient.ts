/* eslint-disable @typescript-eslint/no-explicit-any */
import useUserStore from "@/store/userStore";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

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
    method: AxiosRequestConfig["method"],
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.request<T>({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  }

  // Helper methods for common HTTP verbs
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.axiosInstance.get(url, config);
    return data;
  }

  public async post<T>(url: string, body: any,config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.axiosInstance.post(url, body,config);
    return data;
  }

  public async put<T>(url: string, body: any,config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.axiosInstance.put(url, body,config);
    return data;
  }

  public async delete<T>(url: string,config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.axiosInstance.delete(url,config);
    return data;
  }

  public async patch<T>(url: string, body: any,config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.axiosInstance.patch(url, body,config);
    return data;
  }
}

export const axiosClient = new AxiosClient();
