import { AxiosError } from "axios";
import { AxiosClient } from "./axiosClient";

class DairyService extends AxiosClient {
  constructor() {
    super();
  }

  async createEntry(data: {
    title: string;
    content: string;
    isPrivate: boolean;
  }) {
    try {
      const response = await this.axiosInstance.post("/dairy", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.data.success) {
        throw new Error(
          response.data?.message || "Failed to create dairy entry",
        );
      }
      return await response.data;
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        const errorMessage =
          error.response.data?.message || "Failed to create dairy entry";
        console.error("Error response from server:", error.response);
        throw new Error(errorMessage);
      }
      console.error("Error creating dairy entry:", error);
      throw error;
    }
  }

  async getDairyEnteries({ queryKey }: { queryKey: "personal"|"community" }) {
    try {
      const response = await this.axiosInstance.get(`/dairy?q=${queryKey}`);
      if (!response.data.success) {
        throw new Error(
          response.data?.message || "Failed to fetch dairy entries",
        );
      }
      return await response.data;
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        const errorMessage =
          error.response.data?.message || "Failed to fetch dairy entries";
        console.error("Error response from server:", error.response);
        throw new Error(errorMessage);
      }
      console.error("Error fetching dairy entries:", error);
      throw error;
    }
  }
}

export const dairyService = new DairyService();
