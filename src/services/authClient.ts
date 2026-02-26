import { AxiosClient } from "./axiosClient";
import type { LoginInput, RegisterInput } from "@/lib/zod/authSchema";

class AuthClient extends AxiosClient {
  constructor() {
    super();
  }

  async login(data: LoginInput) {
    return this.axiosInstance.post(`/auth/login`, data);
  }

  async register(data: RegisterInput) {
    return this.axiosInstance.post(`/auth/register`, data);
  }

  async verifyOtp(otp: string) {
    return this.axiosInstance.post(`/auth/verify-otp`, { otp });
  }

  setUsername(inputData: { username: string; email: string }) {
    return this.axiosInstance.post(`/auth/username`, inputData);
  }

  async logout() {
    return this.axiosInstance.get(`/auth/logout`);
  }
}

export const authClient = new AuthClient();
