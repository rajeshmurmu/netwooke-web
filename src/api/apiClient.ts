import { LocalStorage } from "@/utils";
import type { AxiosInstance } from "axios";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
export class APIClient {
  private axiosInstance: AxiosInstance;
  private token: string | null;
  private tokenExpiry: number | null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
    });

    this.token = LocalStorage.get("token");
    this.tokenExpiry = Date.now() + 14 * 60 * 60 * 1000; // 15 minutes
  }

  private async refreshToken() {
    const res = await this.axiosInstance.get("/auth/refresh-token", {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    this.token = res.data.token;
    this.tokenExpiry = Date.now() + 15 * 60 * 60 * 1000; // 15 minutes
    console.log("🔐 token refreshed");
    return this.token;
  }

  private async getToken() {
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }
    return await this.refreshToken();
  }

  // Generic request handler
  async request<T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
  ): Promise<T> {
    const token = await this.getToken();

    const response = await this.axiosInstance.request<T>({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
}
