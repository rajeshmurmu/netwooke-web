import { AxiosError, type AxiosResponse } from "axios";

// Check if the code is running in a browser environment
export const isBrowser = typeof window !== "undefined";

export class LocalStorage {
  // Get a value from local storage by key
  static get(key: string) {
    if (!isBrowser) return;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (err) {
        console.error(err);
        return null;
      }
    }
    return null;
  }

  // Set a value in local storage by key
  static set(key: string, value: string | object) {
    if (!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Remove a value from local storage by key
  static remove(key: string) {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  }

  // Clear all items from local storage
  static clear() {
    if (!isBrowser) return;
    localStorage.clear();
  }
}

export const requestHandler = async (
  api: () => Promise<AxiosResponse>,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: AxiosResponse) => void,
  onError: (error: string) => void,
) => {
  // Show loading state if setLoading function is provided
  setLoading?.(true);
  try {
    // Make the API request
    const response = await api();
    const { data } = response;

    if (data?.success) {
      // Call the onSuccess callback with the response data
      onSuccess(data);
    }
  } catch (error: unknown | AxiosError) {
    if (error instanceof AxiosError) {
      if (error?.response)
        if ([401, 403].includes(error?.response.data?.statusCode)) {
          // Handle error cases, including unauthorized and forbidden cases
          localStorage.clear(); // Clear local storage on authentication issues
          if (isBrowser) window.location.href = "/login"; // Redirect to login page
        }
      onError(error?.response?.data?.message || "Something went wrong");
    }
  } finally {
    // Hide loading state if setLoading function is provided
    setLoading?.(false);
  }
};
