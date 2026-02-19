import { createContext, useContext, useState } from "react";
import type { UserInterface } from "../interfaces/user";
import Loader from "../components/Loader";
import { LocalStorage, requestHandler } from "../utils";
import { loginUser, logoutUser, registerUser } from "../api/auth";

// Create a context to manage authentication-related data and functions
const AuthContext = createContext<{
  user: UserInterface | null;
  token: string | null;
  login: (data: { username: string; password: string }) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  token: null,
  login: async () => { },
  register: async () => { },
  logout: async () => { },
});

// Create a hook to access the AuthContext
const useAuth = () => useContext(AuthContext);

// Create a component that provides authentication-related data and functions
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserInterface | null>(() => {
    const _user = LocalStorage.get("user");
    return _user && _user._id ? _user : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    const _token = LocalStorage.get("token");
    return _token ? _token : null;
  });

  // Function to handle user login
  const login = async (data: { username: string; password: string }) => {
    await requestHandler(
      async () => await loginUser(data),
      setIsLoading,
      (res) => {
        const data = res?.data !== undefined ? res?.data : res;
        setUser(data?.user);
        setToken(data?.accessToken);
        LocalStorage.set("user", data?.user);
        LocalStorage.set("token", data?.accessToken);
      },
      alert // Display error alerts on request failure
    );
  };

  // Function to handle user registration
  const register = async (data: {
    email: string;
    username: string;
    password: string;
  }) => {
    await requestHandler(
      async () => await registerUser(data),
      setIsLoading,
      () => {
        alert("Account created successfully! Go ahead and login.");
      },
      alert // Display error alerts on request failure
    );
  };

  // Function to handle user logout
  const logout = async () => {
    await requestHandler(
      async () => await logoutUser(),
      setIsLoading,
      () => {
        setUser(null);
        setToken(null);
        LocalStorage.clear(); // Clear local storage on logout
      },
      alert // Display error alerts on request failure
    );
  };

  // Provide authentication-related data and functions through the context
  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {isLoading ? <Loader /> : children} {/* Display a loader while loading */}
    </AuthContext.Provider>
  );

};
// Export the context, provider component, and custom hook
// eslint-disable-next-line react-refresh/only-export-components
export { AuthContext, AuthProvider, useAuth };