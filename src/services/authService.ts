import { AxiosError } from "axios";
import { AxiosClient } from "./axiosClient";
import type { LoginInput, RegisterInput } from "@/lib/zod/authSchema";

class AuthClient extends AxiosClient {
  constructor() {
    super();
  }

  async login(data: LoginInput) {
    try {
      const response = await this.axiosInstance.post(`/auth/login`, data);
      if (response?.data?.success === false) {
        throw new Error(response?.data?.message);
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        console.log("Error logging in:", error);
        throw new Error(
          error.response?.data?.message ||
            `${
              error.response?.data?.error &&
              "An error occurred while logging in"
            }` ||
            "An error occurred while logging in",
        );
      }
      console.log("Error logging in:", error);
      throw new Error("An error occurred while logging in");
    }
  }

  async register(data: RegisterInput) {
    try {
      const response = await this.axiosInstance.post(`/auth/register`, data);
      if (response?.data?.success === false) {
        throw new Error(response?.data?.message);
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        console.log("Error registering:", error);
        throw new Error(
          error.response?.data?.message ||
            `${
              error.response?.data?.error &&
              "An error occurred while registering"
            }` ||
            "An error occurred while registering",
        );
      }
      console.log("Error registering:", error);
      throw new Error("An error occurred while registering");
    }
  }

  async verifyOtp(otp: string) {
    try {
      const response = await this.axiosInstance.post(`/auth/verify-otp`, {
        otp,
      });
      if (response?.data?.success === false) {
        throw new Error(response?.data?.message);
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        console.log("Error verifying OTP:", error);
        throw new Error(
          error.response?.data?.message ||
            `${
              error.response?.data?.error &&
              "An error occurred while verifying OTP"
            }` ||
            "An error occurred while verifying OTP",
        );
      }
      console.log("Error verifying OTP:", error);
      throw new Error("An error occurred while verifying OTP");
    }
  }

  async setUsername(inputData: { username: string; email: string }) {
    try {
      const response = await this.axiosInstance.post(
        `/auth/username`,
        inputData,
      );
      if (response?.data?.success === false) {
        throw new Error(response?.data?.message);
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        console.log("Error setting username:", error);
        throw new Error(
          error.response?.data?.message ||
            `${
              error.response?.data?.error &&
              "An error occurred while setting username"
            }` ||
            "An error occurred while setting username",
        );
      }
      console.log("Error setting username:", error);
      throw new Error("An error occurred while setting username");
    }
  }

  async logout() {
    try {
      const response = await this.axiosInstance.get(`/auth/logout`);
      if (response?.data?.success === false) {
        throw new Error(response?.data?.message);
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        console.log("Error logging out:", error);
        throw new Error(
          error.response?.data?.message ||
            `${
              error.response?.data?.error &&
              "An error occurred while logging out"
            }` ||
            "An error occurred while logging out",
        );
      }
      console.log("Error logging out:", error);
      throw new Error("An error occurred while logging out");
    }
  }
}

export const authClient = new AuthClient();
