import type { ReactNode } from "react";
import { Navigate } from "react-router";

// Import authentication context for retrieving user and token information
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }: { children: ReactNode }) {
    // Destructure token and user details from the authentication context
    const { token, user } = useAuth();

    // If there's no token or user ID, redirect to the landing or login page
    if (!token || !user?._id) return <Navigate to="/" replace />;

    return children;
}
