import { AxiosClient } from "./axiosClient";

class GenAIClient extends AxiosClient {
  constructor() {
    super();
  }

  async generateReflectionPrompt() {
    return this.axiosInstance.get(`/genai/get-reflection-prompt`);
  }

  async moderateContent(content: string) {
    return this.axiosInstance.post(`/genai/verify-moderatenity`, { content });
  }
}

export const genaiClient = new GenAIClient();
