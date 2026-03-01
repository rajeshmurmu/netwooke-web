import { createContext, useContext, useState } from "react";
import Loader from "../components/Loader";
import { isBrowser, LocalStorage } from "../utils";
import { authClient } from "../services/authService";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import type { RegisterInput } from "@/lib/zod/authSchema";

interface IAuthContext {
  user: RegisterInput | null;
  register: (credentials: RegisterInput) => Promise<void>;
  step: "register" | "verify-otp" | "username"
  setStep: (step: "register" | "verify-otp" | "username") => void
  setUser: (user: RegisterInput | null) => void
  setIsLoading: (isLoading: boolean) => void
}

// Create a context to manage authentication-related data and functions
const AuthContext = createContext<IAuthContext>({
  user: null,
  step: "register",
  setStep: () => { },
  register: async () => { },
  setUser: () => { },
  setIsLoading: () => { }
});

// Create a hook to access the AuthContext
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Create a component that provides authentication-related data and functions
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<RegisterInput | null>(() => {
    const _user = LocalStorage.get("user");
    return _user && _user._id ? _user : null;
  });
  const [step, setStep] = useState<"register" | "verify-otp" | "username">("register");


  // Function to handle user registration
  const register = async (userCredentials: {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const res = await authClient.register(userCredentials);
      const data = res?.data !== undefined ? res?.data : res;

      if (data?.success) {
        toast.success(data?.message || "OTP sent to your email");
        window.location.href = ("/register?step=verify-otp&email=" + data.email);
      }


      toast.success(data?.message || "OTP sent to your email");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error?.response)
          if ([401, 403].includes(error?.response.status)) {
            // Handle error cases, including unauthorized and forbidden cases
            localStorage.clear(); // Clear local storage on authentication issues
            if (isBrowser) window.location.href = "/login"; // Redirect to login page
          }

        if (error?.response?.status === 409) {
          if (isBrowser) window.location.href = "/login";
        }
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }
  };

  // Provide authentication-related data and functions through the context
  return (
    <AuthContext.Provider value={{ user, register, step, setStep, setUser, setIsLoading }}>
      {isLoading ? <Loader /> : children} {/* Display a loader while loading */}
    </AuthContext.Provider>
  );

};


// Export the context, provider component, and custom hook
// eslint-disable-next-line react-refresh/only-export-components
export { AuthContext, AuthProvider, useAuth };