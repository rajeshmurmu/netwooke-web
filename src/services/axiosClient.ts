import { LocalStorage } from "@/utils";
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

  private token: string | null;

  constructor() {
    this.token = LocalStorage.get("token");

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && originalRequest._retry !== true) {
          originalRequest._retry = true;
          try {
            // Attempt to refresh the access token
            const token = await this.refreshToken();
            LocalStorage.set("token", token!);
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return this.axiosInstance.request(originalRequest);
          } catch (error) {
            // Refresh token expired, handle the error
            window.location.href = "/login";
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
    const res = await this.axiosInstance.get("/auth/refresh-token", {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    this.token = res.data.token;
    console.log("🔐 token refreshed");
    return this.token;
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
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`API request failed: ${error}`);
    }
  }
}

export const axiosClient = new AxiosClient();
