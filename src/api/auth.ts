import type { AxiosResponse } from "axios";

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  // mock login
  await Promise.resolve(setTimeout(() => {}, 2000));
  return {
    data: {
      accessToken: "mockAccessToken",
      user: {
        _id: "mockUserId",
        username: data.username,
        email: "example@gmail.com",
        createdAt: "mockCreatedAt",
        updatedAt: "mockUpdatedAt",
      },
      status: 200,
      success: true,
    },
  } as AxiosResponse;
};

export const registerUser = async (data: {
  email: string;
  username: string;
  password: string;
}) => {
  // mock register
  await Promise.resolve(setTimeout(() => {}, 2000));
  return {
    data: {
      accessToken: "mockAccessToken",
      status: 201,
      user: {
        _id: "mockUserId",
        username: data.username,
        email: data.email,
        createdAt: "mockCreatedAt",
        updatedAt: "mockUpdatedAt",
      },
    },
  } as unknown as AxiosResponse;
};

export const logoutUser = async () => {
  // mock logout
  await Promise.resolve(setTimeout(() => {}, 2000));
  return {
    data: {
      success: true,
    },
  } as AxiosResponse;
};
