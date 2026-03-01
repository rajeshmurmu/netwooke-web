import { AxiosError } from "axios";
import { AxiosClient } from "./axiosClient";
import type { PostInput } from "@/lib/zod/postSchema";

class PostService extends AxiosClient {
  constructor() {
    super();
  }

  async getPosts() {
    try {
      const response = await this.axiosInstance.get("/posts");

      if (response?.data?.success === false) {
        throw new Error(response?.data?.message);
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        console.log("Error fetching posts:", error);
        throw new Error(
          error.response?.data?.message ||
            `${
              error.response?.data?.error &&
              "An error occurred while fetching the posts"
            }` ||
            "An error occurred while fetching the posts",
        );
      }
      console.log("Error fetching posts:", error);
      throw new Error("An error occurred while fetching the posts");
    }
  }

  async createPost(data: PostInput) {
    try {
      const response = await this.axiosInstance.post("/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response?.data?.success === false) {
        throw new Error(response?.data?.message);
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        console.log("Error creating post:", error);
        throw new Error(
          error.response?.data?.message ||
            `${
              error.response?.data?.error &&
              "An error occurred while creating the post"
            }` ||
            "An error occurred while creating the post",
        );
      }
      console.log("Error creating post:", error);
      throw new Error("An error occurred while creating the post");
    }
  }
}

export const postService = new PostService();
